import React, {useState, useEffect, useCallback} from 'react';
import {Spin, Modal, Input} from 'antd'; // Import antd components
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons'; // Import icons

// Assume these child components exist
import {Product} from '../../models/productModel';
import {AttributeSetModel} from '../../models/attributeModel';
import {getDistinctAttributeSetsByCategoryId, getProductListByCategoryId} from '../../services/HomeService';
import {useNotification} from '../../contexts.ts/useNotification';
import ProductComponent from '../../pages/Product';
import CategoryAttribute from './CategoryAttribute';

interface ProductDisplayProps {
  selectedCategory: string;
  onProductSelected: (productId: number | undefined) => void;
}

function ProductDisplay({selectedCategory, onProductSelected}: ProductDisplayProps) {
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [lstAllAttributeSets, setLstAllAttributeSets] = useState<AttributeSetModel[]>([]);
  const [allProductAttributes, setAllProductAttributes] = useState<(Product | AttributeSetModel)[]>([]);
  const [filteredData, setFilteredData] = useState<(Product | AttributeSetModel)[]>([]);
  const [displayText, setDisplayText] = useState('Click a category to view the product');
  const [loading, setLoading] = useState(false);
  const [categoryAttriIsVisible, setCategoryAttriIsVisible] = useState(false);
  const [categoryProductVisible, setCategoryProductVisible] = useState(false);
  const [categoryData, setCategoryData] = useState({}); // Data for attribute modal
  const [searchValue, setSearchValue] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const notify = useNotification();

  const fetchData = useCallback(async () => {
    if (!selectedCategory) {
      setProducts([]);
      setLstAllAttributeSets([]);
      setAllProductAttributes([]);
      setFilteredData([]);
      onProductSelected(undefined);
      setDisplayText('Click a category to view the product');
      return;
    }

    setLoading(true);
    setDisplayText(''); // Clear display text while loading

    try {
      const [productListResponse, attributeListResponse] = await Promise.all([getProductListByCategoryId(selectedCategory), getDistinctAttributeSetsByCategoryId(selectedCategory)]);

      let currentProducts: Product[] = [];
      if (productListResponse.isSuccess && productListResponse.value) {
        currentProducts = productListResponse.value.filter((p: Product) => p?.akiProductIsActive);
        setProducts(currentProducts);
      } else {
        setProducts([]);
      }

      let currentAttributeSets: AttributeSetModel[] = [];
      if (attributeListResponse.isSuccess && attributeListResponse.value) {
        currentAttributeSets = attributeListResponse.value;
        setLstAllAttributeSets(currentAttributeSets);
      } else {
        setLstAllAttributeSets([]);
        notify.error('Failed to load attribute sets');
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

      // Re-select product from session storage if it exists after data loads
      const persistedProductId = sessionStorage.getItem('productId');
      if (persistedProductId) {
        const numProductId = Number(persistedProductId);
        // Ensure the persisted product is actually in the newly loaded list
        if (currentProducts.some((p) => p.akiProductID === numProductId)) {
          setSelectedProduct(numProductId);
        } else {
          // Product ID from session storage is not in the current category's list
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
      setLstAllAttributeSets([]);
      setAllProductAttributes([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchValue, notify]); // Re-run fetch if category or search changes (search handled internally now)

  useEffect(() => {
    const persistedProductId = sessionStorage.getItem('productId');
    const persistedCategoryId = sessionStorage.getItem('CategoryId');

    if (persistedCategoryId === selectedCategory && persistedProductId) {
      setSelectedProduct(Number(persistedProductId));
    } else {
      setSelectedProduct(undefined);
      sessionStorage.removeItem('productId');
    }

    fetchData(); // fetch when category changes

    if (selectedCategory) {
      sessionStorage.setItem('CategoryId', selectedCategory);
    } else {
      sessionStorage.removeItem('CategoryId');
      setProducts([]);
      setDisplayText('Click a category to view the product');
    }
  }, [selectedCategory, fetchData]);

  // --- Search Handling ---
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

  // --- Event Handlers ---
  const handleProductClick = (product: Product) => {
    if (!product || !product.akiProductID) return;
    setSelectedProduct(product.akiProductID);
    sessionStorage.setItem('productId', product.akiProductID.toString());
    sessionStorage.removeItem('itemNumber');
    onProductSelected(product.akiProductID);
  };

  const handleAttributeSetClick = (attributeSet: AttributeSetModel) => {
    if (!attributeSet || !attributeSet.akiCategoryID) return;
    setSelectedProduct(attributeSet.akiCategoryID); // Using akiCategoryID for selection highlight
    setCategoryData(attributeSet);
    sessionStorage.removeItem('productId');
    onProductSelected(undefined);
    setCategoryAttriIsVisible(true);
  };

  const handleEditProduct = () => {
    const productToEdit = products.find((p) => p.akiProductID === selectedProduct);
    if (!productToEdit) {
      notify.error('Please select a product name from the list to edit.');
      return;
    }
    // Pass product data to the ProductForm modal for editing
    setCategoryData(productToEdit); // Re-using categoryData state, maybe rename?
    setCategoryProductVisible(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    sessionStorage.removeItem('productId');
    setCategoryData({categoryId: selectedCategory});
    setIsProductModalOpen(true);
  };

  // --- Modal Handlers ---
  const handleAttributeModalCancel = () => {
    setCategoryAttriIsVisible(false);
  };

  const handleProductModalOk = (eventData: any) => {
    setIsProductModalOpen(false);
    if (eventData !== 'cancel') {
      fetchData();
      if (typeof eventData === 'number') {
        setSelectedProduct(eventData);
        sessionStorage.setItem('productId', eventData.toString());
        onProductSelected(eventData);
      }
    }
  };

  // --- Rendering ---
  const inputSuffix = searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />;

  return (
    <div className="border border-border rounded-[5px] w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-[#E2E8F0] text-primary-font text-[11px] font-semibold px-4 py-[5px] border-b border-border flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span>Product Name</span>
          <button className="text-primary-theme hover:underline text-xs" onClick={() => setIsProductModalOpen(true)}>
            Add
          </button>
          <button className={`text-primary-theme hover:underline text-xs ${!selectedProduct ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleEditProduct} disabled={!selectedProduct}>
            Edit
          </button>
        </div>
        <div className="w-64">
          <Input placeholder="Search" value={searchValue} onChange={handleSearchChange} suffix={inputSuffix} className="rounded" />
        </div>
      </div>

      {/* Product List */}
      <Spin spinning={loading}>
        <div className="flex flex-col justify-center items-center bg-white min-h-[48px]">
          {filteredData && filteredData.length > 0 ? (
            <ul className="divide-y divide-border p-0 m-0 overflow-y-auto max-h-[700px] lg:max-h-[700px] md:max-h-[50vh] sm:max-h-[40vh] w-full">
              {filteredData.map((item: Product | AttributeSetModel) => {
                if ('akiProductID' in item) {
                  const isSelected = selectedProduct === item.akiProductID;
                  return (
                    <li
                      key={`prod-${item.akiProductID}`}
                      className={` px-4 py-2 cursor-pointer text-[10px]  transition-colors duration-300 ${isSelected ? 'bg-primary-theme-active' : 'hover:bg-gray-100  text-secondary-font'}`}
                      onClick={() => handleProductClick(item)}
                    >
                      {item.akiProductName}
                    </li>
                  );
                } else if ('attributeSetName' in item) {
                  return (
                    <li
                      key={`attr-${item.akiCategoryID}`}
                      className=" px-4 py-2 cursor-pointer text-[10px] text-secondary-font transition-colors duration-300 hover:bg-gray-100"
                      onClick={() => handleAttributeSetClick(item)}
                    >
                      <span className="text-primary-theme italic">{item.attributeSetName}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-12 text-secondary-font text-[10px] text-center">{displayText}</div>
          )}
        </div>
      </Spin>

      {/* Category Attributes Modal */}
      <Modal title="Attribute Set Form" open={categoryAttriIsVisible} onCancel={handleAttributeModalCancel} footer={null} width={1100} destroyOnClose>
        {categoryData && <CategoryAttribute categoryData={categoryData} />}
      </Modal>

      {/* Category Product Add/Edit Modal */}
      <Modal open={isProductModalOpen} onCancel={() => setIsProductModalOpen(false)} footer={null} width={1200}>
        <ProductComponent />
      </Modal>
    </div>
  );
}

export default ProductDisplay;
