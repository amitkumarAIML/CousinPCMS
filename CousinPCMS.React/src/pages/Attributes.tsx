import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useNavigate, Link} from 'react-router'; // Import Link for declarative navigation
import {
  Table,
  Button,
  Input,
  Checkbox,
  Popconfirm,
  Form, // Use Form for layout consistency
  Spin,
} from 'antd';
import {SearchOutlined, CloseCircleFilled, EditOutlined, DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';

// --- Import Services and Types ---
import { getAttributesList, deleteAttributes } from '../services/AttributesService';
import { showNotification } from '../services/DataService';
import type { AttributeModel } from '../models/attributeModel';

// Add a unique key to the model if not present in API response
interface AttributeItem extends AttributeModel {
  key: string;
}

const Attributes: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [attributeList, setAttributeList] = useState<AttributeItem[]>([]); // Master list with keys
  const navigate = useNavigate();

  // --- Data Fetching ---
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
  }, []); // useCallback dependencies if needed (e.g., if service changes)

  useEffect(() => {
    sessionStorage.removeItem('attributeName');
    fetchAllAttributes();
  }, [fetchAllAttributes]); // Add fetchAllAttributes to dependencies

  // --- Filtering Logic (using useMemo) ---
  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return attributeList;
    }
    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';
    return attributeList.filter(
      (item: AttributeModel) =>
        normalize(item.attributeName).includes(normalizedSearch) ||
        normalize(item.attributeDescription).includes(normalizedSearch) ||
        normalize(item.searchType).includes(normalizedSearch)
    );
  }, [searchValue, attributeList]); // Recalculate when search or master list changes

  // --- Event Handlers ---
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

  const handleDeleteAttribute = async (record: AttributeItem) => {
    setLoading(true);
    try {
      const response = await deleteAttributes(record.attributeName);
      if (response.isSuccess) {
        showNotification('success', 'Attribute Successfully Deleted');
        setAttributeList((prevList) => prevList.filter((item) => item.key !== record.key));
      } else {
        showNotification('error', response.exceptionInformation || 'Failed To Delete Attribute');
      }
    } catch (err) {
      console.error('Error deleting attribute:', err);
      showNotification('error', 'Something went wrong during deletion.');
    } finally {
      setLoading(false);
    }
  };

  // --- Table Column Definition ---
  const columns: TableProps<AttributeItem>['columns'] = [
    {
      key: 'spacer',
      width: 60,
      render: () => null, // Empty column for alignment
    },
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
      width: 200, // Increased width to prevent text wrap
      align: 'center',
      render: (showAsCategory) => <Checkbox checked={showAsCategory} disabled />,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <span className="flex justify-center items-center gap-x-3">
          {' '}
          {/* Centered actions */}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditAttribute(record)}
            size="small"
            style={{padding: '0 5px', color: '#1890ff'}}
            aria-label={`Edit ${record.attributeName}`}
          />
          <Popconfirm title="Delete this attribute?" onConfirm={() => handleDeleteAttribute(record)} okText="Yes" cancelText="No" icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
            <Button
              type="text" // Use text button for icon-only danger action
              icon={<DeleteOutlined />}
              danger
              size="small"
              style={{padding: '0 5px'}}
              aria-label={`Delete ${record.attributeName}`}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md m-5">
      {' '}
      {/* Added shadow */}
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-y-4 p-4 pb-1">
        {/* Left section: Label + Search */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-medium text-gray-700 mr-3">Attribute List</span> {/* Adjusted styling */}
          <Form layout="inline" className="flex-grow max-w-xs">
            {' '}
            {/* Use inline form for better alignment */}
            <Form.Item className="mb-0 flex-grow">
              {' '}
              {/* Allow item to grow */}
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
              />
            </Form.Item>
          </Form>
        </div>

        {/* Right section: Buttons */}
        <div className="flex justify-start md:justify-end gap-x-3">
          <Button onClick={() => navigate('/home')}>Cancel</Button>
          {/* Use Link for declarative navigation */}
          <Link to="/attributes/add">
            <Button type="primary">Add</Button>
          </Link>
        </div>
      </div>
      <hr className="mt-2 mb-0 border-gray-200" /> {/* Adjusted margin and color */}
      {/* Table Section */}
      <div className="p-4">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="key" // Use the generated unique key
            size="small"
            bordered
            pagination={false} // Matches nzShowPagination="false"
            scroll={{y: 600}} // Adjust scroll height as needed
            className="attributes-list-table"
          />
        </Spin>
      </div>
    </div>
  );
};

export default Attributes;
