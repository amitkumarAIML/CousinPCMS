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

  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchType, setSearchType] = useState<ItemModel[]>([]);
  const [attributesValues, setAttributesValues] = useState<AttributeValueModel[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [attributeName, setAttributeName] = useState<string>('');
  const [isAttributeNameDisabled, setIsAttributeNameDisabled] = useState<boolean>(false);
  const [isValueModalVisible, setIsValueModalVisible] = useState<boolean>(false);
  const [isNewValueBtnDisabled, setIsNewValueBtnDisabled] = useState<boolean>(true);

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
          setIsAttributeNameDisabled(true);
          setIsNewValueBtnDisabled(false);

          await fetchAttributeDetails(nameFromSession);
          await fetchAttributeValues(nameFromSession);
        } else {
          setIsEdit(false);
          setAttributeName('');
          setIsAttributeNameDisabled(false);
          setIsNewValueBtnDisabled(true);
          form.resetFields();
          form.setFieldsValue({showAsCategory: true});
          setAttributesValues([]);
        }
      } catch (error) {
        console.error('Error during initial data load:', error);
        showNotification('error', 'Error loading initial data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchAttributeDetails, fetchAttributeValues, form]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return attributesValues;
    }
    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';
    return attributesValues.filter((item) => normalize(item.attributeName).includes(normalizedSearch) || normalize(item.attributeValue).includes(normalizedSearch));
  }, [searchValue, attributesValues]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  const handleCancel = () => {
    setIsEdit(false);
    sessionStorage.removeItem('attributeName');
    navigate('/attributes');
  };

  const showAddAttributesModal = () => {
    setIsValueModalVisible(true);
  };

  const handleValueModalClose = (reason: 'save' | 'cancel') => {
    setIsValueModalVisible(false);
    if (reason === 'save') {
      fetchAttributeValues(attributeName);
    }
  };

  const handleSaveOrUpdate = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const currentAttributeName = attributeName || values.attributeName;

      const payload: AttributeRequestModel = {
        ...values,
        attributeName: currentAttributeName,
        showAsCategory: !!values.showAsCategory,
      };

      let response;
      if (isEdit) {
        response = await updateAttributes(payload);
      } else {
        response = await addAttributes(payload);
      }

      if (response.isSuccess) {
        showNotification('success', `Attribute ${isEdit ? 'updated' : 'added'} successfully.`);
        if (!isEdit) {
          setIsEdit(true);
          setAttributeName(currentAttributeName);
          setIsAttributeNameDisabled(true);
          setIsNewValueBtnDisabled(false);
          sessionStorage.setItem('attributeName', currentAttributeName);
          showNotification('error', 'You can now add values for this attribute.');
        }
      } else {
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
    setLoading(true);
    try {
      const response = await deleteAttributesValues(record.attributeName, record.attributeValue);
      if (response.isSuccess) {
        showNotification('success', 'Attribute Value Successfully Deleted');

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

  const charCount = (fieldName: keyof AttributeRequestModel, limit: number) => {
    const value = form.getFieldValue(fieldName) || '';
    return limit - value.length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md m-5 pb-4">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-lg font-medium text-primary-font">{isEdit ? `Edit Attribute: ${attributeName}` : 'Add New Attribute'}</span>
          <div className="flex gap-x-3">
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
        <hr className="mt-2 mb-2 border-border" />

        <div className="p-4">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-0">
              <div className="lg:col-span-5 md:col-span-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
                  <Form.Item label="Search Type" name="searchType" rules={[{required: true, message: 'Search Type is required.'}]} className="mb-3">
                    <Select placeholder="Select search type" allowClear showSearch options={searchType.map((st) => ({value: st.description, label: st.description, key: st.code}))} />
                  </Form.Item>

                  <div className="md:col-start-3 flex items-center justify-start md:justify-center h-full pb-3">
                    <Form.Item name="showAsCategory" valuePropName="checked" noStyle>
                      <Checkbox>Show as category</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute Name is required.'}]} className="mb-3">
                  <div className="relative">
                    <Input maxLength={50} disabled={isAttributeNameDisabled} />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2  text-xs">{charCount('attributeName', 50)}</span>
                  </div>
                </Form.Item>

                <Form.Item label="Attribute Description" name="attributeDescription" className="mb-3">
                  <div className="relative">
                    <Input maxLength={100} />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2  text-xs">{charCount('attributeDescription', 100)}</span>
                  </div>
                </Form.Item>
              </div>
            </div>
          </Form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
            <div className="lg:col-span-5 md:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 items-end mb-4">
                <Form layout="vertical" className="md:col-span-2">
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

                <div className="md:col-span-2 flex justify-start md:justify-end gap-x-2">
                  <Button type="primary" loading={btnLoading} onClick={handleSaveOrUpdate}>
                    {isEdit ? 'Update Attribute' : 'Save Attribute'}
                  </Button>
                  <Button type="default" onClick={showAddAttributesModal} disabled={isNewValueBtnDisabled}>
                    New Value
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 mt-2">
                <Table columns={valueColumns} dataSource={filteredData as AttributeValueModel[]} rowKey="key" size="small" bordered pagination={false} />
              </div>
            </div>
          </div>
        </div>
      </Spin>

      <Modal title="Add New Attribute Value" visible={isValueModalVisible} onCancel={() => handleValueModalClose('cancel')} footer={null} destroyOnClose maskClosable={false} width={500}>
        {attributeName && <AttributesValues attributeName={attributeName} onClose={handleValueModalClose} />}
      </Modal>
    </div>
  );
};

export default AttributeForm;
