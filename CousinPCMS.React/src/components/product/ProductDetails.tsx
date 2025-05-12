import React, {useState, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
import IndexEntryFields from '../shared/IndexEntryFields';
import {Form, Input, Select, Checkbox, Button, Upload, Table, Modal, Spin, message} from 'antd';
import {EllipsisOutlined, SearchOutlined, CloseCircleFilled, CheckCircleOutlined, StopOutlined, CloseOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import type {TableProps, TablePaginationConfig} from 'antd/es/table';
import type {FilterValue} from 'antd/es/table/interface';
import {getProductById, getLayoutTemplateList, getAllProducts, getAdditionalProduct, addAssociatedProduct, updateAssociatedProduct} from '../../services/ProductService';
import {getCountryOrigin, getCommodityCodes, getAllCategory, getSessionItem, setSessionItem, getPlainText} from '../../services/DataService';
import {Country} from '../../models/countryOriginModel';
import {CommodityCode} from '../../models/commodityCodeModel';
import {layoutProduct} from '../../models/layoutTemplateModel';
import {AdditionalProductModel, AssociatedProductRequestModelForProduct, Product} from '../../models/productModel';
import {ProductCharLimit} from '../../models/char.constant';
import {useNotification} from '../../hook/useNotification';
import {useLocation} from 'react-router';
import {getDistinctAttributeSetsByCategoryId} from '../../services/HomeService';
import {AttributeSetModel} from '../../models/attributeModel';
import CategoryAttribute from '../home/CategoryAttribute';
import {ApiResponse} from '../../models/generalModel';
import RichTextEditor from '../RichTextEditor';

interface CategorySelectItem {
  akiCategoryID: string | number;
  akiCategoryName: string;
  selected?: boolean;
}

interface AssociatedProductSearchResult {
  akiProductID: number;
  akiProductName: string;
  akiProductIsActive: boolean;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

interface ProductDetailsProps {
  onFormChange?: (changed: boolean) => void;
}

const ProductDetails = forwardRef<any, ProductDetailsProps>(({onFormChange}, ref) => {
  const [productForm] = Form.useForm<Product>();
  const [editAssociatedProductForm] = Form.useForm<Omit<AdditionalProductModel, 'additionalProductName'>>();
  const [addAssociatedProductForm] = Form.useForm<Omit<AssociatedProductRequestModelForProduct, 'product' | 'addproduct'> & {product: string}>();

  const [loading, setLoading] = useState<boolean>(true);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [isAdditionalPLoading, setIsAdditionalPLoading] = useState<boolean>(false);
  const [loadingProductModal, setLoadingProductModal] = useState<boolean>(false);

  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [akiProductID, setAkiProductID] = useState<number | undefined>(undefined);
  const [indexEntryCount, setIndexEntryCount] = useState<number>();

  const [countries, setCountries] = useState<Country[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<layoutProduct[]>([]);
  const [commodityCode, setCommodityCode] = useState<CommodityCode[]>([]);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategorySelectItem[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategorySelectItem[]>([]);
  const [categorySearchValue, setCategorySearchValue] = useState<string>('');
  const [selectedCategoryInModal, setSelectedCategoryInModal] = useState<CategorySelectItem | null>(null);

  const [additionalProductList, setAdditionalProductList] = useState<AdditionalProductModel[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isVisibleAddProductModal, setIsVisibleAddProductModal] = useState<boolean>(false);
  const [productListModal, setProductListModal] = useState<AssociatedProductSearchResult[]>([]);
  const [selectedProductIdModal, setSelectedProductIdModal] = useState<number | null>(null);
  const [productSearchValueModal, setProductSearchValueModal] = useState<string>('');
  const [productModalTableParams, setProductModalTableParams] = useState<TableParams>({
    pagination: {current: 1, pageSize: 10, total: 0},
  });

  const [attributslist, setAttributslist] = useState<AttributeSetModel>();

  const charLimit = ProductCharLimit;

  const [isSetAttributeVisable, setIsSetAttributeVisable] = useState<boolean>(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [changeType, setChangeType] = useState<'commodity' | 'origin' | null>(null);

  const [commityCodeChange, setCommityCodeChange] = useState(false);
  const [countryOriginChange, setCountryOriginChange] = useState(false);

  const akiProductName = Form.useWatch('akiProductName', productForm);
  const akiProductImageURL = Form.useWatch('akiProductImageURL', productForm);
  const description = productForm.getFieldValue('akiProductDescription');
  const [plainTextLength, setPlainTextLength] = useState(0);

  const notify = useNotification();
  const location = useLocation();
  const defaultValue = {
    akiProductImageHeight: 0,
    akiProductImageWidth: 0,
    akiProductListOrder: 0,
    akiProductShowPriceBreaks: false,
    akiProductWebActive: false,
    akiProductIsActive: false,
    iscommoditychange: false,
    iscountrychange: false,
  };

  useEffect(() => {
    sessionStorage.removeItem('originalCommodityCode');
    sessionStorage.removeItem('originalCountryOfOrigin');
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setCategoryLoading(true);
        const [countriesData, commoditiesData, layoutsData] = await Promise.all([getCountryOrigin(), getCommodityCodes(), getLayoutTemplateList()]);
        setCountries(countriesData || []);
        setCommodityCode(commoditiesData || []);
        setLayoutOptions(layoutsData || []);
        const categoriesData = await getAllCategory();
        setCategoryList(categoriesData || []);
        setFilteredCategories(categoriesData || []);
      } catch (e) {
        console.error('Error fetching initial data:', e);
        notify.error('Could not load necessary form options.');
      } finally {
        setLoading(false);
        setCategoryLoading(false);
      }
    };

    fetchInitialData();

    if (location.pathname === '/products/add' || (!getSessionItem('productId') && !getSessionItem('tempProductId'))) {
      productForm.setFieldValue('akiCategoryID', getSessionItem('CategoryId') ? getSessionItem('CategoryId') : getSessionItem('tempCategoryId'));
      productForm.setFieldValue('akiProductID', '0');
      setLoading(false);
      return;
    }

    const attributeSet = async () => {
      try {
        const cateId = getSessionItem('CategoryId') || getSessionItem('tempCategoryId');
        const response: ApiResponse<AttributeSetModel[]> = await getDistinctAttributeSetsByCategoryId(cateId);
        if (response.isSuccess && response.value && response.value.length > 0) {
          setAttributslist(response.value[0]);
        }
      } catch (error) {
        console.error('Error in API call:', error);
      } finally {
        setLoading(false);
      }
    };

    attributeSet();
    const productIdFromSession = getSessionItem('productId') || getSessionItem('tempProductId');

    if (productIdFromSession) {
      setProductLoading(true);
      getProductById(productIdFromSession)
        .then((response) => {
          if (response.isSuccess && response.value && response.value.length > 0) {
            const product = response.value[0];
            setAkiProductID(product.akiProductID);
            const initialCount = Object.keys(product).filter((key) => key.startsWith('akiProductIndexText') && (product as Record<string, any>)[key] !== '').length;
            setIndexEntryCount(initialCount);
            setSessionItem('originalCommodityCode', product.akiProductCommodityCode);
            setSessionItem('originalCountryOfOrigin', product.akiProductCountryOfOrigin);
            productForm.setFieldsValue({
              ...product,
              category_Name: product.category_Name,
              akiProductPrintLayoutTemp: !!product.akiProductPrintLayoutTemp,
              akiProductShowPriceBreaks: !!product.akiProductShowPriceBreaks,
              akiProductWebActive: !!product.akiProductWebActive,
              akiProductIsActive: !!product.akiProductIsActive,
              iscommoditychange: !!product.iscommoditychange,
              iscountrychange: !!product.iscountrychange,
            });
          } else {
            // notify.error('Failed To Load Product Data');
          }
        })
        .catch(() => {
          notify.error('Something went wrong while fetching product data.');
        })
        .finally(() => setProductLoading(false));
    } else {
      notify.error('Product ID not found. Please select a product.');
      setProductLoading(false);
    }
    // productForm.getFieldValue('akiProductName')?.disable?.();
  }, [productForm, notify, location.pathname]);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      validateFields: () => productForm.validateFields(),
    }),
    getCommityCodeChange: () => commityCodeChange,
    getCountryOriginChange: () => countryOriginChange,
    setProductId: (id: number) => {
      productForm.setFieldsValue({akiProductID: id});
    },
  }));

  const fetchAdditionalProduct = useCallback(
    async (productId: number) => {
      setIsAdditionalPLoading(true);
      try {
        const response = await getAdditionalProduct(productId);
        const data = response || [];
        setAdditionalProductList(data);
        const maxListOrder = data.length > 0 ? Math.max(...data.map((p: AdditionalProductModel) => Number(p.listOrder) || 0)) : 0;
        addAssociatedProductForm.setFieldsValue({listorder: maxListOrder + 1});
      } catch {
        notify.error('Error fetching associated products list.');
        setAdditionalProductList([]);
      } finally {
        setIsAdditionalPLoading(false);
      }
    },
    [addAssociatedProductForm, notify]
  );

  useEffect(() => {
    if (akiProductID !== undefined) {
      fetchAdditionalProduct(akiProductID);
    }
  }, [akiProductID, fetchAdditionalProduct]);

  const fetchProductsForModal = useCallback(async () => {
    if (!isVisibleAddProductModal) return;
    setLoadingProductModal(true);
    try {
      const current = productModalTableParams.pagination?.current ?? 1;
      const pageSize = productModalTableParams.pagination?.pageSize ?? 10;
      const response = await getAllProducts(current, pageSize, productSearchValueModal);
      let fetchedProducts: AssociatedProductSearchResult[] = [];
      let totalRecords = 0;
      if (
        response &&
        response.value &&
        typeof response.value === 'object' &&
        'products' in response.value &&
        Array.isArray((response.value as unknown as {products: AssociatedProductSearchResult[]}).products)
      ) {
        const apiResp = response.value as unknown as {products: AssociatedProductSearchResult[]; totalRecords: number};
        fetchedProducts = apiResp.products;
        totalRecords = apiResp.totalRecords || 0;
      }
      const currentProductAndAssociatedIds = [akiProductID, ...additionalProductList.map((p) => p.additionalProduct)].filter((id) => id !== undefined);
      fetchedProducts = fetchedProducts.filter((prod: AssociatedProductSearchResult) => !currentProductAndAssociatedIds.includes(prod.akiProductID));
      setProductListModal(fetchedProducts);
      setProductModalTableParams((prev) => {
        const prevTotal = prev.pagination?.total ?? 0;
        if (prevTotal === totalRecords) return prev;
        return {
          ...prev,
          pagination: {
            ...prev.pagination,
            total: totalRecords,
          },
        };
      });
    } catch {
      notify.error('Could not load products.');
      setProductListModal([]);
      setProductModalTableParams((prev) => ({...prev, pagination: {...prev.pagination, total: 0}}));
    } finally {
      setLoadingProductModal(false);
    }
  }, [isVisibleAddProductModal, productSearchValueModal, productModalTableParams, additionalProductList, akiProductID, notify]);

  useEffect(() => {
    fetchProductsForModal();
  }, [fetchProductsForModal]);

  const openCategoryModal = () => {
    setCategorySearchValue('');
    setFilteredCategories(categoryList);
    const currentCatId = productForm.getFieldValue('akiCategoryID');
    const currentSelected = categoryList.find((cat) => cat.akiCategoryID === currentCatId);
    setSelectedCategoryInModal(currentSelected || null);
    setIsCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalVisible(false);
    setSelectedCategoryInModal(null);
  };

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategorySearchValue(value);
    const lowerCaseValue = value.toLowerCase();
    setFilteredCategories(categoryList.filter((cat) => cat.akiCategoryName.toLowerCase().includes(lowerCaseValue)));
  };

  const handleCategorySelectInModal = (category: CategorySelectItem) => {
    setSelectedCategoryInModal(category);
  };

  const confirmCategorySelection = () => {
    if (selectedCategoryInModal) {
      productForm.setFieldsValue({
        akiCategoryID: selectedCategoryInModal.akiCategoryID?.toString(),
        category_Name: selectedCategoryInModal.akiCategoryName,
      });
    } else {
      productForm.setFieldsValue({
        akiCategoryID: undefined,
        category_Name: undefined,
      });
    }
    closeCategoryModal();
  };

  const showAddProductModal = () => {
    setSelectedProductIdModal(null);
    addAssociatedProductForm.resetFields(['product']);
    setProductSearchValueModal('');
    setProductModalTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
    setIsVisibleAddProductModal(true);
  };

  const handleAddModalCancel = () => {
    setIsVisibleAddProductModal(false);
    setSelectedProductIdModal(null);
    addAssociatedProductForm.resetFields();
  };

  const handleProductSelectInModal = (product: AssociatedProductSearchResult) => {
    setSelectedProductIdModal(product.akiProductID);
    addAssociatedProductForm.setFieldsValue({product: product.akiProductName});
    message.success(`Selected: ${product.akiProductName}`);
  };

  const handleAddAssociatedProductSubmit = async (values: Omit<AssociatedProductRequestModelForProduct, 'product' | 'addproduct'> & {product: string}) => {
    if (!selectedProductIdModal) {
      notify.error('Please select a product from the grid below.');
      return;
    }
    if (akiProductID === undefined) {
      notify.error('Current product context is missing.');
      return;
    }

    const listOrder = Number(values.listorder);

    const isListOrderExist = additionalProductList.some((p) => Number(p.listOrder) === listOrder);
    if (isListOrderExist) {
      notify.error('List order already exists.');
      return;
    }

    const payload: AssociatedProductRequestModelForProduct = {
      product: akiProductID,
      addproduct: selectedProductIdModal.toString(),
      listorder: listOrder,
    };

    try {
      const response = await addAssociatedProduct(payload);
      if (response.isSuccess) {
        notify.success('Associated product added successfully');
        setIsVisibleAddProductModal(false);
        addAssociatedProductForm.resetFields();
        setSelectedProductIdModal(null);
        fetchAdditionalProduct(akiProductID);
        const updatedList = await getAdditionalProduct(akiProductID);
        const data = updatedList || [];
        const maxListOrder = data.length > 0 ? Math.max(...data.map((p: AdditionalProductModel) => Number(p.listOrder) || 0)) : 0;
        addAssociatedProductForm.setFieldsValue({listorder: maxListOrder + 1});
      } else {
        notify.error('Associated product not added');
      }
    } catch {
      notify.error('Something went wrong');
    }
  };

  const handleStartEdit = (record: AdditionalProductModel) => {
    editAssociatedProductForm.setFieldsValue({
      product: record.product,
      listOrder: record.listOrder,
    });
    setEditingId(record.additionalProduct);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    editAssociatedProductForm.resetFields();
  };

  const handleUpdateAssociatedProduct = async () => {
    const currentEditingId = editingId;
    if (!currentEditingId || akiProductID === undefined) return;

    try {
      const values = await editAssociatedProductForm.validateFields();
      const listOrder = Number(values.listOrder);

      const isListOrderExist = additionalProductList.some((p) => Number(p.listOrder) === listOrder && p.additionalProduct !== currentEditingId);

      if (isListOrderExist) {
        notify.error('List order already exists.');
        return;
      }

      const payload: AssociatedProductRequestModelForProduct = {
        product: akiProductID,
        addproduct: currentEditingId.toString(),
        listorder: listOrder,
      };

      const response = await updateAssociatedProduct(payload);
      if (response.isSuccess) {
        notify.success('Associated product updated successfully');
        setEditingId(null);
        fetchAdditionalProduct(akiProductID);
      } else {
        notify.error('Associated product not updated');
      }
    } catch {
      notify.error('Something went wrong');
    }
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const file = info.file?.originFileObj;
    if (file) {
      productForm.setFieldsValue({akiProductImageURL: file.name});
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    } else if (info.file.status === 'removed') {
      productForm.setFieldsValue({akiProductImageURL: ''});
    }
  };

  const handleProductModalTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
    setProductModalTableParams({pagination, filters});
  };

  const handleProductModalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearchValueModal(e.target.value);
  };

  const handleProductModalSearchEnter = () => {
    setProductModalTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
  };

  const clearProductModalSearch = () => {
    setProductSearchValueModal('');
    setProductModalTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
  };

  const categoryModalColumns: TableProps<CategorySelectItem>['columns'] = [
    {
      title: '',
      dataIndex: 'select',
      width: 50,
      render: (_, record) => <Checkbox checked={selectedCategoryInModal?.akiCategoryID === record.akiCategoryID} onChange={() => handleCategorySelectInModal(record)} />,
    },
    {title: 'ID', dataIndex: 'akiCategoryID', width: 80},
    {title: 'Category Name', dataIndex: 'akiCategoryName'},
  ];

  const associatedProductColumns: TableProps<AdditionalProductModel>['columns'] = [
    {
      title: 'Product Name',
      dataIndex: 'additionalProductName',
      sorter: (a, b) => a.additionalProductName.localeCompare(b.additionalProductName),
      render: (text, record) => (
        <span
          style={{cursor: 'pointer', color: '#1890ff'}}
          onClick={() => {
            if (!editingId) {
              handleStartEdit(record);
            }
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'List Order',
      dataIndex: 'listOrder',
      sorter: (a, b) => (Number(a.listOrder) || 0) - (Number(b.listOrder) || 0),
      width: 100,
      render: (text, record) => {
        if (editingId === record.additionalProduct) {
          return (
            <Form.Item name="listOrder" style={{margin: 0}} rules={[{required: true, message: 'Required'}]}>
              <Input
                type="number"
                className="py-0"
                onPressEnter={handleUpdateAssociatedProduct}
                onBlur={handleUpdateAssociatedProduct}
                style={{width: '80px'}}
                suffix={
                  <CloseOutlined
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur from firing
                      handleCancelEdit();
                    }}
                    className="text-danger cursor-pointer"
                  />
                }
              />
            </Form.Item>
          );
        }
        return text;
      },
    },
  ];

  const productSearchModalColumns: TableProps<AssociatedProductSearchResult>['columns'] = [
    {title: 'Product Id', dataIndex: 'akiProductID', width: 70},
    {
      title: 'Product Name',
      dataIndex: 'akiProductName',
      render: (text, record) => (
        <a onClick={() => handleProductSelectInModal(record)} className="text-primary-theme cursor-pointer">
          {text}
        </a>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'akiProductIsActive',
      width: 50,
      align: 'center',
      render: (isActive) => (isActive ? <CheckCircleOutlined className="text-primary-theme" /> : <StopOutlined className="text-danger" />),
    },
  ];
  const goToLinkMaintenance = () => {
    const productId = productForm.getFieldValue('akiProductID');
    if (productId && productId > 0) {
      setSessionItem('linkProductId', productId);
      window.location.href = '/products/link-maintenance';
    }
  };

  const goToAdditionalImage = () => {
    const productId = productForm.getFieldValue('akiProductID');
    if (productId && productId > 0) {
      setSessionItem('imageProductId', productId);
      window.location.href = '/products/additional-images';
    }
  };

  const goToSetAttribute = () => {
    setIsSetAttributeVisable(true);
  };

  const commodityFieldChanges = async () => {
    const values = productForm.getFieldValue('akiProductCommodityCode');
    const originalCode = getSessionItem('originalCommodityCode');
    if (originalCode && values?.akiProductCommodityCode !== originalCode) {
      setIsConfirmModalVisible(true);
      setChangeType('commodity');
      return true;
    }
    return false;
  };

  const originFieldChanges = async () => {
    const values = productForm.getFieldValue('akiProductCountryOfOrigin');
    const originalOrigin = getSessionItem('originalCountryOfOrigin');
    if (originalOrigin && values?.akiProductCountryOfOrigin !== originalOrigin) {
      setIsConfirmModalVisible(true);
      setChangeType('origin');
      return true;
    }

    return false;
  };

  const handleConfirmOk = async () => {
    if (changeType === 'commodity') {
      setCommityCodeChange(true);
      notify.success('Commodity Code updated for all SKUs.');
    } else if (changeType === 'origin') {
      setCountryOriginChange(true);
      notify.success('Country of Origin updated for all SKUs.');
    }

    setIsConfirmModalVisible(false);
    setChangeType(null);
  };

  const handleConfirmCancel = async () => {
    if (changeType === 'commodity') {
      setCommityCodeChange(false);
    } else if (changeType === 'origin') {
      setCountryOriginChange(false);
    }
    setIsConfirmModalVisible(false);
    setChangeType(null);
  };

  useEffect(() => {
    const plainText = getPlainText(description || '').trim();
    setPlainTextLength(plainText.length);
  }, [description]);

  const handleDataChange = () => {
    notify.success('Attribute data updated successfully.');
  };

  return (
    <Spin spinning={loading || productLoading}>
      <div className="px-4">
        <Form
          form={productForm}
          layout="vertical"
          initialValues={defaultValue}
          onValuesChange={() => {
            if (onFormChange) {
              onFormChange(true);
            }
          }}
        >
          <Form.Item name="category_Name" style={{display: 'none'}}>
            <Input type="hidden" />
          </Form.Item>
          <div className="grid grid-cols-12 gap-x-20">
            <div className="col-span-6">
              <div className="grid grid-cols-3 gap-x-4">
                <Form.Item label="Product Id" name="akiProductID">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Category Id" name="akiCategoryID" rules={[{required: true, message: 'Category is required'}]}>
                  <Input
                    readOnly
                    placeholder="Click '...' to select"
                    addonAfter={
                      categoryLoading ? (
                        <Spin size="small" />
                      ) : (
                        <Button size="small" icon={<EllipsisOutlined />} onClick={openCategoryModal} type="text" style={{border: 'none', height: 'auto', padding: '0 5px'}} />
                      )
                    }
                  />
                </Form.Item>
              </div>
              <div className="relative">
                <Form.Item label="Product Name" name="akiProductName" rules={[{required: true, message: 'Product name is required'}]}>
                  <Input maxLength={charLimit.akiProductName} className="pr-12" />
                </Form.Item>
                <span className="absolute -right-14 top-7 transform ">
                  {akiProductName?.length || 0} / {charLimit.akiProductName}
                </span>
              </div>
              <div className="relative">
                <Form.Item label="Product Description" name="akiProductDescription">
                  <RichTextEditor
                    value={description}
                    maxLength={charLimit.akiProductDescription}
                    onChange={(val) => {
                      const plainText = getPlainText(val || '').trim();
                      setPlainTextLength(plainText.length);
                      productForm.setFieldValue('akiProductDescription', val);
                    }}
                  />
                </Form.Item>
                <span className="absolute bottom-2 -right-14 ">
                  {plainTextLength || 0} / {charLimit.akiProductDescription}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-4 items-end">
                <Form.Item label="Heading" name="akiProductHeading">
                  <Input />
                </Form.Item>
                <Form.Item label="Product Text" name="akiProductText">
                  <Input />
                </Form.Item>
                <Form.Item name="akiProductWebActive" valuePropName="checked" noStyle>
                  <Checkbox className="pb-2">Web Active</Checkbox>
                </Form.Item>
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <Form.Item label="List Order" name="akiProductListOrder">
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="Commodity Code" name="akiProductCommodityCode">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select code"
                    optionFilterProp="label"
                    loading={loading}
                    options={commodityCode.map((c) => ({value: c.commodityCode, label: c.commodityCode, key: c.commodityCode}))}
                    onChange={commodityFieldChanges}
                  />
                </Form.Item>
                <Form.Item label="Country of Origin" name="akiProductCountryOfOrigin">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select country"
                    optionFilterProp="label"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={countries.map((c) => ({value: c.code, label: c.code, key: c.code}))}
                    onChange={originFieldChanges}
                    loading={loading}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-3 gap-x-4 items-center">
                <div className="flex items-end gap-x-2  col-span-2">
                  <Form.Item label="Image URL" name="akiProductImageURL" className="w-full" rules={[{type: 'string', message: 'Please enter a valid URL'}]}>
                    <Input maxLength={charLimit.akiProductImageURL} className="flex-grow pr-16" />
                  </Form.Item>
                  <Upload
                    customRequest={({file, onSuccess}) => setTimeout(() => onSuccess?.({}, file as File), 500)}
                    headers={{authorization: 'your-auth-token'}}
                    onChange={handleFileChange}
                    showUploadList={false}
                    accept=".png,.jpeg,.jpg"
                  >
                    <Button size="small" type="primary">
                      Upload
                    </Button>
                  </Upload>
                  <span className="whitespace-nowrap">
                    {akiProductImageURL?.length || 0} / {charLimit.akiProductImageURL}
                  </span>
                </div>
                <Form.Item
                  label={
                    <a onClick={goToAdditionalImage} className="underline cursor-pointer">
                      No of Additional Website Images
                    </a>
                  }
                  name="additionalImages"
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="grid grid-cols-3 gap-x-4 items-center">
                <Form.Item label="Image Height (px)" name="akiProductImageHeight">
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="Image Width (px)" name="akiProductImageWidth">
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  label={
                    <a onClick={goToLinkMaintenance} className="underline cursor-pointer">
                      No of URL Links
                    </a>
                  }
                  name="urlLinks"
                >
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
            <div className="col-span-6">
              <Form.Item name="akiProductIsActive" valuePropName="checked" className="mt-2">
                <Checkbox>Cat Active</Checkbox>
              </Form.Item>
              <Form.Item label="Layout Template" name="aki_Layout_Template">
                <Select
                  allowClear
                  showSearch
                  placeholder="Select layout"
                  optionFilterProp="label"
                  loading={loading}
                  options={layoutOptions.map((opt) => ({value: opt.templateCode, label: opt.layoutDescription, key: opt.templateCode}))}
                />
              </Form.Item>
              <Form.Item label="Alternative Title" name="akiProductAlternativeTitle">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="akiProductShowPriceBreaks" valuePropName="checked" className="mt-1 mb-4">
                <Checkbox>Show Price Breaks</Checkbox>
              </Form.Item>
              <div className="mt-1">
                <label className="font-medium text-primary-font block mb-1">Index Entry Text</label>
                <div className="border border-border rounded-lg p-4">
                  {indexEntryCount !== undefined ? (
                    <IndexEntryFields form={productForm} fieldPrefix="akiProductIndexText" labelPrefix="Index Entry" max={5} patchValue={indexEntryCount} />
                  ) : (
                    <IndexEntryFields form={productForm} fieldPrefix="akiProductIndexText" labelPrefix="Index Entry" max={5} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 grid grid-cols-12 gap-x-6 mt-2">
              <div className="col-span-6 ">
                <div className="border border-border rounded-lg p-2">
                  <div className="flex justify-between mb-2">
                    <span className="flex font-medium text-secondary-font">Associated Products</span>

                    <Button size="small" type="primary" onClick={showAddProductModal}>
                      Add
                    </Button>
                  </div>
                  <Form form={editAssociatedProductForm} component={false}>
                    <Table
                      scroll={{y: 150}}
                      columns={associatedProductColumns}
                      dataSource={additionalProductList}
                      rowKey="additionalProduct"
                      loading={isAdditionalPLoading}
                      pagination={false}
                      size="small"
                      bordered
                      showSorterTooltip={false}
                    />
                  </Form>
                </div>
                {attributslist && (
                  <div className="border border-border rounded-lg p-2 mt-2">
                    <Form.Item label="Attribute Set" className="w-full mt-1">
                      <a onClick={goToSetAttribute} className="underline">
                        {attributslist.attributeSetName}
                      </a>
                    </Form.Item>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Modal
        title="Select Category"
        open={isCategoryModalVisible}
        onOk={confirmCategorySelection}
        onCancel={closeCategoryModal}
        width={1000}
        closable={false}
        footer={[
          <Button key="cancel" onClick={closeCategoryModal}>
            Close
          </Button>,
          <Button key="ok" type="primary" onClick={confirmCategorySelection}>
            Ok
          </Button>,
        ]}
      >
        <Input
          placeholder="Search Category Name"
          value={categorySearchValue}
          onChange={handleCategorySearch}
          suffix={
            categorySearchValue ? (
              <CloseCircleFilled onClick={() => setCategorySearchValue('')} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} />
            ) : (
              <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />
            )
          }
          className="mb-4"
        />
        <Table columns={categoryModalColumns} dataSource={filteredCategories} rowKey="akiCategoryID" size="small" bordered loading={loadingProductModal} />
      </Modal>
      <Modal title="Add Product" open={isVisibleAddProductModal} onCancel={handleAddModalCancel} footer={null} width={1000} destroyOnClose closable={false}>
        <Form form={addAssociatedProductForm} layout="vertical" onFinish={handleAddAssociatedProductSubmit} className="px-3 py-1">
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label="List Order" name="listorder" rules={[{required: true, message: 'Required'}]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Product Name" name="product" rules={[{required: true, message: 'Select product below'}]}>
              <Input disabled placeholder="Select product from table..." />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center gap-3 mt-4 mb-4">
            <Input
              placeholder="Search By Product Name"
              value={productSearchValueModal}
              onChange={handleProductModalSearchChange}
              onPressEnter={handleProductModalSearchEnter}
              suffix={
                productSearchValueModal ? (
                  <CloseCircleFilled onClick={clearProductModalSearch} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} />
                ) : (
                  <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />
                )
              }
              style={{flexGrow: 1, maxWidth: '300px'}}
            />
            <div className="flex gap-x-3">
              <Button size="small" onClick={handleAddModalCancel}>
                Close
              </Button>
              <Button size="small" type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </div>
        </Form>
        <div className="pt-0">
          <Table
            columns={productSearchModalColumns}
            rowKey="akiProductID"
            dataSource={productListModal}
            pagination={productModalTableParams.pagination}
            loading={loadingProductModal}
            onChange={handleProductModalTableChange}
            size="small"
            bordered
          />
        </div>
      </Modal>
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Attribute Set Form</span>
            <Button type="default" onClick={() => setIsSetAttributeVisable(false)}>
              Close
            </Button>
          </div>
        }
        open={isSetAttributeVisable}
        onCancel={() => setIsSetAttributeVisable(false)}
        footer={null}
        width={1100}
        destroyOnClose
        closable={false}
      >
        {attributslist && <CategoryAttribute categoryData={attributslist} onDataChange={handleDataChange} />}
      </Modal>
      <Modal
        title={changeType === 'commodity' ? 'Apply Commodity Code to all SKUs?' : 'Apply Country of Origin to all SKUs?'}
        open={isConfirmModalVisible}
        onCancel={() => {
          setIsConfirmModalVisible(false);
          setChangeType(null);
        }}
        footer={[
          <Button onClick={handleConfirmCancel}>No</Button>,
          <Button key="ok" type="primary" onClick={handleConfirmOk}>
            Yes
          </Button>,
        ]}
      >
        <p>
          {changeType === 'commodity'
            ? 'Do you want to apply the new Commodity Code to all SKUs under this product?'
            : 'Do you want to apply the new Country of Origin to all SKUs under this product?'}
        </p>
      </Modal>
    </Spin>
  );
});

// Remove the export from this file to avoid Fast Refresh issues
export default ProductDetails;
