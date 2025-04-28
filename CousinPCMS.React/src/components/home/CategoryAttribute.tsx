import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Form, Input, Checkbox, Button, Table, Spin} from 'antd';
import {getAllAttributes, getAttributeSetsByAttributeSetName, addAttributeSets, deleteAttributeSets, updateAttributeSets1} from '../../services/HomeService';
import {extractUserMessage, showNotification} from '../../services/DataService';
import {CloseCircleFilled, SearchOutlined} from '@ant-design/icons';
import type {AttributeModel, AttributeModelResponse, AttributeSetModel} from '../../models/attributeModel';
import {ApiResponse} from '../../models/generalModel';
import {useNotification} from '../../contexts.ts/NotificationProvider';

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
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<AttributeModel[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number>();

  const notify = useNotification();

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
        });
      }, 100);
      fetchAttributeSetsByAttributeSetName(encodeURIComponent(attributeSetName));
    }
  }, [categoryData]);

  // Fetch all attributes
  const fetchAllAttributes = useCallback(
    (attributeSets?: AttributeSetModel[]) => {
      setIsAttributeloading(true);
      getAllAttributes().then((response: AttributeModelResponse) => {
        if (response.isSuccess) {
          let filtered = response.value;
          const sets = attributeSets !== undefined ? attributeSets : lstAllAttributeSets;
          if (sets.length > 0) {
            const existingIds = sets.map((a) => a.attributeName);
            filtered = filtered.filter((a: any) => !existingIds.includes(a.attributeName));
          }
          console.log('Filtered attributes:', filtered); // Debug log
          setAttributeList(filtered);
          setFilteredData(filtered);
        } else {
          showNotification('error', 'Failed To Load Data');
        }
        setIsAttributeloading(false);
      });
    },
    [lstAllAttributeSets]
  );

  // Fetch attribute sets by name
  const fetchAttributeSetsByAttributeSetName = useCallback(
    (attributeSetName: string) => {
      setIsAttributeSetloading(true);
      getAttributeSetsByAttributeSetName(attributeSetName)
        .then((response: ApiResponse<AttributeSetModel[]>) => {
          if (response.isSuccess && Array.isArray(response.value)) {
            setLstAllAttributeSets(response.value);
            fetchAllAttributes(response.value); // Pass new data here
          } else {
            showNotification('error', 'Failed to load attribute sets');
            setLstAllAttributeSets([]);
            fetchAllAttributes([]);
          }
          setIsAttributeSetloading(false);
        })
        .catch((error) => {
          console.error('Error fetching attribute sets:', error); // Debug log
          setIsAttributeSetloading(false);
          setLstAllAttributeSets([]);
          fetchAllAttributes([]);
          showNotification('error', 'Failed to load attribute sets');
        });
    },
    [fetchAllAttributes]
  );

  // Add attribute data to form
  const addAttributeData = (data: AttributeModel) => {
    setCategoryAttriIsVisible(true);
    setIsEditable(false);
    if (!data || !data.attributeName) {
      showNotification('error', 'Attribute name is missing.');
      return;
    }
    const existingName = form.getFieldValue('attributeSetName')?.trim() || '';
    const categoryID = form.getFieldValue('categoryID') || '';
    const maxListOrder = lstAllAttributeSets.reduce((max, item) => Math.max(max, Number(item.listPosition) || 0), 0);
    const nextListPosition = maxListOrder + 1;
    form.setFieldsValue({
      attributeSetName: existingName,
      categoryID: categoryID,
      attributeName: data.attributeName.trim(),
      attributeRequired: true,
      notImportant: true,
      listPosition: nextListPosition,
    });
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
        addAttributeSets(values).then((response: ApiResponse<string>) => {
          if (response.isSuccess) {
            showNotification('success', 'Attribute added successfully');
            setCategoryAttriIsVisible(false);
            fetchAttributeSetsByAttributeSetName(values.attributeSetName);
            if (eventComplete) eventComplete('ok');
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
            // showNotification('error', 'Attribute not added successfully');
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
  const editAttributeSet = (row: AttributeSetModel, index: number) => {
    setCategoryAttriIsVisible(true);
    setCurrentRowIndex(index);
    setIsEditable(true);
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

  const updateAttributeSets = async () => {
    form
      .validateFields()
      .then((values) => {
        setIsEditable(true);
        const listPosition = Number(values.listPosition);

        const isListPositionDuplicate = lstAllAttributeSets.some((attribute, idx) => {
          return idx !== currentRowIndex && Number(attribute.listPosition) === listPosition;
        });

        if (isListPositionDuplicate) {
          // message.error('List position already exists, please choose another number');
          return;
        }

        updateAttributeSets1(values).then((response: ApiResponse<string>) => {
          if (response.isSuccess) {
            showNotification('success', 'Attribute added successfully');
            setCategoryAttriIsVisible(false);
            fetchAttributeSetsByAttributeSetName(values.attributeSetName);
            if (eventComplete) eventComplete('ok');
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
            // showNotification('error', 'Attribute not added successfully');
          }
        });
      })
      .catch(() => {
        // Validation error
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
      render: (_: any, record: AttributeSetModel, index: number) => (
        <span className="flex gap-x-1">
          <a onClick={() => editAttributeSet(record, index)}>
            <span className="text-primary-theme"> Edit </span>
          </a>
          <a onClick={() => handleDeleteAttributeSet(record)}>
            <span className="text-danger"> Unlink </span>
          </a>
        </span>
      ),
    },
  ];

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const searchText = value?.toLowerCase().replace(/\s/g, '') || '';
    if (!searchText) {
      setFilteredData([...attributeList]);
      return;
    }
    const filtered = attributeList.filter((item) => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';
      return normalize(item.attributeName).includes(searchText);
    });
    setFilteredData(filtered);
  };

  const clearSearchText = () => {
    setSearchValue('');
    setFilteredData([...attributeList]);
  };

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
              <Form.Item label="Attribute Set Name" name="attributeSetName" rules={[{required: true, message: 'Required'}]}>
                <Input disabled className="w-full" />
              </Form.Item>
              <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true, message: 'Attribute name is required'}]}>
                <Input readOnly className="w-full" />
              </Form.Item>
              <div className="flex gap-2 items-center">
                <Form.Item name="attributeRequired" valuePropName="checked" noStyle>
                  <Checkbox>Attribute Required</Checkbox>
                </Form.Item>
                <Form.Item name="notImportant" valuePropName="checked" noStyle>
                  <Checkbox>Not Important</Checkbox>
                </Form.Item>
              </div>
              <Form.Item label="List Position" name="listPosition">
                <Input type="number" className="w-full" />
              </Form.Item>
            </div>
            <div className="flex justify-end px-3 mt-2">
              {isEditable ? (
                <Button type="primary" onClick={updateAttributeSets} className="text-white">
                  Update
                </Button>
              ) : (
                <Button type="primary" onClick={saveAttributeSets} className="text-white">
                  Save
                </Button>
              )}
            </div>
          </Form>
        </Spin>
      </Modal>
      {/* Attribute Grid */}
      <div className="grid grid-cols-6 gap-4 py-2">
        <div className="col-span-6 sm:col-span-4">
          <Table columns={columns} dataSource={lstAllAttributeSets} rowKey="attributeName" bordered size="small" loading={isAttributeSetloading} pagination={false} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <Spin spinning={isAttributeloading}>
            <div className="h-70 overflow-y-scroll border border-gray-200 rounded-md bg-white">
              <div className="text-sm font-medium text-center text-primary-font sticky top-0 bg-white z-10 border-b border-gray-200">Attribute Details</div>
              <div className="w-64 flex items-center">
                <Input
                  placeholder="Search"
                  value={searchValue}
                  onChange={onSearch}
                  suffix={searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />}
                />
              </div>
              {filteredData.length > 0 ? (
                <div>
                  {filteredData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center px-4 py-2 cursor-pointer text-secondary-font border-b border-gray-100">
                      <span>{item.attributeName}</span>
                      <a onClick={() => addAttributeData(item)} className="text-primary-theme">
                        Link
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center">
                  <span className="text-sm">No attributes found</span>
                </div>
              )}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default CategoryAttribute;
