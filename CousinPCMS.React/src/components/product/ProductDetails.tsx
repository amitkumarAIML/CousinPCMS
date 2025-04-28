import React, {useState, useEffect, useCallback} from 'react';
import {Form, Input, Select, Checkbox, Button, Upload, Table, Modal, Spin, Popconfirm, message} from 'antd';
import {UploadOutlined, EditOutlined, EllipsisOutlined, SearchOutlined, CloseCircleFilled, CheckCircleOutlined, StopOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import type {TableProps, TablePaginationConfig} from 'antd/es/table';
import type {FilterValue} from 'antd/es/table/interface';
import {getProductById, getLayoutTemplateList, getAllProducts, getAdditionalProduct, addAssociatedProduct, updateAssociatedProduct} from '../../services/ProductService';
import {getCountryOrigin, getCommodityCodes, getAllCategory, showNotification} from '../../services/DataService';
import {Country} from '../../models/countryOriginModel';
import {CommodityCode} from '../../models/commodityCodeModel';
import {layoutProduct} from '../../models/layoutTemplateModel';
import {AdditionalProductModel, AssociatedProductRequestModelForProduct, Product} from '../../models/productModel';
import {ProductCharLimit} from '../../models/char.constant';

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

const ProductDetails: React.FC = () => {
  const [productForm] = Form.useForm<Product>();
  const [editAssociatedProductForm] = Form.useForm<Omit<AdditionalProductModel, 'additionalProductName'>>();
  const [addAssociatedProductForm] = Form.useForm<Omit<AssociatedProductRequestModelForProduct, 'product' | 'addproduct'> & {product: string}>();

  const [loading, setLoading] = useState<boolean>(false);
  const [isAdditionalPLoading, setIsAdditionalPLoading] = useState<boolean>(false);
  const [loadingProductModal, setLoadingProductModal] = useState<boolean>(false);

  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [akiProductID, setAkiProductID] = useState<number | undefined>(undefined);

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

  const charLimit = ProductCharLimit;

  const akiProductName = Form.useWatch('akiProductName', productForm);
  const akiProductDescription = Form.useWatch('akiProductDescription', productForm);
  const akiProductImageURL = Form.useWatch('akiProductImageURL', productForm);

  useEffect(() => {}, [productForm]);

  useEffect(() => {
    const productIdFromSession = sessionStorage.getItem('productId');
    if (productIdFromSession) {
      setProductLoading(true);
      getProductById(productIdFromSession)
        .then((response) => {
          if (response.isSuccess && response.value && response.value.length > 0) {
            const product = response.value[0];
            setAkiProductID(product.akiProductID);
            productForm.setFieldsValue({
              ...product,
              akiProductPrintLayoutTemp: !!product.akiProductPrintLayoutTemp,
              akiProductShowPriceBreaks: !!product.akiProductShowPriceBreaks,
              akiProductWebActive: !!product.akiProductWebActive,
              akiProductIsActive: !!product.akiProductIsActive,
            });
          } else {
            showNotification('error', response.exceptionInformation || 'Failed To Load Product Data');
          }
        })
        .catch(() => {
          showNotification('error', 'Something went wrong while fetching product data.');
        })
        .finally(() => setProductLoading(false));
    } else {
      showNotification('error', 'Product ID not found. Please select a product.');
      setProductLoading(false);
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [countriesData, commoditiesData, layoutsData, categoriesData] = await Promise.all([getCountryOrigin(), getCommodityCodes(), getLayoutTemplateList(), getAllCategory()]);
        setCountries(countriesData || []);
        setCommodityCode(commoditiesData || []);
        setLayoutOptions(layoutsData || []);
        setCategoryList(categoriesData || []);
        setFilteredCategories(categoriesData || []);
      } catch (e) {
        console.error('Error fetching initial data:', e);
        showNotification('error', 'Could not load necessary form options.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    productForm.getFieldValue('akiProductName')?.disable?.();
  }, [productForm]);

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
        showNotification('error', 'Error fetching associated products list.');
        setAdditionalProductList([]);
      } finally {
        setIsAdditionalPLoading(false);
      }
    },
    [addAssociatedProductForm]
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
      const response = await getAllProducts(productModalTableParams.pagination?.current ?? 1, productModalTableParams.pagination?.pageSize ?? 10, productSearchValueModal);
      let fetchedProducts: AssociatedProductSearchResult[] = response && response.value ? [response.value as AssociatedProductSearchResult] : [];
      const totalRecords = fetchedProducts.length;
      const currentProductAndAssociatedIds = [akiProductID, ...additionalProductList.map((p) => p.additionalProduct)].filter((id) => id !== undefined);
      fetchedProducts = fetchedProducts.filter((prod: AssociatedProductSearchResult) => !currentProductAndAssociatedIds.includes(prod.akiProductID));
      setProductListModal(fetchedProducts);
      setProductModalTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: totalRecords,
        },
      }));
    } catch {
      showNotification('error', 'Could not load products.');
      setProductListModal([]);
      setProductModalTableParams((prev) => ({...prev, pagination: {...prev.pagination, total: 0}}));
    } finally {
      setLoadingProductModal(false);
    }
  }, [isVisibleAddProductModal, productSearchValueModal, productModalTableParams, additionalProductList, akiProductID]);

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
      showNotification('error', 'Please select a product from the grid below.');
      return;
    }
    if (akiProductID === undefined) {
      showNotification('error', 'Current product context is missing.');
      return;
    }

    const listOrder = Number(values.listorder);

    const isListOrderExist = additionalProductList.some((p) => Number(p.listOrder) === listOrder);
    if (isListOrderExist) {
      showNotification('error', 'List order already exists.');
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
        showNotification('success', 'Associated product added successfully');
        setIsVisibleAddProductModal(false);
        addAssociatedProductForm.resetFields();
        setSelectedProductIdModal(null);
        fetchAdditionalProduct(akiProductID);
        const updatedList = await getAdditionalProduct(akiProductID);
        const data = updatedList || [];
        const maxListOrder = data.length > 0 ? Math.max(...data.map((p: AdditionalProductModel) => Number(p.listOrder) || 0)) : 0;
        addAssociatedProductForm.setFieldsValue({listorder: maxListOrder + 1});
      } else {
        showNotification('error', response.exceptionInformation || 'Associated product not added');
      }
    } catch {
      showNotification('error', 'Something went wrong');
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
        showNotification('error', 'List order already exists.');
        return;
      }

      const payload: AssociatedProductRequestModelForProduct = {
        product: akiProductID,
        addproduct: currentEditingId.toString(),
        listorder: listOrder,
      };

      const response = await updateAssociatedProduct(payload);
      if (response.isSuccess) {
        showNotification('success', 'Associated product updated successfully');
        setEditingId(null);
        fetchAdditionalProduct(akiProductID);
      } else {
        showNotification('error', response.exceptionInformation || 'Associated product not updated');
      }
    } catch {
      showNotification('error', 'Something went wrong');
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
      title: 'List Order',
      dataIndex: 'listOrder',
      width: 100,
      render: (text, record) => {
        if (editingId === record.additionalProduct) {
          return (
            <Form.Item name="listOrder" style={{margin: 0}} rules={[{required: true, message: 'Required'}]}>
              <Input type="number" style={{width: '80px'}} />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'additionalProductName',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const editable = record.additionalProduct === editingId;
        return editable ? (
          <span className="flex gap-x-2">
            <Button onClick={handleUpdateAssociatedProduct} type="link" style={{padding: 0}}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancelEdit}>
              <Button type="link" danger style={{padding: 0}}>
                Cancel
              </Button>
            </Popconfirm>
          </span>
        ) : (
          <Button icon={<EditOutlined />} onClick={() => handleStartEdit(record)} type="text" disabled={editingId !== null} style={{padding: '0 5px', color: '#1890ff'}} />
        );
      },
    },
  ];

  const productSearchModalColumns: TableProps<AssociatedProductSearchResult>['columns'] = [
    {title: 'Product Id', dataIndex: 'akiProductID', width: 100},
    {
      title: 'Product Name',
      dataIndex: 'akiProductName',
      render: (text, record) => (
        <a onClick={() => handleProductSelectInModal(record)} className="text-primary-theme hover:bg-primary-theme-hover cursor-pointer">
          {text}
        </a>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'akiProductIsActive',
      width: 80,
      align: 'center',
      render: (isActive) => (isActive ? <CheckCircleOutlined className="text-success text-lg" /> : <StopOutlined className="text-danger text-lg" />),
    },
  ];

  const goToLinkMaintenance = () => {
    const productId = productForm.getFieldValue('akiProductID');
    if (!productId) return;
    window.location.href = '/products/link-maintenance';
  };

  const goToAdditionalImage = () => {
    const productId = productForm.getFieldValue('akiProductID');
    if (!productId) return;
    window.location.href = '/products/additional-images';
  };

  return (
    <Spin spinning={loading || productLoading}>
      <div>
        <Form form={productForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-0">
            <div className="lg:col-span-6 md:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                <Form.Item label="Product Id" name="akiProductID">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Category Id" name="akiCategoryID" rules={[{required: true, message: 'Category is required'}]}>
                  <Input
                    readOnly
                    placeholder="Click '...' to select"
                    addonAfter={<Button icon={<EllipsisOutlined />} onClick={openCategoryModal} type="text" style={{border: 'none', height: 'auto', padding: '0 5px'}} />}
                  />
                </Form.Item>
              </div>
              <div className="relative">
                <Form.Item label="Product Name" name="akiProductName" rules={[{required: true, message: 'Product name is required'}]}>
                  <Input maxLength={charLimit.akiProductName} disabled className="pr-12" />
                </Form.Item>
                <span className="absolute -right-14 top-7 transform ">
                  {akiProductName?.length || 0} / {charLimit.akiProductName}
                </span>
              </div>
              <div className="relative">
                <Form.Item label="Product Description" name="akiProductDescription">
                  <Input.TextArea rows={3} maxLength={charLimit.akiProductDescription} className="pr-12" />
                </Form.Item>
                <span className="absolute bottom-2 -right-14 ">
                  {akiProductDescription?.length || 0} / {charLimit.akiProductDescription}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                <Form.Item label="List Order" name="akiProductListOrder">
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="Commodity Code" name="akiProductCommodityCode">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select code"
                    optionFilterProp="label"
                    options={commodityCode.map((c) => ({value: c.commodityCode, label: c.commodityCode, key: c.commodityCode}))}
                  />
                </Form.Item>
                <Form.Item label="Country of Origin" name="akiProductCountryOfOrigin">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select country"
                    optionFilterProp="label"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={countries.map((c) => ({value: c.code, label: c.name, key: c.code}))}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-center">
                <div className="flex items-end gap-x-2  md:col-span-2">
                  <Form.Item label="Image URL" name="akiProductImageURL" className="w-full" rules={[{type: 'url', message: 'Please enter a valid URL'}]}>
                    <Input maxLength={charLimit.akiProductImageURL} className="flex-grow pr-16" />
                  </Form.Item>
                  <Upload
                    customRequest={({file, onSuccess}) => setTimeout(() => onSuccess?.({}, file as File), 500)}
                    headers={{authorization: 'your-auth-token'}}
                    onChange={handleFileChange}
                    showUploadList={false}
                    accept=".png,.jpeg,.jpg"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                  <span className="whitespace-nowrap">
                    {akiProductImageURL?.length || 0} / {charLimit.akiProductImageURL}
                  </span>
                </div>
                <Form.Item
                  label={
                    <a onClick={goToAdditionalImage} className="underline cursor-pointer">
                      No of Additional Images
                    </a>
                  }
                  name="additionalImages"
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-center">
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
              <div className="mt-4">
                <label className="font-medium text-primary-font block mb-1">Associated Products</label>
                <div className="border border-border rounded-lg p-2">
                  <div className="flex justify-end mb-2">
                    <Button type="primary" onClick={showAddProductModal}>
                      Add
                    </Button>
                  </div>
                  <Form form={editAssociatedProductForm} component={false}>
                    <Table columns={associatedProductColumns} dataSource={additionalProductList} rowKey="additionalProduct" loading={isAdditionalPLoading} pagination={false} size="small" bordered />
                  </Form>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 md:col-span-6 lg:pl-10">
              <Form.Item name="akiProductIsActive" valuePropName="checked" className="mt-2">
                <Checkbox>Cat Active</Checkbox>
              </Form.Item>
              <Form.Item label="Layout Template" name="aki_Layout_Template">
                <Select
                  allowClear
                  showSearch
                  placeholder="Select layout"
                  optionFilterProp="label"
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
                  <div className="grid grid-cols-1 gap-y-1">
                    <Form.Item label="Index Entry 1" name="akiProductIndexText1" className="mb-1">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Index Entry 2" name="akiProductIndexText2" className="mb-1">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Index Entry 3" name="akiProductIndexText3" className="mb-1">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Index Entry 4" name="akiProductIndexText4" className="mb-1">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Index Entry 5" name="akiProductIndexText5" className="mb-1">
                      <Input />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Modal title="Select Category" open={isCategoryModalVisible} onOk={confirmCategorySelection} onCancel={closeCategoryModal} width={600}>
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
        <Spin spinning={loadingProductModal}>
          <Table columns={categoryModalColumns} dataSource={filteredCategories} rowKey="akiCategoryID" size="small" bordered pagination={{pageSize: 10}} />
        </Spin>
      </Modal>
      <Modal title="Add Product" open={isVisibleAddProductModal} onCancel={handleAddModalCancel} footer={null} width={600} destroyOnClose>
        <Form form={addAssociatedProductForm} layout="vertical" onFinish={handleAddAssociatedProductSubmit} className="px-3 py-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item label="List Order" name="listorder" rules={[{required: true, message: 'Required'}]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Product Name" name="product" rules={[{required: true, message: 'Select product below'}]}>
              <Input readOnly placeholder="Select product from table..." />
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
              <Button onClick={handleAddModalCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
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
    </Spin>
  );
};

export default ProductDetails;
