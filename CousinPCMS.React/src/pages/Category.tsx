import {useState, useEffect, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {Form, Input, Select, Checkbox, Button, Upload, Table, Modal, Spin, message} from 'antd';
import {EditOutlined, CloseCircleFilled, SearchOutlined, CheckCircleOutlined, StopOutlined} from '@ant-design/icons';
import IndexEntryFields from '../components/shared/IndexEntryFields';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import type {TableProps, TablePaginationConfig} from 'antd/es/table';
import type {FilterValue, SorterResult} from 'antd/es/table/interface';
import {AdditionalCategoryModel, AssociatedProductRequestModel, UpdateCategoryModel, CategoryResponseModel} from '../models/additionalCategoryModel';
import {layoutDepartment} from '../models/layoutTemplateModel';
import {CommodityCode} from '../models/commodityCodeModel';
import {Country} from '../models/countryOriginModel';
import {CategoryCharLimit as charLimit} from '../models/char.constant';
import {getCategoryById, getCategoryLayouts, updateCategory, getAdditionalCategory, addAssociatedProduct, updateAssociatedProduct, addCategory} from '../services/CategoryService';
import {getCountryOrigin, getCommodityCodes, getSessionItem} from '../services/DataService';
import type {Product} from '../models/productModel';
import {getAllProducts} from '../services/ProductService';
import {useNotification} from '../contexts.ts/useNotification';
type ProductSearchResult = Product;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const Category = () => {
  const [categoryForm] = Form.useForm<UpdateCategoryModel & {additionalImages?: string; urlLinks?: string}>();
  const [editAssociatedProductForm] = Form.useForm<AdditionalCategoryModel>();
  const [addAssociatedProductForm] = Form.useForm<{listorder: number; product: number; productName: string}>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isAssociatePLoading, setIsAssociatePLoading] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryDetails, setCategoryDetails] = useState<CategoryResponseModel | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<layoutDepartment[]>([]);
  const [commodityCode, setCommodityCode] = useState<CommodityCode[]>([]);
  const [returnOptions] = useState<{value: string; label: string}[]>([]);
  const [additionalCategoryList, setAdditionalCategoryList] = useState<AdditionalCategoryModel[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isVisibleAddProductModal, setIsVisibleAddProductModal] = useState<boolean>(false);
  const [productNameList, setProductNameList] = useState<Product[]>([]);
  const [productSearchValue, setProductSearchValue] = useState<string>('');
  const [productTableParams, setProductTableParams] = useState<TableParams>({
    pagination: {current: 1, pageSize: 10, total: 0},
  });
  const akiCategoryName = Form.useWatch('akiCategoryName', categoryForm);
  const akiCategoryImageURL = Form.useWatch('akiCategoryImageURL', categoryForm);
  const akiCategoryDescriptionText = Form.useWatch('akiCategoryDescriptionText', categoryForm);
  const [isEdit, setIsEdit] = useState(false);
  const notify = useNotification();
  const defaultValue = {
    akiCategoryGuidePrice: 0,
    akiCategoryGuideWeight: 0,
    akiCategoryListOrder: 0,
    akiCategoryPopular: false,
    akiCategoryImageURL: '',
    akiCategoryImageHeight: 0,
    akiCategoryImageWidth: 0,
    akiCategoryIncludeInSearchByManufacture: false,
    akiCategoryMinimumDigits: 0,
    akiCategoryReturnType: '',
    akiCategoryShowPriceBreaks: false,
    akiCategoryCommodityCode: '',
    akiCategoryPromptUserIfPriceGroupIsBlank: false,
    akiCategoryCountryOfOrigin: '',
    akiCategoryTickBoxNotInUse: false,
    akiCategoryUseComplexSearch: false,
    akiCategoryDiscount: 0,
    akiCategoryLogInAndGreenTickOnly: false,
    akiCategoryPrintCatImage: '',
    akiCategoryPrintCatTemp: false,
    akiCategoryAlternativeTitle: '',
    akiCategoryIndex1: '',
    akiCategoryIndex2: '',
    akiCategoryIndex3: '',
    akiCategoryIndex4: '',
    akiCategoryIndex5: '',
    aki_Indentation: 0,
    akiDepartment: '',
    akidepartmentname: '',
    // akI_Show_Category_Text: false,
    // akI_Show_Category_Image: false,
    akI_Layout_Template: '',
    akiCategoryDescriptionText: '',
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [countriesData, commoditiesData, layoutsData] = await Promise.all([getCountryOrigin(), getCommodityCodes(), getCategoryLayouts()]);
        setCountries(countriesData || []);
        setCommodityCode(commoditiesData || []);
        setLayoutOptions(
          (layoutsData || []).map((layout) => ({
            ...layout,
            departmentId: layout.categoryId,
          }))
        );
      } catch {
        notify.error('Could not load necessary form options.');
      }
    };

    fetchInitialData();

    if (location.pathname === '/category/add' || (!getSessionItem('CategoryId') && !getSessionItem('tempCategoryId'))) {
      categoryForm.setFieldValue('akiDepartment', getSessionItem('departmentId') ? getSessionItem('departmentId') : getSessionItem('tempDepartmentId'));
      categoryForm.setFieldValue('akiCategoryID', '0');
      categoryForm.setFieldValue('akiCategoryParentID', getSessionItem('CategoryId') ? getSessionItem('CategoryId') : getSessionItem('tempCategoryId') || '0');
      setLoading(false);
      return;
    }
    const currentCategoryId = getSessionItem('CategoryId') || getSessionItem('tempCategoryId');
    if (currentCategoryId) {
      setCategoryId(currentCategoryId);
      categoryForm.setFieldValue('akiCategoryID', currentCategoryId);
      setIsEdit(true);
    } else {
      notify.error('Category ID not found. Please select from home page.');
      // navigate('/home');
    }
  }, [navigate, location.pathname, categoryForm, notify]);

  const fetchCategoryById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await getCategoryById(id);
        if (response.isSuccess && response.value && Array.isArray(response.value)) {
          const details = response.value[0];
          setCategoryDetails(details);
          categoryForm.setFieldsValue({
            ...details,
            akiCategoryPopular: !!details.akiCategoryPopular,
            akiCategoryIncludeInSearchByManufacture: !!details.akiCategoryIncludeInSearchByManufacture,
            akiCategoryShowPriceBreaks: !!details.akiCategoryShowPriceBreaks,
            akiCategoryPromptUserIfPriceGroupIsBlank: !!details.akiCategoryPromptUserIfPriceGroupIsBlank,
            akiCategoryTickBoxNotInUse: !!details.akiCategoryTickBoxNotInUse,
            akiCategoryUseComplexSearch: !!details.akiCategoryUseComplexSearch,
            akiCategoryLogInAndGreenTickOnly: !!details.akiCategoryLogInAndGreenTickOnly,
            akiCategoryPrintCatTemp: !!details.akiCategoryPrintCatTemp,
            aki_Show_Category_Text: !!details.akI_Show_Category_Text,
            aki_Show_Category_Image: !!details.akI_Show_Category_Image,
            akiCategoryWebActive: !!details.akiCategoryWebActive,
            akiCategoryPrintCatActive: !!details.akiCategoryPrintCatActive,
            additionalImages: String((details as Record<string, unknown>).additionalImagesCount || 0),
            urlLinks: String((details as Record<string, unknown>).urlLinksCount || 0),
            aki_Layout_Template: !!details.akI_Layout_Template,
          });
        } else {
          notify.error('Failed to load category details.');
        }
      } catch {
        notify.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [categoryForm, notify]
  );

  const fetchAdditionalCategory = useCallback(
    async (id: string) => {
      setIsAssociatePLoading(true);
      try {
        const data = await getAdditionalCategory(id);
        setAdditionalCategoryList(data);
        const maxListOrder = data.length > 0 ? Math.max(...data.map((cat) => Number(cat.listOrder) || 0)) : 0;
        addAssociatedProductForm.setFieldsValue({listorder: maxListOrder + 1});
      } catch {
        notify.error('Error fetching associated products list.');
        setAdditionalCategoryList([]);
      } finally {
        setIsAssociatePLoading(false);
      }
    },
    [addAssociatedProductForm, notify]
  );

  useEffect(() => {
    if (categoryId) {
      fetchCategoryById(categoryId);
      fetchAdditionalCategory(categoryId);
    }
  }, [categoryId, fetchCategoryById, fetchAdditionalCategory]);

  type ProductApiResponse = {
    products: Product[];
    totalRecords: number;
    [key: string]: unknown;
  };
  const fetchProductsForModal = useCallback(async () => {
    if (!isVisibleAddProductModal) return;
    setLoadingProduct(true);
    try {
      const current = productTableParams.pagination?.current ?? 1;
      const pageSize = productTableParams.pagination?.pageSize ?? 10;
      const response = await getAllProducts(current, pageSize, productSearchValue);
      let fetchedProducts: Product[] = [];
      let totalRecords = 0;
      if (response && response.value && Array.isArray(response.value)) {
        fetchedProducts = response.value as Product[];
      } else if (response && response.value && typeof response.value === 'object' && 'products' in response.value && Array.isArray((response.value as unknown as ProductApiResponse).products)) {
        const apiResp = response.value as unknown as ProductApiResponse;
        fetchedProducts = apiResp.products;
        totalRecords = apiResp.totalRecords || 0;
      }
      if (additionalCategoryList.length > 0) {
        const existingIds = additionalCategoryList.map((cat) => cat.product);
        fetchedProducts = fetchedProducts.filter((prod: Product) => !existingIds.includes(prod.akiProductID));
      }
      setProductNameList(fetchedProducts);
      setProductTableParams((prev) => {
        if (prev.pagination && prev.pagination.total === totalRecords) return prev;
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
      setProductNameList([]);
    } finally {
      setLoadingProduct(false);
    }
  }, [isVisibleAddProductModal, productTableParams.pagination, productSearchValue, additionalCategoryList, notify]);

  useEffect(() => {
    if (isVisibleAddProductModal) {
      fetchProductsForModal();
    }
  }, [isVisibleAddProductModal, productSearchValue, productTableParams.pagination, fetchProductsForModal]);

  const handleCategoryUpdateSubmit = async (values: UpdateCategoryModel) => {
    setBtnLoading(true);
    console.log('value', values, categoryId);
    const payload: UpdateCategoryModel = {
      ...values,
      akiCategoryID: values.akiCategoryID || '',
      // akiCategoryParentID: categoryDetails?.akiCategoryParentID || '',
      // akiDepartment: categoryDetails?.akiDepartment || '',
      akiCategoryParentID: values.akiCategoryParentID || '',
      akiDepartment: values.akiDepartment || '',
      akiCategoryGuidePrice: Number(values.akiCategoryGuidePrice) || 0,
      akiCategoryGuideWeight: Number(values.akiCategoryGuideWeight) || 0,
      akiCategoryListOrder: Number(values.akiCategoryListOrder) || 0,
      akiCategoryImageHeight: Number(values.akiCategoryImageHeight) || 0,
      akiCategoryImageWidth: Number(values.akiCategoryImageWidth) || 0,
      akiCategoryMinimumDigits: Number(values.akiCategoryMinimumDigits) || 0,
      akiCategoryDiscount: Number(values.akiCategoryDiscount) || 0,
      aki_Indentation: Number((values as UpdateCategoryModel).aki_Indentation) || 0,
      akiCategoryCommodityCode: values.akiCategoryCommodityCode || '',
      akiCategoryCountryOfOrigin: values.akiCategoryCountryOfOrigin || '',
      aki_Layout_Template: values.akI_Layout_Template || '',
      akiCategoryReturnType: values.akiCategoryReturnType || '',
      akiCategoryPrintCatImage: '',
      akiCategoryPrintCatTemp: true,
      akidepartmentname: categoryDetails?.akIdepartmentname || '',
      aki_Show_Category_Text: (values as UpdateCategoryModel).aki_Show_Category_Text || false,
      aki_Show_Category_Image: (values as UpdateCategoryModel).aki_Show_Category_Image || false,
    };
    delete payload.akI_Layout_Template;
    try {
      if (isEdit) {
        const response = await updateCategory(payload);
        if (response.isSuccess) {
          notify.success('Category details updated successfully');
          navigate('/home');
        } else {
          notify.error('Category details not updated');
        }
      } else {
        const response = await addCategory(payload);
        if (response.isSuccess) {
          notify.success('Category details Added successfully');
          navigate('/home');
        } else {
          notify.error('Category details not added');
        }
      }
    } catch {
      notify.error('Something went wrong');
    } finally {
      setBtnLoading(false);
    }
  };
  const handleAddAssociatedProductSubmit = async (values: {listorder: number; product: number; productName: string}) => {
    if (!values.product) {
      message.error('Please select a product from the grid below.');
      return;
    }
    if (!categoryId) {
      message.error('Category context is missing.');
      return;
    }
    const listOrder = Number(values.listorder);
    const isListOrderExist = additionalCategoryList.some((category) => Number(category.listOrder) === listOrder);
    if (isListOrderExist) {
      notify.error('List order already exists, please choose another number.');
      return;
    }
    const payload: AssociatedProductRequestModel = {
      product: values.product,
      additionalCategory: categoryId,
      listorder: listOrder,
      isAdditionalProduct: true,
    };
    try {
      const response = await addAssociatedProduct(payload);
      if (response.isSuccess) {
        message.success('Associated product added successfully');
        setIsVisibleAddProductModal(false);
        addAssociatedProductForm.resetFields();
        fetchAdditionalCategory(categoryId);
      } else {
        notify.error('Associated product not added');
      }
    } catch {
      notify.error('Something went wrong');
    }
  };

  const handleStartEdit = (record: AdditionalCategoryModel) => {
    editAssociatedProductForm.setFieldsValue({...record});
    setEditingId(record.product);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    editAssociatedProductForm.resetFields();
  };
  const handleUpdateAssociatedProduct = async () => {
    if (!editingId) return;
    try {
      const values = await editAssociatedProductForm.validateFields();
      const listOrder = Number(values.listOrder);
      const isListOrderExist = additionalCategoryList.some((category) => Number(category.listOrder) === listOrder && category.product !== editingId);
      if (isListOrderExist) {
        notify.error('List order already exists, please choose another number.');
        return;
      }
      const payload: AssociatedProductRequestModel = {
        product: editingId,
        additionalCategory: categoryId!,
        listorder: listOrder,
        isAdditionalProduct: values.isAdditionalProduct ?? true,
      };
      const response = await updateAssociatedProduct(payload);
      if (response.isSuccess) {
        notify.success('Associated product updated successfully');
        setEditingId(null);
        fetchAdditionalCategory(categoryId!);
      } else {
        notify.error('Associated product not updated');
      }
    } catch (error) {
      if ((error as {errorFields?: unknown}).errorFields) return;
      else {
        notify.error('Something went wrong');
      }
    }
  };
  const showAddProductModal = () => {
    addAssociatedProductForm.resetFields();
    setProductSearchValue('');
    setProductTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
    setIsVisibleAddProductModal(true);
  };
  const handleModalCancel = () => {
    setIsVisibleAddProductModal(false);
    addAssociatedProductForm.resetFields();
  };
  const handleProductSelect = (record: ProductSearchResult) => {
    addAssociatedProductForm.setFieldsValue({
      listorder: addAssociatedProductForm.getFieldValue('listorder'),
      product: record.akiProductID,
      productName: record.akiProductName,
    });
    notify.success(`Selected: ${record.akiProductName}`);
  };
  const handleFileChange = (info: UploadChangeParam<UploadFile>, formInstance: typeof categoryForm, fieldName: string) => {
    const file = info.file?.originFileObj;
    if (file) {
      formInstance.setFieldsValue({[fieldName]: file.name});
      if (info.file.status === 'done') {
        notify.success(`${info.file.name} uploaded successfully.`);
      } else if (info.file.status === 'error') {
        notify.error(`${info.file.name} upload failed.`);
      }
    } else if (info.file.status === 'removed') {
      formInstance.setFieldsValue({[fieldName]: ''});
    }
  };
  const handleProductTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProductSearchResult> | SorterResult<ProductSearchResult>[]
  ) => {
    setProductTableParams({
      pagination,
      filters,
      sortField: Array.isArray(sorter) ? undefined : (sorter.field as string | undefined),
      sortOrder: Array.isArray(sorter) ? undefined : (sorter.order as string | undefined),
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearchValue(e.target.value);
  };
  const handleSearchEnter = () => {
    setProductTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
  };
  const clearProductSearch = () => {
    setProductSearchValue('');
    setProductTableParams((prev) => ({...prev, pagination: {...prev.pagination, current: 1}}));
  };

  const goToLinkMaintenance = () => {
    const productId = categoryForm.getFieldValue('akiCategoryID');
    if (!productId) return;
    window.location.href = '/category/link-maintenance';
  };

  const goToAdditionalImage = () => {
    const productId = categoryForm.getFieldValue('akiCategoryID');
    if (!productId) return;
    window.location.href = '/category/additional-images';
  };

  const associatedProductColumns: TableProps<AdditionalCategoryModel>['columns'] = [
    {
      title: 'List Order',
      dataIndex: 'listOrder',
      width: 100,
      render: (text, record) => {
        if (editingId === record.product) {
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
      dataIndex: 'productName',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const editable = record.product === editingId;
        return editable ? (
          <span className="flex gap-x-2">
            <Button size="small" onClick={handleUpdateAssociatedProduct} type="link">
              Save
            </Button>
            <Button size="small" onClick={handleCancelEdit} type="link" danger>
              Close
            </Button>
          </span>
        ) : (
          <Button size="small" icon={<EditOutlined />} onClick={() => handleStartEdit(record)} type="text" disabled={editingId !== null} style={{padding: '0 5px', color: '#1890ff'}} />
        );
      },
    },
  ];
  const productSearchColumns: TableProps<ProductSearchResult>['columns'] = [
    {title: 'Product Id', dataIndex: 'akiProductID', width: 100},
    {
      title: 'Product Name',
      dataIndex: 'akiProductName',
      render: (text, record) => (
        <a onClick={() => handleProductSelect(record)} className="text-primary-theme cursor-pointer">
          {text}
        </a>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'akiProductIsActive',
      width: 80,
      align: 'center',
      render: (isActive) => (isActive ? <CheckCircleOutlined className="text-primary-theme" /> : <StopOutlined className="text-danger" />),
    },
  ];
  return (
    <div className="main-container">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-sm font-medium">Category Form</span>
          <div className="flex gap-x-3">
            <Button size="small" onClick={() => navigate('/home')}>
              Close
            </Button>
            <Button size="small" type="primary" loading={btnLoading} onClick={() => categoryForm.submit()}>
              {isEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
        <hr className="mt-2 mb-1 border-light-border" />
        <div className="p-2 pt-3">
          <Form form={categoryForm} layout="vertical" onFinish={handleCategoryUpdateSubmit} initialValues={defaultValue}>
            <div className="grid grid-cols-12 gap-x-20 gap-y-0">
              <div className="col-span-6">
                <div className="grid grid-cols-3 gap-x-4">
                  <Form.Item label="Category Id" name="akiCategoryID">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Parent Id" name="akiCategoryParentID">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Department Id" name="akiDepartment">
                    <Input disabled />
                  </Form.Item>
                </div>
                <div className="relative">
                  <Form.Item label="Category Name" name="akiCategoryName" rules={[{required: true, message: 'Category name is required'}]}>
                    <Input maxLength={charLimit.akiCategoryName} className="pr-12" />
                  </Form.Item>
                  <span className="absolute -right-13 top-5">
                    {akiCategoryName?.length || 0} / {charLimit.akiCategoryName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                  <Form.Item label="Guide Price" name="akiCategoryGuidePrice">
                    <Input type="number" step="0.01" />
                  </Form.Item>
                  <Form.Item label="Guide Weight" name="akiCategoryGuideWeight">
                    <Input type="number" step="0.01" />
                  </Form.Item>
                  <Form.Item label="Commodity Code" name="akiCategoryCommodityCode">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select code"
                      optionFilterProp="label"
                      options={commodityCode.map((c) => ({value: c.commodityCode, label: c.commodityCode, key: c.commodityCode}))}
                    />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-end">
                  <Form.Item label="List Order" name="akiCategoryListOrder">
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item label="Country of Origin" name="akiCategoryCountryOfOrigin">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select country"
                      optionFilterProp="label"
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={countries.map((c) => ({value: c.code, label: c.name, key: c.code}))}
                    />
                  </Form.Item>
                  <Form.Item name="akiCategoryPromptUserIfPriceGroupIsBlank" valuePropName="checked" noStyle>
                    <Checkbox className="pb-2">Prompt If Price Group Blank</Checkbox>
                  </Form.Item>
                </div>
                <Form.Item label="Flags">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <Form.Item name="akiCategoryWebActive" valuePropName="checked" noStyle>
                      <Checkbox>Web Active</Checkbox>
                    </Form.Item>
                    <Form.Item name="akiCategoryPopular" valuePropName="checked" noStyle>
                      <Checkbox>Popular</Checkbox>
                    </Form.Item>
                    <Form.Item name="akiCategoryTickBoxNotInUse" valuePropName="checked" noStyle>
                      <Checkbox>Tick Box Not In Use</Checkbox>
                    </Form.Item>
                    <Form.Item name="akiCategoryUseComplexSearch" valuePropName="checked" noStyle>
                      <Checkbox>Use Complex Search</Checkbox>
                    </Form.Item>
                  </div>
                </Form.Item>

                <div className="relative col-span-2">
                  <Form.Item label="Category Text" name="akiCategoryDescriptionText">
                    <Input.TextArea rows={3} maxLength={2000} />
                  </Form.Item>
                  <span className=" absolute bottom-3 -right-16  ">
                    {akiCategoryDescriptionText?.length || 0} / {charLimit.akiCategoryDescriptionText}
                  </span>
                </div>
                <div className="flex items-end gap-x-3 relative">
                  <Form.Item label="Image URL" name="akiCategoryImageURL" className="w-full" rules={[{type: 'string', message: 'Please enter a valid URL (or leave blank)'}]}>
                    <Input maxLength={charLimit.akiCategoryImageURL} />
                  </Form.Item>
                  <Upload
                    customRequest={({file, onSuccess}) => {
                      setTimeout(() => {
                        if (onSuccess) onSuccess({}, file);
                      }, 500);
                    }}
                    headers={{authorization: 'your-auth-token'}}
                    onChange={(info) => handleFileChange(info, categoryForm, 'akiCategoryImageURL')}
                    showUploadList={false}
                    accept=".png,.jpeg,.jpg"
                  >
                    <Button size="small" type="primary">
                      Upload
                    </Button>
                  </Upload>
                  <span className=" absolute -right-14 top-1/2">
                    {akiCategoryImageURL?.length || 0} / {charLimit.akiCategoryImageURL}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-center">
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
                  <Form.Item label="Category Discount (%)" name="akiCategoryDiscount">
                    <Input type="number" step="0.01" />
                  </Form.Item>
                  <span className="mt-6">(If empty, or 0, the Department default will be used)</span>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-center">
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
                  <Form.Item label="Image Height (px)" name="akiCategoryImageHeight">
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item label="Image Width (px)" name="akiCategoryImageWidth">
                    <Input type="number" />
                  </Form.Item>
                </div>
                <div className="mt-1">
                  <label className="font-medium text-secondary-font block ">Website Specific</label>
                  <div className="border border-border rounded-lg p-2">
                    <div className="grid grid-cols-2 gap-x-4 items-start">
                      <div className="flex flex-col space-y-2">
                        <Form.Item name="akiCategoryIncludeInSearchByManufacture" valuePropName="checked" noStyle>
                          <Checkbox>Include Search by Manufacturer</Checkbox>
                        </Form.Item>
                        <Form.Item name="akiCategoryLogInAndGreenTickOnly" valuePropName="checked" noStyle>
                          <Checkbox>Log in and green tick only</Checkbox>
                        </Form.Item>
                      </div>
                      <Form.Item label="Minimum Digits" name="akiCategoryMinimumDigits">
                        <Input type="number" disabled />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 items-end">
                  <Form.Item label="Return Type" name="akiCategoryReturnType">
                    <Select allowClear showSearch placeholder="Select return type" options={returnOptions} />
                  </Form.Item>
                  <span className=" pb-2">This will roll down to sub-categories.</span>
                </div>
              </div>
              <div className="col-span-6">
                <Form.Item label="Print Catalogue Settings" className="mb-2">
                  <div className="flex flex-col items-start space-y-1">
                    <Form.Item name="akiCategoryPrintCatActive" valuePropName="checked" noStyle>
                      <Checkbox>Cat Active</Checkbox>
                    </Form.Item>
                    <Form.Item name="aki_Show_Category_Text" valuePropName="checked" noStyle>
                      <Checkbox>Show Category Text</Checkbox>
                    </Form.Item>
                    <Form.Item name="aki_Show_Category_Image" valuePropName="checked" noStyle>
                      <Checkbox>Show Category Image</Checkbox>
                    </Form.Item>
                  </div>
                </Form.Item>
                <Form.Item label="Layout Template" name="akI_Layout_Template">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select layout"
                    optionFilterProp="label"
                    options={layoutOptions.map((opt) => ({value: opt.templateCode, label: opt.layoutDescription, key: opt.templateCode}))}
                  />
                </Form.Item>
                <Form.Item label="Alternative Title" name="akiCategoryAlternativeTitle">
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item name="akiCategoryShowPriceBreaks" valuePropName="checked" className="mt-2 mb-4">
                  <Checkbox>Show Price Breaks</Checkbox>
                </Form.Item>
                <div className="mt-1">
                  <label className="font-medium text-secondary-font block mb-1">Index Entry Text</label>
                  <div className="border border-border rounded-lg p-2">
                    <IndexEntryFields form={categoryForm} fieldPrefix="akiCategoryIndex" labelPrefix="Index Entry" max={5} />
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-4 gap-x-6">
                <div className="col-span-2">
                  <div className="font-medium text-primary-font  mb-1">Associated Products</div>
                  <div className="border border-border rounded-lg p-2">
                    <div className="flex justify-end mb-2">
                      <Button size="small" type="primary" onClick={showAddProductModal}>
                        Add
                      </Button>
                    </div>
                    <Form form={editAssociatedProductForm} component={false}>
                      <Table
                        columns={associatedProductColumns}
                        dataSource={additionalCategoryList}
                        rowKey="product"
                        loading={isAssociatePLoading}
                        pagination={false}
                        size="small"
                        bordered
                        virtual
                        scroll={{y: 180}}
                      />
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Spin>
      <Modal title="Add Product" open={isVisibleAddProductModal} onCancel={handleModalCancel} footer={null} width={600} destroyOnClose>
        <Form
          form={addAssociatedProductForm}
          layout="vertical"
          onFinish={handleAddAssociatedProductSubmit}
          className="px-3 py-1"
          initialValues={{listorder: additionalCategoryList.length > 0 ? Math.max(...additionalCategoryList.map((c) => Number(c.listOrder) || 0)) + 1 : 1}}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label="List Order" name="listorder" rules={[{required: true, message: 'List order is required'}]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="product" style={{display: 'none'}}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item label="Product Name" name="productName" rules={[{required: true, message: 'Please select a product from the list below'}]}>
              <Input disabled placeholder="Select product from table..." />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center gap-3 mt-4 mb-4">
            <Input
              placeholder="Search By Product Name"
              value={productSearchValue}
              onChange={handleSearchChange}
              onPressEnter={handleSearchEnter}
              suffix={
                productSearchValue ? <CloseCircleFilled onClick={clearProductSearch} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />
              }
              style={{flexGrow: 1, maxWidth: '300px'}}
            />
            <div className="flex gap-x-3">
              <Button size="small" onClick={handleModalCancel}>
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
            columns={productSearchColumns}
            rowKey="akiProductID"
            dataSource={productNameList}
            pagination={productTableParams.pagination}
            loading={loadingProduct}
            onChange={handleProductTableChange}
            size="small"
            bordered
          />
        </div>
      </Modal>
    </div>
  );
};

export default Category;
