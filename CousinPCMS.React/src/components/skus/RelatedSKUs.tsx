import React, {useState, useEffect, useMemo} from 'react';
import {Input, Table, Checkbox, Spin, Form} from 'antd'; // Added Form for layout consistency
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';

// --- Import Services and Types ---
import { getRelatedSkuItem } from '../../services/SkusService';
import { showNotification } from '../../services/DataService';

// Define interface for the main SKU data prop
interface MainSkuData {
  skuName: string;
  akiSKUID: number | string;
  akiitemid: string; // Item Number used for fetching related
  // Add other fields if needed by this component (likely not)
}

// Define interface for the related SKU list items (adjust based on actual API response)
interface RelatedSkuItem {
  relatedItemNo: string;
  relationType: string;
  relatedSKUName: string;
  itemManufactureRef: string;
  itemNo: string; // Assuming this is the ITEM_NUMBER of the related SKU
  itemObsolte: boolean;
  itemIsUnavailable: boolean; // Maps to salesBlocked? Check API/model
  // Add a unique key if available, otherwise use relatedItemNo or itemNo
  key?: string | number;
}

// --- Component Props ---
interface RelatedSkuProps {
  skuData: MainSkuData | null; // Accept main SKU data from parent
}

const RelatedSKUs: React.FC<RelatedSkuProps> = ({skuData}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [relatedSkusList, setRelatedSkusList] = useState<RelatedSkuItem[]>([]); // Master list
  // Display state for top inputs (derived from props)
  const [displaySkuName, setDisplaySkuName] = useState<string>('');
  const [displaySkuId, setDisplaySkuId] = useState<number | string>('');

  // --- Effects ---

  // Effect to update display fields and fetch related SKUs when main skuData changes
  useEffect(() => {
    if (skuData) {
      setDisplaySkuName(skuData.skuName || '');
      setDisplaySkuId(skuData.akiSKUID || ''); // Use internal ID if available

      const itemNumber = skuData.akiitemid;
      if (itemNumber) {
        loadRelatedSku(itemNumber);
      } else {
        console.warn('Related SKUs: Main SKU Item Number is missing.');
        setRelatedSkusList([]); // Clear list if no item number
      }
    } else {
      // Clear everything if skuData is null
      setDisplaySkuName('');
      setDisplaySkuId('');
      setRelatedSkusList([]);
      setSearchValue('');
    }
  }, [skuData]); // Dependency array includes skuData

  // --- Data Fetching ---
  const loadRelatedSku = async (itemNumber: string) => {
    setLoading(true);
    setRelatedSkusList([]); // Clear previous results
    try {
      const response = await getRelatedSkuItem(itemNumber);
      if (response.isSuccess && response.value) {
        // Convert ItemModel[] to RelatedSkuItem[] by mapping fields if possible
        const dataWithKeys = (response.value as unknown as RelatedSkuItem[]).map((item: RelatedSkuItem) => ({
          ...item,
          key: item.itemNo || item.relatedItemNo, // Fallback key
        }));
        setRelatedSkusList(dataWithKeys);
      } else {
        showNotification('info', response.exceptionInformation || 'No related SKUs found.');
        setRelatedSkusList([]);
      }
    } catch {
      showNotification('error', 'Something went wrong loading related SKUs.');
      setRelatedSkusList([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering Logic (using useMemo for efficiency) ---
  const filteredSkusList = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return relatedSkusList; // Return full list if search is empty
    }

    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';

    return relatedSkusList.filter(
      (item) =>
        normalize(item.relatedItemNo).includes(normalizedSearch) ||
        normalize(item.relationType).includes(normalizedSearch) ||
        normalize(item.relatedSKUName).includes(normalizedSearch) ||
        normalize(item.itemManufactureRef).includes(normalizedSearch) ||
        normalize(item.itemNo).includes(normalizedSearch)
    );
  }, [searchValue, relatedSkusList]); // Recalculate only when search or master list changes

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  // --- Table Column Definition ---
  const columns: TableProps<RelatedSkuItem>['columns'] = [
    {title: 'Related', dataIndex: 'relatedItemNo', width: 200},
    {title: 'RelationType', dataIndex: 'relationType', ellipsis: true},
    {title: 'RelatedSkuName', dataIndex: 'relatedSKUName', ellipsis: true},
    {title: 'ManufacturerRef', dataIndex: 'itemManufactureRef', ellipsis: true},
    {title: 'ITEM_NUMBER', dataIndex: 'itemNo'}, // ITEM_NUMBER of the *related* item
    {
      title: 'Obsolete',
      dataIndex: 'itemObsolte',
      width: 90,
      align: 'center',
      render: (isObsolete) => <Checkbox checked={isObsolete} disabled />,
    },
    {
      title: 'Unavailable',
      dataIndex: 'itemIsUnavailable', // Assuming this maps correctly
      width: 100,
      align: 'center',
      render: (isUnavailable) => <Checkbox checked={isUnavailable} disabled />,
    },
  ];

  return (
    <div>
      
      {/* Match parent padding */}
      {/* Search and Display Area */}
      {/* Using Antd Form components for consistent layout/styling */}
      <Form layout="vertical" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-3 items-end">
          <Form.Item label="Search" className="md:col-span-2 mb-0">
            
            {/* Adjust span */}
            <Input
              placeholder="Search related SKUs..."
              value={searchValue}
              onChange={handleSearchChange}
              suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
            />
          </Form.Item>
          {/* Spacer column if needed */}
          {/* <div className="hidden md:block md:col-span-1"></div> */}
          <Form.Item label="Sku Name" className="md:col-span-2 mb-0">
            
            {/* Adjust span */}
            <Input value={displaySkuName} disabled />
          </Form.Item>
          <Form.Item label="Sku ID" className="md:col-span-1 mb-0">
            
            {/* Label added for consistency */}
            <Input value={displaySkuId} disabled />
          </Form.Item>
        </div>
      </Form>
      {/* Related SKUs Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredSkusList}
          rowKey="key" // Use the key assigned during fetch
          size="small"
          bordered
          pagination={false} // Matches nzShowPagination="false"
          className="related-skus-table" // Add specific class if needed
        />
      </Spin>
    </div>
  );
};

export default RelatedSKUs;
