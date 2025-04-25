import React, {useState, useEffect, useMemo} from 'react';
import {Input, Table, Checkbox, Spin, Form} from 'antd'; // Added Form for layout
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';

// --- Import Services and Types ---
import { getSkuLinkedAttributes } from '../../services/SkusService';
import { showNotification } from '../../services/DataService';
import type { ApiResponse } from '../../models/generalModel';
import type { LikedSkuModel } from '../../models/skusModel';

// --- Component Props ---
interface AttributeSkuProps {
  // Expecting the parent SKU data containing the item ID
  skuData: {
    akiitemid: number | string | null | undefined; // The key identifier needed
    // Include other fields only if necessary for this component
  } | null;
}

// Add a unique key to the model if not present in API response
interface LinkedAttributeItem extends LikedSkuModel {
  key: string; // Composite key for React list rendering
}

const AttributeSKU: React.FC<AttributeSkuProps> = ({skuData}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [linkedAttributeList, setLinkedAttributeList] = useState<LinkedAttributeItem[]>([]); // Master list with keys

  // --- Effects ---

  // Effect to fetch data when skuData (specifically akiitemid) changes
  const getSkuLinkedAttributesHandler = async (itemId: number | string) => {
    setLoading(true);
    setLinkedAttributeList([]); // Clear previous results
    try {
      const response: ApiResponse<LikedSkuModel[]> = await getSkuLinkedAttributes(String(itemId));
      if (response.isSuccess && response.value) {
        // Add a unique key to each item for the table
        const dataWithKeys = response.value.map((item, index) => ({
          ...item,
          key: `${item.akiAttributeName}-${item.akiAttributeValue}-${index}`,
        }));
        setLinkedAttributeList(dataWithKeys);
      } else {
        showNotification('info', response.exceptionInformation || 'No linked attributes found.');
      }
    } catch {
      showNotification('error', 'Failed to load linked attributes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const itemNumber = skuData?.akiitemid;
    if (itemNumber) {
      getSkuLinkedAttributesHandler(itemNumber);
    }
  }, [skuData]); // Dependency: skuData

  // --- Filtering Logic (using useMemo) ---
  const filteredAttributeList = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return linkedAttributeList; // Return full list if search is empty
    }

    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';

    return linkedAttributeList.filter((item) => normalize(item.akiAttributeName).includes(normalizedSearch) || normalize(item.akiAttributeValue).includes(normalizedSearch));
  }, [searchValue, linkedAttributeList]); // Recalculate when search or master list changes

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  // --- Table Column Definition ---
  const columns: TableProps<LinkedAttributeItem>['columns'] = [
    {
      key: 'spacer', // Empty column for alignment?
      width: 80,
      render: () => null, // Render nothing, just takes up space
    },
    {
      title: 'Attribute Name',
      dataIndex: 'akiAttributeName',
      ellipsis: true,
    },
    {
      title: 'Attribute Value',
      dataIndex: 'akiAttributeValue',
      ellipsis: true,
    },
    {
      title: 'Link',
      dataIndex: 'akiLink',
      width: 100,
      align: 'center',
      render: (isLinked) => <Checkbox checked={isLinked} disabled />,
    },
  ];

  return (
    <div className="px-4 pt-1">
      {' '}
      {/* Match parent padding */}
      {/* Search Bar */}
      <Form layout="vertical" className="mb-4">
        {' '}
        {/* Added margin-bottom */}
        <div className="grid grid-cols-1 md:grid-cols-5">
          {' '}
          {/* Keep grid layout */}
          <Form.Item label="Search" className="md:col-span-2 mb-0">
            {' '}
            {/* Adjust span */}
            <Input
              placeholder="Search by name or value..."
              value={searchValue}
              onChange={handleSearchChange}
              suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
            />
          </Form.Item>
        </div>
      </Form>
      {/* Linked Attributes Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredAttributeList}
          rowKey="key" // Use the generated unique key
          size="small"
          bordered
          pagination={false} // Matches nzShowPagination="false"
          scroll={{y: 600}} // Adjust scroll height as needed
          className="linked-attributes-table" // Add specific class if needed
        />
      </Spin>
    </div>
  );
};

export default AttributeSKU;
