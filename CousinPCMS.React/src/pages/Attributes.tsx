import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigate, Link} from 'react-router';
import {Table, Button, Input, Checkbox, Form, Spin} from 'antd';
import {SearchOutlined, CloseCircleFilled, EditOutlined} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';
import {getAttributesList} from '../services/AttributesService';
import {showNotification} from '../services/DataService';
import type {AttributeModel} from '../models/attributeModel';

interface AttributeItem extends AttributeModel {
  key: string;
}

const Attributes: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [attributeList, setAttributeList] = useState<AttributeItem[]>([]);
  const navigate = useNavigate();

  const fetchAllAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAttributesList();
      if (response.isSuccess && response.value) {
        const dataWithKeys = response.value.map((item: AttributeModel) => ({
          ...item,
          key: item.attributeName,
        }));
        setAttributeList(dataWithKeys);
      } else {
        showNotification('error', response.exceptionInformation || 'Failed to load attributes.');
        setAttributeList([]);
      }
    } catch (error) {
      console.error('Error fetching attributes list:', error);
      showNotification('error', 'Something went wrong loading attributes.');
      setAttributeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem('attributeName');
    fetchAllAttributes();
  }, [fetchAllAttributes]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return attributeList;
    }
    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';
    return attributeList.filter(
      (item: AttributeModel) =>
        normalize(item.attributeName).includes(normalizedSearch) || normalize(item.attributeDescription).includes(normalizedSearch) || normalize(item.searchType).includes(normalizedSearch)
    );
  }, [searchValue, attributeList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  const handleEditAttribute = (record: AttributeItem) => {
    sessionStorage.setItem('attributeName', record.attributeName);
    navigate('/attributes/edit');
  };

  const columns: TableProps<AttributeItem>['columns'] = [
    {
      title: 'AttributeName',
      dataIndex: 'attributeName',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Attribute Description',
      dataIndex: 'attributeDescription',
      ellipsis: true,
    },
    {
      title: 'Search Type',
      dataIndex: 'searchType',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Show As Category',
      dataIndex: 'showAsCategory',
      width: 200,
      align: 'center',
      render: (showAsCategory) => <Checkbox checked={showAsCategory} disabled />,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEditAttribute(record)} size="small" style={{padding: '0 5px', color: '#1890ff'}} aria-label={`Edit ${record.attributeName}`} />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md m-5">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-y-4 p-4 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-medium text-gray-700 mr-3">Attribute List</span>
          <Form layout="inline" className="flex-grow max-w-xs">
            <Form.Item className="mb-0 flex-grow">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex justify-start md:justify-end gap-x-3">
          <Button onClick={() => navigate('/home')}>Cancel</Button>
          <Link to="/attributes/add">
            <Button type="primary">Add</Button>
          </Link>
        </div>
      </div>
      <hr className="mt-2 mb-0 border-gray-200" />
      <div className="p-4">
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredData} rowKey="key" size="small" bordered pagination={false} className="attributes-list-table" />
        </Spin>
      </div>
    </div>
  );
};

export default Attributes;
