import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Form, Input, Checkbox, Button, Modal, Spin} from 'antd';
import {CloseCircleFilled, SearchOutlined} from '@ant-design/icons';
import {getAttributeSearchTypes, getAttributeByAttributesName, getAttributeValuesByAttributesName, addAttributes, updateAttributes} from '../../services/AttributesService';
import {useNotification} from '../../hook/useNotification';
import type {AttributeRequestModel, AttributeValueModel} from '../../models/attributesModel';
import AttributesValues from './AttributeValuesPopup';
import {AttributeFormCharLimit} from '../../models/char.constant';
import {getSessionItem, setSessionItem} from '../../services/DataService';

const AttributeForm = () => {
  const [form] = Form.useForm<AttributeRequestModel>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  // const [searchType, setSearchType] = useState<ItemModel[]>([]);
  const [attributesValues, setAttributesValues] = useState<AttributeValueModel[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [attributeName, setAttributeName] = useState<string>('');
  const [isAttributeNameDisabled, setIsAttributeNameDisabled] = useState<boolean>(false);
  const [isValueModalVisible, setIsValueModalVisible] = useState<boolean>(false);
  const [isNewValueBtnDisabled, setIsNewValueBtnDisabled] = useState<boolean>(true);
  const [editValueData, setEditValueData] = useState<AttributeValueModel | null>(null);
  const attributeNametxt = Form.useWatch('attributeName', form);
  // const attributeDescriptionetxt = Form.useWatch('attributeDescription', form);

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
          notify.error('Failed to load attribute details.');
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
          const dataWithKeys = response.value.map((item, index) => ({
            ...item,
            key: item.id || item.id || index,
          }));
          setAttributesValues(dataWithKeys);
        } else {
          setAttributesValues([]);
          notify.error('Failed to load attribute values.');
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
          // setSearchType(searchTypeRes.value || []);
        } else {
          notify.error('Failed to load search types.');
        }

        const nameFromSession = getSessionItem('attributeName');
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
          setSessionItem('attributeName', currentAttributeName);
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
        notify.error(String(message || 'Failed to save attribute.'));
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

  // const valueColumns: TableProps<AttributeValueModel>['columns'] = [
  //   {title: 'Attribute Value', dataIndex: 'attributeValue', ellipsis: true, sorter: (a, b) => a.attributeValue.localeCompare(b.attributeValue)},
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     width: 60,
  //     align: 'center' as const,
  //     render: (_: unknown, record: AttributeValueModel) => (
  //       <Button type="link" icon={<EditOutlined />} onClick={() => handleEditAttribute(record)} size="small" style={{padding: '0 5px', color: '#1890ff'}} aria-label={`Edit ${record.attributeName}`} />
  //     ),
  //   },
  // ];

  // Function to chunk data into columns
  const chunkData = (data: any[], chunkSize: number) => {
    const result: any[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };
  const pageSize = 50;
  const chunkedData = chunkData(filteredData, pageSize);

  return (
    <div className="main-container">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-lg font-medium text-primary-font">{isEdit ? 'Edit Attribute' : 'Add Attribute'}</span>
          <div className="flex gap-x-3">
            <Button size="small" onClick={handleCancel}>
              Close
            </Button>
          </div>
        </div>
        <hr className="mt-2 mb-2 border-border" />

        <div className="p-4">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-12 gap-x-12 items-end">
              <div className="relative col-span-3">
                <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute Name is required.'}]}>
                  <Input maxLength={AttributeFormCharLimit.attributeName} disabled={isAttributeNameDisabled} />
                </Form.Item>
                <span className="absolute -right-9 top-6">
                  {attributeNametxt?.length || 0} / {AttributeFormCharLimit.attributeName}
                </span>
              </div>
              <div className="col-span-2 flex items-end justify-center h-full ">
                <Form.Item name="showAsCategory" valuePropName="checked" noStyle>
                  <Checkbox>Show as category</Checkbox>
                </Form.Item>
              </div>
            </div>
          </Form>

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <Form layout="vertical">
                <Form.Item label="Attribute Value Search" className="w-96">
                  <Input
                    placeholder="Search attribute values..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
                  />
                </Form.Item>
              </Form>

              <div className=" flex gap-x-2">
                <Button size="small" type="primary" loading={btnLoading} onClick={handleSaveOrUpdate}>
                  {isEdit ? 'Update Attribute' : 'Save Attribute'}
                </Button>
                <Button size="small" type="default" onClick={showAddAttributesModal} disabled={isNewValueBtnDisabled}>
                  New Value
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-2">
              <div className="overflow-x-auto border rounded-lg border-light-border">
                {filteredData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-sm text-secondary-font">No data found.</div>
                ) : (
                  <div className="min-w-max flex space-x-2 px-2 py-1">
                    {chunkedData.map((chunk, chunkIndex) => (
                      <div key={chunkIndex} className="flex flex-col space-y-2 w-[200px]">
                        {chunk.map((attr, index) => (
                          <div key={index} className="cursor-pointer text-secondary-font hover:text-primary-theme-hover p-0 m-0 text-xs">
                            <span onClick={() => handleEditAttribute(attr)}>{attr.attributeValue}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* <Table columns={valueColumns} dataSource={filteredData as AttributeValueModel[]} rowKey="key" size="small" bordered pagination={false} showSorterTooltip={false} /> */}
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
        width={1000}
        closable={false}
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
