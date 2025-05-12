import React, {useState, useEffect, useCallback} from 'react';
import {Spin, Modal, Input, Button} from 'antd';
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';

import {Product, ProductRequestModelForProductOrderList} from '../../models/productModel';
import {AttributeSetModel} from '../../models/attributeModel';
import {getDistinctAttributeSetsByCategoryId, getProductListByCategoryId, updateProductListOrderForHomeScreen} from '../../services/HomeService';
import CategoryAttribute from './CategoryAttribute';
import {useNavigate} from 'react-router';
import {useNotification} from '../../hook/useNotification';
import {getSessionItem, setSessionItem} from '../../services/DataService';
import {CSS} from '@dnd-kit/utilities';
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy, useSortable} from '@dnd-kit/sortable';
import {ApiResponse} from '../../models/generalModel';

interface ProductDisplayProps {
  selectedCategory: string;
  onProductSelected: (productId: number | undefined) => void;
  refreshKey?: number;
}

function ProductDisplay({selectedCategory, onProductSelected, refreshKey}: ProductDisplayProps) {
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProductAttributes, setAllProductAttributes] = useState<(Product | AttributeSetModel)[]>([]);
  const [filteredData, setFilteredData] = useState<(Product | AttributeSetModel)[]>([]);
  const [displayText, setDisplayText] = useState('Click a category to view the product');
  const [loading, setLoading] = useState(false);
  const [categoryAttriIsVisible, setCategoryAttriIsVisible] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const notify = useNotification();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!selectedCategory) {
      setProducts([]);
      setAllProductAttributes([]);
      setFilteredData([]);
      onProductSelected(undefined);
      setDisplayText('Click a category to view the product');
      return;
    }

    setLoading(true);
    setDisplayText('');

    try {
      const [productListResponse, attributeListResponse] = await Promise.all([getProductListByCategoryId(selectedCategory), getDistinctAttributeSetsByCategoryId(selectedCategory)]);

      let currentProducts: Product[] = [];
      if (productListResponse.isSuccess && productListResponse.value) {
        // currentProducts = productListResponse.value.filter((p: Product) => p?.akiProductIsActive).sort((a, b) => (a.akiProductListOrder ?? 0) - (b.akiProductListOrder ?? 0));
        currentProducts = productListResponse.value.sort((a, b) => (a.akiProductListOrder ?? 0) - (b.akiProductListOrder ?? 0));
        setProducts(currentProducts);
      } else {
        setProducts([]);
      }

      let currentAttributeSets: AttributeSetModel[] = [];
      if (attributeListResponse.isSuccess && attributeListResponse.value) {
        currentAttributeSets = attributeListResponse.value;
      }

      const combinedData: (Product | AttributeSetModel)[] = [...(Array.isArray(currentProducts) ? currentProducts : []), ...(Array.isArray(currentAttributeSets) ? currentAttributeSets : [])];
      setAllProductAttributes(combinedData);

      const currentSearchValue = searchValue?.toLowerCase().replace(/\s/g, '') || '';
      if (currentSearchValue) {
        const filtered = combinedData.filter((item) => {
          const normalize = (str: string | undefined) => str?.toLowerCase().replace(/\s/g, '') || '';
          return (
            ('akiProductName' in item && normalize(item.akiProductName).includes(currentSearchValue)) || ('attributeSetName' in item && normalize(item.attributeSetName).includes(currentSearchValue))
          );
        });
        setFilteredData(filtered);
        if (filtered.length === 0) setDisplayText('No Data');
      } else {
        setFilteredData(combinedData);
        if (combinedData.length === 0) setDisplayText('No Product or Attribute Sets Found');
        else setDisplayText('');
      }

      if (getSessionItem('tempCategoryId') && currentProducts.length > 0) {
        setSessionItem('tempProductId', currentProducts[0].akiProductID.toString());
        onProductSelected(currentProducts[0].akiProductID);
      }

      const persistedProductId = getSessionItem('productId') ? getSessionItem('productId') : getSessionItem('tempProductId');
      if (persistedProductId) {
        const numProductId = Number(persistedProductId);

        if (currentProducts.some((p) => p.akiProductID === numProductId)) {
          setSelectedProduct(numProductId);
        } else {
          sessionStorage.removeItem('productId');
          setSelectedProduct(undefined);
        }
      } else {
        setSelectedProduct(undefined);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      notify.error('Failed to load data');
      setDisplayText('Error loading data');
      setProducts([]);
      setAllProductAttributes([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchValue, notify, onProductSelected]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, refreshKey, fetchData]);

  useEffect(() => {
    fetchData();
    if (selectedCategory && !getSessionItem('tempCategoryId')) {
      setSessionItem('CategoryId', selectedCategory);
    } else {
      setProducts([]);
      setFilteredData([]);
      setDisplayText('Click a category to view the product');
    }
  }, [selectedCategory, fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const searchText = value?.toLowerCase().replace(/\s/g, '') || '';

    if (!searchText) {
      setFilteredData([...allProductAttributes]);
      if (allProductAttributes.length === 0 && selectedCategory) setDisplayText('No Product or Attribute Sets Found');
      else if (!selectedCategory) setDisplayText('Click a category to view the product');
      else setDisplayText('');
      return;
    }

    const filtered = allProductAttributes.filter((item) => {
      const normalize = (str: string | undefined) => str?.toLowerCase().replace(/\s/g, '') || '';
      return ('akiProductName' in item && normalize(item.akiProductName).includes(searchText)) || ('attributeSetName' in item && normalize(item.attributeSetName).includes(searchText));
    });

    setFilteredData(filtered);
    setDisplayText(filtered.length === 0 ? 'No Data Found Matching Search' : '');
  };

  const clearSearchText = () => {
    setSearchValue('');
    setFilteredData([...allProductAttributes]);
    if (allProductAttributes.length === 0 && selectedCategory) setDisplayText('No Product or Attribute Sets Found');
    else if (!selectedCategory) setDisplayText('Click a category to view the product');
    else setDisplayText('');
  };

  const handleProductClick = (product: Product) => {
    if (!product || !product.akiProductID) return;
    setSelectedProduct(product.akiProductID);

    setSessionItem('productId', product.akiProductID.toString());
    if (getSessionItem('tempDepartmentId') && getSessionItem('tempCategoryId')) {
      const dept = getSessionItem('tempDepartmentId');
      setSessionItem('departmentId', dept);
      const categoryId = getSessionItem('tempCategoryId');
      setSessionItem('CategoryId', categoryId);
    }

    sessionStorage.removeItem('tempDepartmentId');
    sessionStorage.removeItem('tempCategoryId');
    sessionStorage.removeItem('tempProductId');
    sessionStorage.removeItem('tempItemNumber');
    sessionStorage.removeItem('itemNumber');
    onProductSelected(product.akiProductID);
  };

  const handleAttributeSetClick = (attributeSet: AttributeSetModel) => {
    if (!attributeSet || !attributeSet.akiCategoryID) return;
    setSelectedProduct(attributeSet.akiCategoryID);
    setCategoryData(attributeSet);
    sessionStorage.removeItem('productId');
    sessionStorage.removeItem('tempProductId');
    sessionStorage.removeItem('itemNumber');
    sessionStorage.removeItem('tempItemNumber');
    onProductSelected(undefined);
    setCategoryAttriIsVisible(true);
  };

  const handleEditProduct = () => {
    const productToEdit = products.find((p) => p.akiProductID === selectedProduct);
    if (!productToEdit) {
      notify.error('Please select a product name from the list to edit.');
      return;
    }

    navigate('/products/edit');
    setCategoryData(productToEdit);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleAttributeModalCancel = () => {
    setCategoryAttriIsVisible(false);
    setCategoryData({});
    fetchData();
  };

  const inputSuffix = searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />;
  //drag and drop
  const SortableItem = ({
    item,
    selectedProduct,
    handleProductClick,
    handleAttributeSetClick,
  }: {
    item: Product | AttributeSetModel;
    selectedProduct: number | undefined;
    handleProductClick: (item: Product) => void;
    handleAttributeSetClick: (item: AttributeSetModel) => void;
  }) => {
    const id = 'akiProductID' in item ? item.akiProductID : `attr-${item.akiCategoryID}`;

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: 'grab',
    };

    if ('akiProductID' in item) {
      const isSelected = selectedProduct === item.akiProductID;
      return (
        <li
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          key={`prod-${item.akiProductID}`}
          className={`px-2 py-1 cursor-pointer text-[10px] transition-colors duration-300 ${isSelected ? 'bg-primary-theme-active' : 'hover:bg-gray-100 text-secondary-font'}`}
          onClick={() => handleProductClick(item)}
        >
          {item.akiProductName}
        </li>
      );
    } else if ('attributeSetName' in item) {
      return (
        <li
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          key={`attr-${item.akiCategoryID}`}
          className="px-2 py-1 cursor-pointer text-[10px] text-secondary-font transition-colors duration-300 hover:bg-gray-100"
          onClick={() => handleAttributeSetClick(item)}
        >
          <span className="text-primary-theme italic">{item.attributeSetName}</span>
        </li>
      );
    }
    return null;
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 5},
    })
  );

  const handleDragEnd = async (event: any) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      const newIndex = products.findIndex((item) => item.akiProductID === over.id);

      setLoading(true);
      try {
        const data = products.find((product) => product.akiProductID === active.id);
        if (!data) {
          notify.error('product not found.');
          setLoading(false);
          return;
        }

        const oldListOrder = data.akiProductListOrder || 0;
        const newListOrder = products[newIndex]?.akiProductListOrder || 0;

        const updateRequest: ProductRequestModelForProductOrderList = {
          akiProductID: Number(data.akiProductID),
          newlistorder: newListOrder,
          oldlistorder: oldListOrder,
        };

        const response: ApiResponse<string> = await updateProductListOrderForHomeScreen(updateRequest);
        if (response.isSuccess) {
          fetchData();
          notify.success('product order updated successfully.');
        } else {
          notify.error('Failed to update product order.');
        }
      } catch (error) {
        console.error('Error updating product order:', error);
        notify.error('Failed to update product order.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border border-border rounded-[5px] w-full bg-white overflow-hidden">
      <div className="bg-[#E2E8F0] text-primary-font text-[11px] font-semibold px-2 py-[5px] border-b border-border flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span>Products & Attribute Sets</span>
          <Button type="link" size="small" onClick={handleAddProduct} className="p-0">
            Add
          </Button>
          <Button type="link" size="small" onClick={handleEditProduct} disabled={getSessionItem('productId') || getSessionItem('tempProductId') ? false : true} className="p-0">
            Edit
          </Button>
        </div>
        <div className="w-40">
          <Input placeholder="Search" value={searchValue} onChange={handleSearchChange} suffix={inputSuffix} className="rounded" />
        </div>
      </div>

      <Spin spinning={loading}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredData.filter((item) => !('attributeSetName' in item && item.attributeSetName)).map((item) => ('akiProductID' in item ? item.akiProductID : `attr-${item.akiCategoryID}`))}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col justify-center items-center bg-white min-h-[48px]">
              {filteredData && filteredData.length > 0 ? (
                <ul className="divide-y divide-border p-0 m-0 overflow-y-auto max-h-[700px] lg:max-h-[700px] md:max-h-[50vh] sm:max-h-[40vh] w-full">
                  {filteredData.map((item) => (
                    <SortableItem
                      key={'akiProductID' in item ? `prod-${item.akiProductID}` : `attr-${item.akiCategoryID}`}
                      item={item}
                      handleProductClick={handleProductClick}
                      handleAttributeSetClick={handleAttributeSetClick}
                      selectedProduct={selectedProduct}
                    />
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-12 text-secondary-font text-[10px] text-center">{displayText}</div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </Spin>

      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Attribute Set Form</span>
            <Button type="default" onClick={handleAttributeModalCancel}>
              Close
            </Button>
          </div>
        }
        open={categoryAttriIsVisible}
        onCancel={handleAttributeModalCancel}
        footer={null}
        width={1100}
        destroyOnClose
        closable={false}
      >
        {categoryData && <CategoryAttribute categoryData={categoryData} onDataChange={handleAttributeModalCancel} />}
      </Modal>
    </div>
  );
}

export default ProductDisplay;
