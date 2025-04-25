import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Form, Input, Checkbox, Button, Table, Spin} from 'antd';
import {getAllAttributes, getAttributeSetsByAttributeSetName, addAttributeSets, deleteAttributeSets} from '../../services/HomeService';
import {showNotification} from '../../services/DataService';
import {EditOutlined, LinkOutlined} from '@ant-design/icons';
import type {AttributeModel, AttributeModelResponse, AttributeSetModel} from '../../models/attributeModel';

interface CategoryAttributeProps {
  categoryData: any;
  eventComplete?: (event: any) => void;
}

const CategoryAttribute: React.FC<CategoryAttributeProps> = ({categoryData, eventComplete}) => {
  const [form] = Form.useForm();
  const [attributeList, setAttributeList] = useState<AttributeModel[]>([]);
  const [lstAllAttributeSets, setLstAllAttributeSets] = useState<AttributeSetModel[]>([]);
  const [isAttributeloading, setIsAttributeloading] = useState(false);
  const [isAttributeSetloading, setIsAttributeSetloading] = useState(false);
  const [categoryAttriIsVisible, setCategoryAttriIsVisible] = useState(false);
  const [currentAttributeSetName, setCurrentAttributeSetName] = useState('');

  // Fetch attribute sets and attributes when categoryData changes
  useEffect(() => {
    if (categoryData) {
      let attributeSetName = '';
      let categoryID = '';
      if (categoryData.origin) {
        attributeSetName = `Attribute Set For - ${categoryData.origin.title}`;
        categoryID = categoryData.origin.key;
      } else {
        attributeSetName = categoryData.attributeSetName || '';
        categoryID = categoryData.akiCategoryID || '';
      }
      setCurrentAttributeSetName(attributeSetName);
      form.resetFields();
      setTimeout(() => {
        form.setFieldsValue({
          attributeSetName,
          categoryID,
          attributeName: categoryData.attributeName || '',
          attributeRequired: categoryData.attributeRequired ?? true,
          notImportant: categoryData.notImportant ?? true,
          listPosition: categoryData.listPosition || 1,
        });
      }, 100);
      // Always encode attributeSetName for API call
      fetchAttributeSetsByAttributeSetName(encodeURIComponent(attributeSetName));
    }
  }, [categoryData]);

  // Fetch all attributes
  const fetchAllAttributes = useCallback(() => {
    setIsAttributeloading(true);
    getAllAttributes().then((response: AttributeModelResponse) => {
      if (response.isSuccess) {
        let filtered = response.value;
        setAttributeList(filtered);
        console.log('Filtered attributes1111111111:', filtered, lstAllAttributeSets); // Debug log
        if (lstAllAttributeSets.length > 0) {
          const existingIds = lstAllAttributeSets.map((a) => a.attributeName);
          filtered = filtered.filter((a: any) => !existingIds.includes(a.attributeName));
          console.log('Filtered attributes:', filtered); // Debug log
          setAttributeList(filtered);
        }
      } else {
        showNotification('error', 'Failed To Load Data');
      }
      setIsAttributeloading(false);
    });
  }, []);

  // Fetch attribute sets by name
  const fetchAttributeSetsByAttributeSetName = (attributeSetName: string) => {
    setIsAttributeSetloading(true);
    getAttributeSetsByAttributeSetName(attributeSetName)
      .then((response: any) => {
        console.log('API response for attribute sets:', response); // Debug log
        if (response.isSuccess && Array.isArray(response.value)) {
          setLstAllAttributeSets(response.value);
          setIsAttributeSetloading(false);
          fetchAllAttributes();
        } else {
          showNotification('error', 'Failed to load attribute sets');
          setLstAllAttributeSets([]); // Ensure state is cleared if not successful
          setIsAttributeSetloading(false);
        }
      })
      .catch(() => {
        setIsAttributeSetloading(false);
        setLstAllAttributeSets([]);
        showNotification('error', 'Failed to load attribute sets');
      });
  };

  // Add attribute data to form
  const addAttributeData = (data: AttributeSetModel) => {
    setCategoryAttriIsVisible(true);
    const existingName = form.getFieldValue('attributeSetName') || '';
    const maxListOrder = lstAllAttributeSets.length > 0 ? Math.max(...lstAllAttributeSets.map((a) => Number(a.listPosition) || 0)) : 0;
    const nextListPosition = maxListOrder + 1;
    if (!data || !data.attributeName) {
      showNotification('error', 'Attribute name is missing.');
      return;
    }
    console.log('Adding attribute data:', data); // Debug log
    setTimeout(() => {
      form.setFieldsValue({
        attributeSetName: existingName.trim(),
        categoryID: form.getFieldValue('categoryID'),
        attributeName: data.attributeName.trim(),
        attributeRequired: true,
        notImportant: true,
        listPosition: nextListPosition,
      });
    }, 100);
  };

  // Delete attribute set
  const handleDeleteAttributeSet = (item: AttributeSetModel) => {
    deleteAttributeSets(item.attributeName, item.attributeSetName).then((response: any) => {
      if (response.isSuccess) {
        showNotification('success', 'AttributeSets deleted successfully');
        fetchAttributeSetsByAttributeSetName(currentAttributeSetName);
      } else {
        showNotification('error', 'AttributeSets not deleted successfully');
      }
    });
  };

  // Save attribute set
  const saveAttributeSets = () => {
    form
      .validateFields()
      .then((values) => {
        addAttributeSets(values).then((response: any) => {
          if (response.isSuccess) {
            showNotification('success', 'Attribute added successfully');
            setCategoryAttriIsVisible(false);
            fetchAttributeSetsByAttributeSetName(values.attributeSetName);
            if (eventComplete) eventComplete('ok');
          } else {
            showNotification('error', 'Attribute not added successfully');
          }
        });
      })
      .catch(() => {
        // Validation error
      });
  };

  // Cancel modal
  const handleCancel = () => {
    setCategoryAttriIsVisible(false);
    if (eventComplete) eventComplete('cancel');
  };

  // Edit attribute set
  const editAttributeSet = (row: AttributeSetModel) => {
    setCategoryAttriIsVisible(true);
    const existingName = form.getFieldValue('attributeSetName') || '';
    const maxListOrder = lstAllAttributeSets.length > 0 ? Math.max(...lstAllAttributeSets.map((a) => Number(a.listPosition) || 0)) : 0;
    const nextListPosition = maxListOrder + 1;
    if (!row || !row.attributeName) {
      showNotification('error', 'Attribute name is missing.');
      return;
    }
    form.setFieldsValue({
      attributeSetName: existingName.trim(),
      categoryID: form.getFieldValue('categoryID'),
      attributeName: row.attributeName.trim(),
      attributeRequired: true,
      notImportant: true,
      listPosition: nextListPosition,
    });
  };

  // Table columns
  const columns = [
    {title: 'Attribute Name', dataIndex: 'attributeName', width: 200},
    {title: 'Required', dataIndex: 'attributeRequired', width: 40, render: (val: boolean) => <Checkbox checked={val} disabled />},
    {title: 'Not Important', dataIndex: 'notImportant', width: 50, render: (val: boolean) => <Checkbox checked={val} disabled />},
    {title: 'List Position', dataIndex: 'listPosition', width: 50},
    {
      title: 'Action',
      dataIndex: 'action',
      width: 35,
      render: (_: any, record: AttributeSetModel) => (
        <span className="flex gap-x-1">
          <a onClick={() => editAttributeSet(record)}>
            <Button icon={<EditOutlined />} type="text" className="text-primary-theme w-5 h-4" />
          </a>
          <a onClick={() => handleDeleteAttributeSet(record)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 15L15 9" stroke="#FF4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M11 6.00006L11.463 5.46406C12.4008 4.52639 13.6727 3.99966 14.9989 3.99976C16.325 3.99985 17.5968 4.52676 18.5345 5.46456C19.4722 6.40237 19.9989 7.67425 19.9988 9.00042C19.9987 10.3266 19.4718 11.5984 18.534 12.5361L18 13.0001"
                stroke="#FF4E4E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11"
                stroke="#FF4E4E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M4 4L20 20" stroke="#FF4E4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </span>
      ),
    },
  ];

  return (
    <div className="p-1">
      {/* Attribute Set Form */}
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-12 gap-4 py-2">
          <div className="col-span-12 sm:col-span-5">
            <Form.Item label="Attribute Set Name" name="attributeSetName" rules={[{required: true, message: 'Required'}]}>
              <Input disabled value={form.getFieldValue('attributeSetName') || ''} />
            </Form.Item>
          </div>
          <div className="col-span-12 sm:col-span-3">
            <Form.Item label="Category Id" name="categoryID" rules={[{required: true, message: 'Required'}]}>
              <Input disabled value={form.getFieldValue('categoryID') || ''} />
            </Form.Item>
          </div>
        </div>
      </Form>
      {/* Attribute Set Modal */}
      <Modal open={categoryAttriIsVisible} title="Attribute Details" onCancel={handleCancel} footer={null} width={500} centered destroyOnClose>
        <Spin spinning={isAttributeSetloading}>
          <Form form={form} layout="vertical" className="p-2">
            <div className="grid grid-cols-1 gap-2 px-3 py-1">
              <Form.Item label="Attribute Set Name" name="attributeSetName" rules={[{required: true, message: 'Attribute set name is required'}]}>
                {' '}
                <Input disabled value={form.getFieldValue('attributeSetName') || ''} className="w-full" />{' '}
              </Form.Item>
              <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute name is required'}]}>
                {' '}
                <Input readOnly className="w-full" />{' '}
              </Form.Item>
              <div className="flex gap-2 items-center">
                <Form.Item name="attributeRequired" valuePropName="checked" noStyle>
                  {' '}
                  <Checkbox>Attribute Required</Checkbox>{' '}
                </Form.Item>
                <Form.Item name="notImportant" valuePropName="checked" noStyle>
                  {' '}
                  <Checkbox>Not Important</Checkbox>{' '}
                </Form.Item>
              </div>
              <Form.Item label="List Position" name="listPosition">
                {' '}
                <Input type="number" className="w-full" />{' '}
              </Form.Item>
            </div>
            <div className="flex justify-end px-3 mt-2">
              <Button type="primary" onClick={saveAttributeSets} className="text-white">
                Save
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
      {/* Attribute Grid */}
      <div className="grid grid-cols-6 gap-4 py-2">
        <div className="col-span-6 sm:col-span-4">
          <Table columns={columns} dataSource={lstAllAttributeSets} rowKey="attributeName" bordered size="small" loading={isAttributeSetloading} scroll={{x: 600, y: 300}} pagination={false} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <Spin spinning={isAttributeloading}>
            {attributeList.length > 0 ? (
              <div className="h-70 overflow-y-scroll border border-gray-200 rounded-md bg-white">
                <div className="text-sm font-medium text-center text-primary-font sticky top-0 bg-white z-10 border-b border-gray-200">Attribute Details</div>
                {attributeList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-2 cursor-pointer text-secondary-font border-b border-gray-100">
                    <span>{item.attributeName}</span>
                    <a onClick={() => addAttributeData(item)} className="text-primary-theme">
                      <LinkOutlined className="text-primary-theme w-5 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-70 border border-gray-200 rounded-md bg-white text-gray-500 flex flex-col">
                <div className="text-sm font-medium text-center py-2 border-b border-gray-200 text-primary-font">Attribute Details</div>
                <div className="flex-grow flex items-center justify-center">
                  <span className="text-sm">No attributes found</span>
                </div>
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default CategoryAttribute;
