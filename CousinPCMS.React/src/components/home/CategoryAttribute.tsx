import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Form, Input, Checkbox, Button, Table, Spin, List} from 'antd';
import {getAllAttributes, getAttributeSetsByAttributeSetName, addAttributeSets, deleteAttributeSets, updateAttributeSets1} from '../../services/HomeService';
import {extractUserMessage} from '../../services/DataService';
import {useNotification} from '../../contexts.ts/useNotification';
import {CloseCircleFilled, SearchOutlined} from '@ant-design/icons';
import type {AttributeModel, AttributeModelResponse, AttributeSetModel} from '../../models/attributeModel';
import {ApiResponse} from '../../models/generalModel';

interface CategoryAttributeProps {
  categoryData: any;
  eventComplete?: (event: 'ok' | 'cancel') => void;
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

  useEffect(() => {
    if (categoryData) {
      let attributeSetName = '';
      let categoryID = '';
      if (categoryData.data) {
        attributeSetName = `Attribute Set For - ${categoryData.data.akiCategoryName}`;
        categoryID = categoryData.id;
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
          setAttributeList(filtered);
          setFilteredData(filtered);
        } else {
          notify.error('Failed To Load Data');
        }
        setIsAttributeloading(false);
      });
    },
    [lstAllAttributeSets, notify]
  );

  const fetchAttributeSetsByAttributeSetName = useCallback(
    (attributeSetName: string) => {
      setIsAttributeSetloading(true);
      getAttributeSetsByAttributeSetName(attributeSetName)
        .then((response: ApiResponse<AttributeSetModel[]>) => {
          if (response.isSuccess && Array.isArray(response.value)) {
            setLstAllAttributeSets(response.value);
            fetchAllAttributes(response.value);
          } else {
            notify.error('Failed to load attribute sets');
            setLstAllAttributeSets([]);
            fetchAllAttributes([]);
          }
          setIsAttributeSetloading(false);
        })
        .catch((error) => {
          console.error('Error fetching attribute sets:', error);
          setIsAttributeSetloading(false);
          setLstAllAttributeSets([]);
          fetchAllAttributes([]);
          notify.error('Failed to load attribute sets');
        });
    },
    [fetchAllAttributes, notify]
  );

  const addAttributeData = (data: AttributeModel) => {
    setCategoryAttriIsVisible(true);
    setIsEditable(false);
    if (!data || !data.attributeName) {
      notify.error('Attribute name is missing.');
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

  const handleDeleteAttributeSet = (item: AttributeSetModel) => {
    deleteAttributeSets(item.attributeName, item.attributeSetName).then((response: any) => {
      if (response.isSuccess) {
        notify.success('AttributeSets deleted successfully');
        fetchAttributeSetsByAttributeSetName(currentAttributeSetName);
      } else {
        notify.error('AttributeSets not deleted successfully');
      }
    });
  };

  const saveAttributeSets = () => {
    form
      .validateFields()
      .then((values) => {
        addAttributeSets(values).then((response: ApiResponse<string>) => {
          if (response.isSuccess) {
            notify.success('Attribute added successfully');
            setCategoryAttriIsVisible(false);
            fetchAttributeSetsByAttributeSetName(encodeURIComponent(values.attributeSetName));
            if (eventComplete) eventComplete('ok');
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
          }
        });
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setCategoryAttriIsVisible(false);
    if (eventComplete) eventComplete('cancel');
  };

  const editAttributeSet = (row: AttributeSetModel, index: number) => {
    setCategoryAttriIsVisible(true);
    setCurrentRowIndex(index);
    setIsEditable(true);
    const existingName = form.getFieldValue('attributeSetName') || '';
    const maxListOrder = lstAllAttributeSets.length > 0 ? Math.max(...lstAllAttributeSets.map((a) => Number(a.listPosition) || 0)) : 0;
    const nextListPosition = maxListOrder + 1;
    if (!row || !row.attributeName) {
      notify.error('Attribute name is missing.');
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
          return;
        }

        updateAttributeSets1(values).then((response: ApiResponse<string>) => {
          if (response.isSuccess) {
            notify.success('Attribute added successfully');
            setCategoryAttriIsVisible(false);
            fetchAttributeSetsByAttributeSetName(values.attributeSetName);
            if (eventComplete) eventComplete('ok');
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
          }
        });
      })
      .catch(() => {});
  };

  const columns = [
    {title: 'Attribute Name', dataIndex: 'attributeName', width: 200},
    {title: 'Required', dataIndex: 'attributeRequired', width: 40, render: (val: boolean) => <Checkbox checked={val} disabled />},
    {title: 'Not Important', dataIndex: 'notImportant', width: 50, render: (val: boolean) => <Checkbox checked={val} disabled />},
    {title: 'List Position', dataIndex: 'listPosition', width: 50},
    {
      title: 'Action',
      dataIndex: 'action',
      width: 35,
      render: (_: unknown, record: AttributeSetModel, index: number) => (
        <span className="flex gap-x-1 justify-around">
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
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <Form.Item label="Attribute Set Name" name="attributeSetName" rules={[{required: true, message: 'Required'}]}>
                <Input disabled value={form.getFieldValue('attributeSetName') || ''} />
              </Form.Item>
            </div>
            <div className="col-span-6">
              <Form.Item label="Category Id" name="categoryID" rules={[{required: true, message: 'Required'}]}>
                <Input disabled value={form.getFieldValue('categoryID') || ''} />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Table columns={columns} dataSource={lstAllAttributeSets} rowKey="attributeName" bordered size="small" loading={isAttributeSetloading} pagination={false} />
            </div>
          </div>
          <div className="col-span-4">
            <Spin spinning={isAttributeloading}>
              <div className=" border border-border rounded-md bg-white">
                <List
                  size="small"
                  header={
                    <div className="text-sm flex justify-between gap-2 px-2 font-medium text-primary-font sticky top-0 bg-white z-10 ">
                      Attribute Details
                      <Input
                        placeholder="Search"
                        value={searchValue}
                        onChange={onSearch}
                        className="w-40"
                        suffix={searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />}
                      />
                    </div>
                  }
                  dataSource={filteredData}
                  renderItem={(item) => (
                    <List.Item className="cursor-pointer text-secondary-font flex justify-between items-center px-4 py-2">
                      <span>{item.attributeName}</span>
                      <a onClick={() => addAttributeData(item)} className="text-primary-theme">
                        Link
                      </a>
                    </List.Item>
                  )}
                  locale={{
                    emptyText: (
                      <div className="flex-grow flex items-center justify-center h-40">
                        <span className="text-sm">No attributes found</span>
                      </div>
                    ),
                  }}
                />
              </div>
            </Spin>
          </div>
        </div>
      </Form>

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
    </div>
  );
};

export default CategoryAttribute;
