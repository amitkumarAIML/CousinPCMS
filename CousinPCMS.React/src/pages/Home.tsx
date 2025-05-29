import {useState, useEffect, useCallback} from 'react';
import ProductDisplay from '../components/home/ProductDisplay';
import TreeView from '../components/home/TreeView';
import SkusDisplay from '../components/home/SkusDisplay';
import {getSessionItem} from '../services/DataService';
import {closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {useNotification} from '../hook/useNotification';
import {Product, ProductRequestModelForProductOrderList, UpdateProductToCategoryRequest} from '../models/productModel';
import {getProductListByCategoryId, linkProductToCategory, updateProductListOrderForHomeScreen} from '../services/HomeService';
import {Modal} from 'antd';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [productRefreshKey, setProductRefreshKey] = useState<number>(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({
    title: '',
    content: '',
    onOk: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    const storedCategoryId = getSessionItem('CategoryId');
    const storedProductId = getSessionItem('productId');
    if (storedCategoryId) setSelectedCategory(storedCategoryId);
    if (storedProductId && !isNaN(Number(storedProductId))) setSelectedProductId(Number(storedProductId));
  }, []);

  // --- Callback for category selection ---
  const handleCategorySelected = useCallback((categoryId: number | undefined) => {
    const categoryIdStr = categoryId?.toString() || '';
    setSelectedCategory(categoryIdStr);
    setProductRefreshKey(0);
  }, []);

  // New state for products managed by Home
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const notify = useNotification();

  // Fetch products when selectedCategory or refreshKey changes
  const fetchProductsForCategory = useCallback(
    async (categoryId: string) => {
      if (!categoryId) {
        setProducts([]);
        return;
      }
      setIsLoadingProducts(true);
      try {
        const response = await getProductListByCategoryId(categoryId);
        if (response.isSuccess && response.value) {
          // const sortedProducts = response.value.filter((p: Product) => p?.akiProductIsActive).sort((a, b) => (a.akiProductListOrder ?? 0) - (b.akiProductListOrder ?? 0));
          const sortedProducts = response.value.sort((a, b) => (a.akiProductListOrder || 0) - (b.akiProductListOrder || 0));
          setProducts(sortedProducts);
        } else {
          setProducts([]);
          // notify.error(response.message || 'Failed to load products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        notify.error('An error occurred while fetching products.');
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [notify]
  ); // Added notify dependency

  const triggerProductRefresh = useCallback(() => {
    setProductRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    const storedCategoryId = getSessionItem('CategoryId');
    const storedProductId = getSessionItem('productId');
    if (storedCategoryId) {
      setSelectedCategory(storedCategoryId);
      fetchProductsForCategory(storedCategoryId); // Fetch products for initially stored category
    }
    if (storedProductId && !isNaN(Number(storedProductId))) {
      setSelectedProductId(Number(storedProductId));
    }
  }, [fetchProductsForCategory]); // fetchProductsForCategory will be stable due to useCallback

  // D&D Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // User must drag further to initiate
      },
    })
  );

  // Global Drag End Handler
  const handleDragEndGlobal = async (event: DragEndEvent) => {
    const {active, over} = event;
    if (!over) return;

    const activeDataType = active.data.current?.type;
    const activePayload = active.data.current?.payload as Product | undefined;
    const activeIsSortable = active.data.current?.isSortable;

    const overDataType = over.data.current?.type;
    const overCategoryId = over.data.current?.categoryId;

    // Case 1: Product dropped onto a Category in TreeView
    if (activeDataType === 'product' && activePayload && overDataType === 'category-target' && overCategoryId) {
      const draggedProduct = activePayload as Product;

      if (draggedProduct.akiCategoryID === overCategoryId) {
        notify.info(`Product "${draggedProduct.akiProductName}" is already in this category.`);
        return;
      }
      const targetCategoryName = over?.data.current?.categoryName;

      setConfirmModalProps({
        title: 'Link Product To Category',
        content: `Are you sure you want to move product "${draggedProduct.akiProductName}" to the category "${targetCategoryName}"?`,
        async onOk() {
          try {
            setIsLoadingProducts(true); // Show loading indicator
            const data: UpdateProductToCategoryRequest = {
              productid: draggedProduct.akiProductID,
              categoryid: overCategoryId,
            };
            const response = await linkProductToCategory(data);
            if (response.isSuccess) {
              notify.success(response.value || 'Product linked to new category successfully.');
              triggerProductRefresh(); // This will refetch products for the current selectedCategory
              setIsConfirmModalVisible(false);
            } else {
              notify.error('Failed to link product.');
            }
          } catch (error) {
            console.error('Error linking product to category:', error);
            notify.error('An error occurred during product linking.');
          } finally {
            setIsLoadingProducts(false);
          }
        },
        onCancel() {
          setIsConfirmModalVisible(false);
        },
      });
      setIsConfirmModalVisible(true);
    }
    // Case 2: Product reordered within ProductDisplay's list
    else if (active.id !== over.id && activeDataType === 'product' && activeIsSortable && activePayload) {
      const draggedItem = products.find((p) => p.akiProductID === active.id);
      const targetItem = products.find((p) => p.akiProductID === over.id);
      if (!draggedItem) {
        notify.error('Dragged product not found for reordering.');
        return;
      }

      if (!targetItem) {
        notify.error('Target product not found for reordering.');
        return;
      }
      const updateRequest: ProductRequestModelForProductOrderList = {
        akiProductID: Number(draggedItem.akiProductID),
        newlistorder: targetItem.akiProductListOrder || 0,
        oldlistorder: draggedItem.akiProductListOrder || 0,
      };

      try {
        // setIsLoadingProducts(true); // Already handled by optimistic update, maybe a subtle loading state?
        const response = await updateProductListOrderForHomeScreen(updateRequest);
        if (response.isSuccess) {
          notify.success('Product order updated successfully.');
          // await fetchProductsForCategory(selectedCategory);
          triggerProductRefresh();
        } else {
          notify.error('Failed to update product order.');
          setProducts(products); // Revert optimistic update
        }
      } catch (error) {
        console.error('Error updating product order:', error);
        notify.error('An error occurred while updating product order.');
        setProducts(products); // Revert optimistic update
      } finally {
        // setIsLoadingProducts(false);
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-2 m-2">
        <div className="lg:col-span-5">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndGlobal}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className="p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)]">
                <TreeView onCategorySelected={handleCategorySelected} onAttributeSetChange={triggerProductRefresh} />
              </div>
              <div className="p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)] ">
                <ProductDisplay
                  selectedCategory={selectedCategory}
                  onProductSelected={setSelectedProductId}
                  refreshKey={productRefreshKey}
                  productsData={products} // Pass managed products
                  isLoadingProducts={isLoadingProducts} // Pass loading state
                  onProductReorder={async () => {}} // Placeholder, logic is now in Home's handleDragEndGlobal
                />
              </div>
            </div>
          </DndContext>
        </div>
        <div className="lg:col-span-7 p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)]">
          <SkusDisplay selectedProductId={selectedProductId} selectedCategory={selectedCategory} />
        </div>
      </div>
      <Modal title={confirmModalProps.title} open={isConfirmModalVisible} onOk={confirmModalProps.onOk} onCancel={confirmModalProps.onCancel} okText="Confirm" cancelText="Close" destroyOnClose>
        <p>{confirmModalProps.content}</p>
      </Modal>
    </div>
  );
};

export default Home;
