import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Table,
  Modal,
  Spin,
  Popconfirm
} from 'antd';
import { SearchOutlined, CloseCircleFilled, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { addAttributes, updateAttributes, deleteAttributesValues, getAttributeValuesByAttributesName } from '../../services/AttributesService';
import type { TableProps } from 'antd';
import type { AttributeRequestModel, AttributeValueModel } from '../../models/attributesModel';
// import notification utility if needed, or use Antd notification directly
import { notification } from 'antd';
import AttributeValuesPopup from './AttributeValuesPopup';

// Interface for form values
interface AttributeDetailsFormData extends Omit<AttributeRequestModel, 'showAsCategory'> {
  showAsCategory?: boolean;
}

// Fix AttributeValueItem type to match AttributeValueModel
interface AttributeValueItem extends AttributeValueModel {
  key: string;
  id?: number;
}

const AttributesDetails: React.FC = () => {
  const [form] = Form.useForm<AttributeDetailsFormData>();
  const navigate = useNavigate();

  // --- State Variables ---
  const [btnLoading, setBtnLoading] = useState<boolean>(false); // Save/Update button loading
  const [tableLoading, setTableLoading] = useState<boolean>(false); // Table loading specifically
  const [searchValue, setSearchValue] = useState<string>(''); // Search for values table
  const [attributesValues, setAttributesValues] = useState<AttributeValueItem[]>([]); // Master list of values
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [attributeName, setAttributeName] = useState<string>('');
  const [isAttributeNameDisabled, setIsAttributeNameDisabled] = useState<boolean>(false);
  const [isValueModalVisible, setIsValueModalVisible] = useState<boolean>(false);
  const [isNewValueBtnDisabled, setIsNewValueBtnDisabled] = useState<boolean>(true);
  // State to hold data for the value being edited in the modal
  const [valueDataForModal, setValueDataForModal] = useState<AttributeValueModel | null>(null);

  // --- Effects ---

  const fetchAttributeValues = useCallback(async (name: string) => {
    if (!name) {
      setAttributesValues([]);
      return;
    }
    setTableLoading(true);
    try {
      const response = await getAttributeValuesByAttributesName(name);
      if (response.isSuccess && response.value) {
        const dataWithKeysAndId = response.value.map((item: AttributeValueModel, index: number) => ({
          ...item,
          id: index,
          key: `${item.attributeName}-${item.attributeValue}-${index}`,
        }));
        setAttributesValues(dataWithKeysAndId);
      } else {
        setAttributesValues([]);
      }
    } catch {
      setAttributesValues([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  // --- Filtering ---
  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) return attributesValues;
    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';
    return attributesValues.filter((item) => normalize((item as AttributeValueModel).attributeName).includes(normalizedSearch) || normalize((item as AttributeValueModel).attributeValue).includes(normalizedSearch));
  }, [searchValue, attributesValues]);

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const clearSearchText = () => setSearchValue('');

  const handleCancel = () => {
    setIsEdit(false); // Reset edit state if needed
    sessionStorage.removeItem('attributeName');
    navigate('/attributes');
  };

  const showAddValueModal = () => {
    setValueDataForModal(null); // Ensure it's an "Add" modal
    setIsValueModalVisible(true);
  };

  const showEditValueModal = (record: AttributeValueItem) => {
    setValueDataForModal(record); // Pass existing data for editing
    setIsValueModalVisible(true);
  };

  const handleValueModalClose = (reason: 'save' | 'cancel') => {
    setIsValueModalVisible(false);
    setValueDataForModal(null); // Clear edit data
    if (reason === 'save' && attributeName) {
      fetchAttributeValues(attributeName); // Refetch values after save/update
    }
  };

  const handleSaveOrUpdateAttribute = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      // Use state for name in edit mode, form value in add mode
      const currentAttributeName = isEdit ? attributeName : values.attributeName;
      if (!currentAttributeName) {
        throw new Error('Attribute Name is missing.'); // Should be caught by validation anyway
      }

      const payload: AttributeRequestModel = {
        ...values,
        attributeName: currentAttributeName,
        showAsCategory: !!values.showAsCategory,
      };
      // const cleanedPayload = dataService.cleanEmptyNullToString(payload); // Apply cleaning if needed

      const response = isEdit ? await updateAttributes(payload) : await addAttributes(payload);

      if (response.isSuccess) {
        notification.success({ message: '', description: `Attribute ${isEdit ? 'updated' : 'added'} successfully.` });
        if (!isEdit) {
          setIsEdit(true);
          setAttributeName(currentAttributeName);
          setIsAttributeNameDisabled(true);
          setIsNewValueBtnDisabled(false);
          sessionStorage.setItem('attributeName', currentAttributeName);
          // No need to refetch values yet as none exist for a new attribute
          setAttributesValues([]); // Ensure values list is empty
          notification.info({ message: '', description: 'You can now add values.' });
        } else {
          // Optionally refetch details if update might change something displayed
          // fetchAttributeDetails(currentAttributeName);
        }
      } else {
        const message =
          response.value
            ?.split('.')[0]
            ?.replace(/^Attribute:\s*/i, '')
            .trim() ||
          response.exceptionInformation ||
          `Failed to ${isEdit ? 'update' : 'add'} attribute.`;
        notification.error({ message: '', description: message });
      }
    } catch (errorInfo) {
      if (errorInfo && typeof errorInfo === 'object' && 'errorFields' in errorInfo) {
        notification.error({ message: 'Validation Error', description: 'Please fill in all required fields.' });
      } else {
        notification.error({ message: 'Error', description: 'An unexpected error occurred.' });
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // Fix handleDeleteAttributeValue property access
  const handleDeleteAttributeValue = async (record: AttributeValueItem) => {
    setTableLoading(true);
    try {
      const response = await deleteAttributesValues(record.attributeName, record.attributeValue);
      if (response.isSuccess) {
        setAttributesValues((prev) => prev.filter((item) => item.key !== record.key));
        notification.success({ message: '', description: 'Attribute Value Successfully Deleted' });
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'error' in (err as Record<string, unknown>) && (err as { error?: { title?: string } }).error?.title) {
        notification.error({ message: '', description: (err as { error?: { title?: string } }).error?.title || '' });
      } else {
        notification.error({ message: 'Error', description: 'Something went wrong during deletion.' });
      }
    } finally {
      setTableLoading(false);
    }
  };

  // --- Table Columns ---
  const valueColumns: TableProps<AttributeValueItem>["columns"] = [
    { key: 'spacer', width: 50, render: () => null },
    { title: 'Attribute Name', dataIndex: 'attributeName', ellipsis: true },
    { title: 'Attribute Value', dataIndex: 'attributeValue', ellipsis: true },
    { title: 'New Alternate Value', dataIndex: 'newAlternateValue', ellipsis: true },
    { title: 'Alternate Values', dataIndex: 'alternateValues', ellipsis: true },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_: unknown, record: AttributeValueItem) => (
        <span className="flex justify-center items-center gap-x-3">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditValueModal(record)}
            size="small"
            style={{ padding: '0 5px' }}
            aria-label={`Edit value ${record.attributeValue}`}
          />
          <Popconfirm title="Delete this attribute value?" onConfirm={() => handleDeleteAttributeValue(record)} okText="Yes" cancelText="No" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
            <Button type="text" icon={<DeleteOutlined />} danger size="small" style={{ padding: '0 5px' }} aria-label={`Delete value ${record.attributeValue}`} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  // --- Character Count Logic ---
  const charCount = (fieldName: keyof AttributeDetailsFormData, limit: number) => {
    const value = form.getFieldValue(fieldName) || '';
    return limit - value.length;
  };

  // Add loading state for <Spin spinning={loading}>
  const [loading] = useState<boolean>(false);

  return (
    <div className="main-container">
      <Spin spinning={loading}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-lg font-medium text-gray-700">Attribute Form</span>
          <div className="flex gap-x-3">
            <Button onClick={handleCancel}>Close</Button>
          </div>
        </div>
        <hr className="mt-2 mb-2 border-gray-200" />
        {/* Form and Table Area */}
        <div className="p-4">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-0">
              {/* Left Form Section */}
              <div className="lg:col-span-5 md:col-span-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
                  <Form.Item label="Search Type" name="searchType" rules={[{required: true, message: 'Required'}]} className="mb-3">
                    <Select
                      placeholder="Select type"
                      allowClear
                      showSearch
                      options={searchType.map((st: {code: string; description: string}) => ({value: st.description, label: st.description, key: st.code}))}
                    />
                  </Form.Item>
                  <div className="md:col-start-3 flex items-center justify-start md:justify-center h-full pb-3">
                    <Form.Item name="showAsCategory" valuePropName="checked" noStyle>
                      <Checkbox>Show as category</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Required'}]} className="mb-3">
                  <div className="relative">
                    <Input maxLength={50} disabled={isAttributeNameDisabled} />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charCount('attributeName', 50)}</span>
                  </div>
                </Form.Item>

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
          {/* Attribute Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
            <div className="lg:col-span-5 md:col-span-12">
              {' '}
              {/* Matches col-span above */}
              {/* Search and Buttons Row */}
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
                  <Button type="primary" loading={btnLoading} onClick={handleSaveOrUpdateAttribute}>
                    {isEdit ? 'Update Attribute' : 'Save Attribute'}
                  </Button>
                  <Button type="default" onClick={showAddValueModal} disabled={isNewValueBtnDisabled}>
                    New Value
                  </Button>
                </div>
              </div>
              {/* Values Table */}
              <Spin spinning={tableLoading}>
                <div className="grid grid-cols-1 mt-2">
                  <Table columns={valueColumns} dataSource={filteredData} rowKey="key" size="small" bordered pagination={false} scroll={{y: 400}} />
                </div>
              </Spin>
            </div>
          </div>
        </div>{' '}
        {/* End p-4 container */}
      </Spin>

      {/* Modal for Adding/Editing New Value */}
      <Modal
        title={valueDataForModal ? `Edit Attribute Value: ${valueDataForModal.attributeValue}` : 'Add New Attribute Value'}
        open={isValueModalVisible}
        onCancel={() => handleValueModalClose('cancel')}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={500}
      >
        {attributeName && <AttributeValuesPopup attributeName={attributeName} onClose={handleValueModalClose} />}
      </Modal>
    </div>
  );
};

export default AttributesDetails;
