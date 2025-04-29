import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Form, Input, Select, Checkbox, Button, Table, Modal, Spin} from 'antd';
import {CloseCircleFilled, EditOutlined, SearchOutlined} from '@ant-design/icons';
import {getAttributeSearchTypes, getAttributeByAttributesName, getAttributeValuesByAttributesName, addAttributes, updateAttributes} from '../../services/AttributesService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {AttributeRequestModel, AttributeValueModel} from '../../models/attributesModel';
import type {ItemModel} from '../../models/itemModel';
import AttributesValues from './AttributeValuesPopup';
import {AttributeFormCharLimit} from '../../models/char.constant';

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
  const [editValueData, setEditValueData] = useState<AttributeValueModel | null>(null);
  const attributeNametxt = Form.useWatch('attributeName', form);
  const attributeDescriptionetxt = Form.useWatch('attributeDescription', form);

  const notify = useNotification();

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
          notify.error(response.exceptionInformation || 'Failed to load attribute details.');
        }
      } catch {
        notify.error('Error loading attribute details.');
      } finally {
        setLoading(false);
      }
    },
    [form, notify]
  );

  const fetchAttributeValues = useCallback(
    async (name?: string) => {
      if (!name) return;
      setLoading(true);
      try {
        const response = await getAttributeValuesByAttributesName(name);
        if (response.isSuccess && response.value) {
          setAttributesValues(response.value);
        } else {
          setAttributesValues([]);
          notify.error(response.exceptionInformation || 'Failed to load attribute values.');
        }
      } catch {
        notify.error('Error loading attribute values.');
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const searchTypeRes = await getAttributeSearchTypes();
        if (searchTypeRes.isSuccess) {
          setSearchType(searchTypeRes.value || []);
        } else {
          notify.error('Failed to load search types.');
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
        notify.error('Error loading initial data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchAttributeDetails, fetchAttributeValues, form, notify]);

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
        notify.success(`Attribute ${isEdit ? 'updated' : 'added'} successfully.`);
        if (!isEdit) {
          setIsEdit(true);
          setAttributeName(currentAttributeName);
          setIsAttributeNameDisabled(true);
          setIsNewValueBtnDisabled(false);
          sessionStorage.setItem('attributeName', currentAttributeName);
          notify.error('You can now add values for this attribute.');
        }
      } else {
        const message =
          response.value
            ?.split('.')[0]
            ?.replace(/^Attribute:\s*/i, '')
            .trim() ||
          response.exceptionInformation ||
          `Failed to ${isEdit ? 'update' : 'add'} attribute.`;
        notify.error(message);
      }
    } catch (errorInfo) {
      if (typeof errorInfo === 'object' && errorInfo !== null && 'errorFields' in errorInfo && Array.isArray((errorInfo as {errorFields?: unknown[]}).errorFields)) {
        notify.error('Please fill in all required fields.');
      } else if (
        typeof errorInfo === 'object' &&
        errorInfo !== null &&
        'error' in errorInfo &&
        (errorInfo as {error?: {title?: string}}).error !== undefined &&
        (errorInfo as {error?: {title?: string}}).error?.title
      ) {
        notify.error((errorInfo as {error?: {title?: string}}).error?.title || '');
      } else {
        notify.error('Failed to submit attribute value.');
      }
    } finally {
      setBtnLoading(false);
    }
  };
  const handleEditAttribute = (record: AttributeValueModel) => {
    setEditValueData(record);
    setIsValueModalVisible(true);
  };

  const valueColumns = [
    {title: 'Attribute Name', dataIndex: 'attributeName', ellipsis: true},
    {title: 'Attribute Value', dataIndex: 'attributeValue', ellipsis: true},
    {title: 'New Alternate Value', dataIndex: 'newAlternateValue', ellipsis: true},
    {title: 'Alternate Value', dataIndex: 'alternateValues', ellipsis: true},
    {
      title: 'Action',
      key: 'action',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, record: AttributeValueModel) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEditAttribute(record)} size="small" style={{padding: '0 5px', color: '#1890ff'}} aria-label={`Edit ${record.attributeName}`} />
      ),
    },
  ];

  return (
    <div className="main-container">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-lg font-medium text-primary-font">{isEdit ? 'Edit Attribute' : 'Add Attribute'}</span>
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

                <div className="relative">
                  <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute Name is required.'}]} className="mb-3">
                    <Input maxLength={AttributeFormCharLimit.attributeName} disabled={isAttributeNameDisabled} />
                  </Form.Item>
                  <span className="absolute -right-12 top-6">
                    {attributeNametxt?.length} / {AttributeFormCharLimit.attributeName}
                  </span>
                </div>

                <div className="relative">
                  <Form.Item label="Attribute Description" name="attributeDescription" className="mb-3">
                    <Input maxLength={AttributeFormCharLimit.attributeDescription} />
                  </Form.Item>
                  <span className="absolute -right-14 top-6">
                    {attributeDescriptionetxt?.length} / {AttributeFormCharLimit.attributeDescription}
                  </span>
                </div>
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

      <Modal
        title={editValueData ? 'Edit Attribute' : 'Add Attribute '}
        open={isValueModalVisible}
        onCancel={() => {
          setEditValueData(null);
          handleValueModalClose('cancel');
        }}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={500}
      >
        {attributeName && (
          <AttributesValues
            attributeName={attributeName}
            onClose={(reason) => {
              setEditValueData(null);
              handleValueModalClose(reason);
            }}
            valueData={editValueData}
          />
        )}
      </Modal>
    </div>
  );
};

export default AttributeForm;
