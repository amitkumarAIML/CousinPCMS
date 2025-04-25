import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Form, Input, Select, Checkbox, Button, Table, Modal, Spin, Popconfirm} from 'antd';
import {CloseCircleFilled, SearchOutlined} from '@ant-design/icons';
import {getAttributeSearchTypes, getAttributeByAttributesName, getAttributeValuesByAttributesName, addAttributes, updateAttributes, deleteAttributesValues} from '../../services/AttributesService';
import {showNotification} from '../../services/DataService';
import type {AttributeRequestModel, AttributeValueModel} from '../../models/attributesModel';
import type {ItemModel} from '../../models/itemModel';
import AttributesValues from './AttributeValuesPopup';

const AttributeForm: React.FC = () => {
  const [form] = Form.useForm<AttributeRequestModel>();
  const navigate = useNavigate();

  // --- State Variables ---
  const [loading, setLoading] = useState<boolean>(false); // Overall loading for initial data
  const [btnLoading, setBtnLoading] = useState<boolean>(false); // Save/Update button loading
  const [searchValue, setSearchValue] = useState<string>(''); // Search for values table
  const [searchType, setSearchType] = useState<ItemModel[]>([]); // Dropdown options
  const [attributesValues, setAttributesValues] = useState<AttributeValueModel[]>([]); // Master list of values
  const [isEdit, setIsEdit] = useState<boolean>(false); // Track Add vs Edit mode
  const [attributeName, setAttributeName] = useState<string>(''); // Current attribute name being edited/added
  const [isAttributeNameDisabled, setIsAttributeNameDisabled] = useState<boolean>(false); // Control attribute name input disable state
  const [isValueModalVisible, setIsValueModalVisible] = useState<boolean>(false);
  const [isNewValueBtnDisabled, setIsNewValueBtnDisabled] = useState<boolean>(true); // Control "New Value" button disabled state

  // --- Data Fetching ---
  const fetchAttributeDetails = useCallback(
    async (name?: string) => {
      if (!name) return;
      setLoading(true);
      try {
        const response = await getAttributeByAttributesName(name);
        if (response.isSuccess && response.value && response.value.length > 0) {
          const details = response.value[0];
          form.setFieldsValue({
            attributeName: details.attributeName,
            attributeDescription: details.attributeDescription,
            searchType: details.searchType,
            showAsCategory: details.showAsCategory,
          });
        } else {
          showNotification('error', response.exceptionInformation || 'Failed to load attribute details.');
        }
      } catch {
        showNotification('error', 'Error loading attribute details.');
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const fetchAttributeValues = useCallback(async (name?: string) => {
    if (!name) return;
    setLoading(true);
    try {
      const response = await getAttributeValuesByAttributesName(name);
      if (response.isSuccess && response.value) {
        setAttributesValues(response.value);
      } else {
        setAttributesValues([]);
        showNotification('error', response.exceptionInformation || 'Failed to load attribute values.');
      }
    } catch {
      showNotification('error', 'Error loading attribute values.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // Effect to fetch initial data (search types) and determine mode (Add/Edit)
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const searchTypeRes = await getAttributeSearchTypes();
        if (searchTypeRes.isSuccess) {
          setSearchType(searchTypeRes.value || []);
        } else {
          showNotification('error', 'Failed to load search types.');
        }

        const nameFromSession = sessionStorage.getItem('attributeName');
        if (nameFromSession) {
          setIsEdit(true);
          setAttributeName(nameFromSession);
          setIsAttributeNameDisabled(true); // Disable name field in edit mode
          setIsNewValueBtnDisabled(false); // Enable "New Value" button
          // Fetch existing attribute details and values
          await fetchAttributeDetails(nameFromSession);
          await fetchAttributeValues(nameFromSession);
        } else {
          setIsEdit(false);
          setAttributeName('');
          setIsAttributeNameDisabled(false); // Enable name field in add mode
          setIsNewValueBtnDisabled(true); // Disable "New Value" button initially
          form.resetFields(); // Ensure form is clear for add mode
          form.setFieldsValue({showAsCategory: true}); // Default checkbox value
          setAttributesValues([]); // Clear values table
        }
      } catch (error) {
        console.error('Error during initial data load:', error);
        showNotification('error', 'Error loading initial data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchAttributeDetails, fetchAttributeValues, form]); // Add missing dependencies to useEffect

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return attributesValues;
    }
    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';
    return attributesValues.filter((item) => normalize(item.attributeName).includes(normalizedSearch) || normalize(item.attributeValue).includes(normalizedSearch));
  }, [searchValue, attributesValues]);

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  const handleCancel = () => {
    setIsEdit(false);
    sessionStorage.removeItem('attributeName');
    navigate('/attributes'); // Navigate back to the list
  };

  const showAddAttributesModal = () => {
    // attributeName state should already be set if we are here
    setIsValueModalVisible(true);
  };

  const handleValueModalClose = (reason: 'save' | 'cancel') => {
    setIsValueModalVisible(false);
    if (reason === 'save') {
      // Refetch values after a new one is saved
      fetchAttributeValues(attributeName);
    }
  };

  const handleSaveOrUpdate = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const currentAttributeName = attributeName || values.attributeName; // Use state for edit, form value for add

      const payload: AttributeRequestModel = {
        ...values,
        attributeName: currentAttributeName, // Ensure correct name is sent
        showAsCategory: !!values.showAsCategory, // Ensure boolean
      };
      // Clean payload if necessary using dataService.cleanEmptyNullToString equivalent
      // const cleanedPayload = dataService.cleanEmptyNullToString(payload); // Assuming this exists

      let response;
      if (isEdit) {
        response = await updateAttributes(payload);
      } else {
        response = await addAttributes(payload);
      }

      if (response.isSuccess) {
        showNotification('success', `Attribute ${isEdit ? 'updated' : 'added'} successfully.`);
        if (!isEdit) {
          // After successful add, transition to "edit" state for this new attribute
          setIsEdit(true);
          setAttributeName(currentAttributeName); // Set the name in state
          setIsAttributeNameDisabled(true); // Disable name field
          setIsNewValueBtnDisabled(false); // Enable "New Value" button
          sessionStorage.setItem('attributeName', currentAttributeName); // Store in session
          showNotification('info', 'You can now add values for this attribute.');
        }
        // No navigation on update, maybe refetch details?
        // if (isEdit) fetchAttributeDetails(currentAttributeName);
      } else {
        // Handle specific API error messages if available
        const message =
          response.value
            ?.split('.')[0]
            ?.replace(/^Attribute:\s*/i, '')
            .trim() ||
          response.exceptionInformation ||
          `Failed to ${isEdit ? 'update' : 'add'} attribute.`;
        showNotification('error', message);
      }
    } catch (errorInfo) {
      if (typeof errorInfo === 'object' && errorInfo !== null && 'errorFields' in errorInfo && Array.isArray((errorInfo as {errorFields?: unknown[]}).errorFields)) {
        showNotification('error', 'Please fill in all required fields.');
      } else if (
        typeof errorInfo === 'object' &&
        errorInfo !== null &&
        'error' in errorInfo &&
        (errorInfo as {error?: {title?: string}}).error !== undefined &&
        (errorInfo as {error?: {title?: string}}).error?.title
      ) {
        showNotification('error', (errorInfo as {error?: {title?: string}}).error?.title || '');
      } else {
        showNotification('error', 'Failed to submit attribute value.');
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteAttributeValue = async (record: AttributeValueModel) => {
    setLoading(true); // Indicate loading state
    try {
      const response = await deleteAttributesValues(record.attributeName, record.attributeValue);
      if (response.isSuccess) {
        showNotification('success', 'Attribute Value Successfully Deleted');
        // Optimistic update
        setAttributesValues((prev) => prev.filter((item) => (item as AttributeValueModel).attributeValue !== (record as AttributeValueModel).attributeValue));
      } else {
        showNotification('error', response.exceptionInformation || 'Failed To Delete Attribute Value');
      }
    } catch (err) {
      console.error('Error deleting attribute value:', err);
      showNotification('error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // --- Table Column Definition ---
  const valueColumns = [
    {key: 'spacer', width: 50, render: () => null},
    {title: 'Attribute Name', dataIndex: 'attributeName', ellipsis: true},
    {title: 'Attribute Value', dataIndex: 'attributeValue', ellipsis: true},
    {
      title: 'Action',
      key: 'action',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, record: AttributeValueModel) => (
        <Popconfirm title="Delete this attribute value?" onConfirm={() => handleDeleteAttributeValue(record as AttributeValueModel)} okText="Yes" cancelText="No">
          <Button type="text" danger size="small" style={{padding: '0 5px'}} aria-label={`Delete value ${(record as AttributeValueModel).attributeValue}`} />
        </Popconfirm>
      ),
    },
  ];

  // --- Character Count Logic ---
  const charCount = (fieldName: keyof AttributeRequestModel, limit: number) => {
    const value = form.getFieldValue(fieldName) || '';
    return limit - value.length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md m-5 pb-4">
      <Spin spinning={loading}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-lg font-medium text-gray-700">{isEdit ? `Edit Attribute: ${attributeName}` : 'Add New Attribute'}</span>
          <div className="flex gap-x-3">
            <Button onClick={handleCancel}>Cancel</Button>
            {/* Save/Update button moved below */}
          </div>
        </div>
        <hr className="mt-2 mb-2 border-gray-200" />
        {/* Form and Table Area */}
        <div className="p-4">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-0">
              {/* Left Form Section */}
              <div className="lg:col-span-5 md:col-span-6">
                {/* Search Type / Show as Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
                  <Form.Item label="Search Type" name="searchType" rules={[{required: true, message: 'Search Type is required.'}]} className="mb-3">
                    <Select placeholder="Select search type" allowClear showSearch options={searchType.map((st) => ({value: st.description, label: st.description, key: st.code}))} />
                  </Form.Item>
                  {/* Checkbox aligned to the right */}
                  <div className="md:col-start-3 flex items-center justify-start md:justify-center h-full pb-3">
                    <Form.Item name="showAsCategory" valuePropName="checked" noStyle>
                      <Checkbox>Show as category</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                {/* Attribute Name */}
                <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute Name is required.'}]} className="mb-3">
                  <div className="relative">
                    <Input maxLength={50} disabled={isAttributeNameDisabled} />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charCount('attributeName', 50)}</span>
                  </div>
                </Form.Item>

                {/* Attribute Description */}
                <Form.Item label="Attribute Description" name="attributeDescription" className="mb-3">
                  <div className="relative">
                    <Input maxLength={100} />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charCount('attributeDescription', 100)}</span>
                  </div>
                </Form.Item>
              </div>{' '}
              {/* End Left Form Section */}
            </div>{' '}
            {/* End Form Grid */}
          </Form>{' '}
          {/* End Antd Form */}
          {/* Attribute Values Table Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
            {' '}
            {/* Increased margin-top */}
            <div className="lg:col-span-5 md:col-span-12">
              {' '}
              {/* Adjust spans if needed */}
              {/* Search and Buttons Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 items-end mb-4">
                <Form layout="vertical" className="md:col-span-2">
                  {' '}
                  {/* Search input takes more space */}
                  <Form.Item label="Search Values" className="mb-0">
                    <Input
                      placeholder="Search attribute values..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      suffix={
                        searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />
                      }
                    />
                  </Form.Item>
                </Form>
                {/* Buttons aligned to the right */}
                <div className="md:col-span-2 flex justify-start md:justify-end gap-x-2">
                  <Button type="primary" loading={btnLoading} onClick={handleSaveOrUpdate}>
                    {isEdit ? 'Update Attribute' : 'Save Attribute'}
                  </Button>
                  <Button
                    type="default" // Changed to default style
                    onClick={showAddAttributesModal}
                    disabled={isNewValueBtnDisabled}
                  >
                    New Value
                  </Button>
                </div>
              </div>
              {/* Values Table */}
              <div className="grid grid-cols-1 mt-2">
                <Table
                  columns={valueColumns}
                  dataSource={filteredData as AttributeValueModel[]}
                  rowKey="key"
                  size="small"
                  bordered
                  pagination={false}
                  scroll={{y: 400}} // Adjust height
                />
              </div>
            </div>
          </div>
        </div>{' '}
        {/* End p-4 container */}
      </Spin>

      {/* Modal for Adding New Value */}
      <Modal
        title="Add New Attribute Value"
        visible={isValueModalVisible}
        onCancel={() => handleValueModalClose('cancel')}
        footer={null} // Footer is likely in the child component now
        destroyOnClose
        maskClosable={false}
        width={500} // Match Angular width
      >
        {/* Render the AttributesValues component */}
        {attributeName && (
          <AttributesValues
            attributeName={attributeName}
            onClose={handleValueModalClose} // Pass the close handler
          />
        )}
      </Modal>
    </div>
  );
};

export default AttributeForm;
