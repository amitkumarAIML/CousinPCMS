import { useEffect, useState } from 'react';
import { Spin, Input, TableProps, Table, Checkbox } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { getSkuByProductId } from '../../services/HomeService';
import { useNotification } from '../../contexts.ts/useNotification';
import type { SKuList } from '../../models/skusModel';
import { useNavigate } from 'react-router';

interface SkusDisplayProps {
  selectedProductId?: number;
  selectedCategory?: string;
}

const SkusDisplay: React.FC<SkusDisplayProps> = ({ selectedProductId, selectedCategory }) => {
  const [skus, setSkus] = useState<SKuList[]>([]);
  const [filteredData, setFilteredData] = useState<SKuList[]>([]);
  const [displayText, setDisplayText] = useState('Click on a product to view the SKU');
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRow, setSelectedRow] = useState<SKuList | null>(null);

  const notify = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProductId || !selectedCategory || !sessionStorage.getItem('productId')) {
      setDisplayText('Click on a product to view the SKU');
      setSkus([]);
      setFilteredData([]);
      return;
    }
    loadSkuForProduct();
    // eslint-disable-next-line
  }, [selectedProductId, selectedCategory]);

  const loadSkuForProduct = async () => {
    setLoading(true);
    setSkus([]);
    try {
      const data = await getSkuByProductId(selectedProductId!);
      if (data.isSuccess) {
        if (data.value && data.value.length > 0) {
          const activeSkus = data.value.filter((res: SKuList) => res?.akiSKUIsActive);
          setSkus(activeSkus);
          setFilteredData(activeSkus);
          setDisplayText(activeSkus.length > 0 ? '' : 'No SKU Found');
          // Set selected row based on itemNumber in sessionStorage
          const persistedItemNumber = sessionStorage.getItem('itemNumber');
          if (persistedItemNumber) {
            const found = activeSkus.find((p) => String(p.akiitemid) === String(persistedItemNumber));
            setSelectedRow(found || null);
          } else {
            setSelectedRow(null);
          }
        } else {
          setSkus([]);
          setFilteredData([]);
          setDisplayText('No SKU Found');
          setSelectedRow(null);
        }
      } else {
        setDisplayText('Failed to load SKU');
        setSelectedRow(null);
      }
    } catch {
      setDisplayText('Failed to load SKU');
      notify.error('Something went wrong');
      setSelectedRow(null);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const searchText = value?.toLowerCase().replace(/\s/g, '') || '';
    if (!searchText) {
      setFilteredData([...skus]);
      return;
    }
    const filtered = skus.filter((item) => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';
      return normalize(item.akiitemid).includes(searchText);
    });
    setFilteredData(filtered);
    if (filtered.length === 0) setDisplayText('No SKU Found');
  };

  const clearSearchText = () => {
    setSearchValue('');
    setFilteredData([...skus]);
  };

  const editSku = () => {
    navigate('/skus/edit');
  };

  const addSKU = () => {
    navigate('/skus/add');
  };

  const handleRowSelect = (record: SKuList) => {
    setSelectedRow((prev: SKuList | null) => (prev?.akiitemid === record.akiitemid ? null : record));
    if (record.akiitemid !== selectedRow?.akiitemid) {
      sessionStorage.setItem('itemNumber', record.akiitemid || '');
      sessionStorage.setItem('skuId', String(record.akiSKUID || ''));
    } else {
      sessionStorage.removeItem('itemNumber');
      sessionStorage.removeItem('skuId');
    }
  };

  const columns: TableProps<SKuList>['columns'] = [

    {
      title: (
        <div className="flex gap-1 my-1">
          <div className="flex gap-x-2 items-center">
            <span>SKUs</span>
            <button className="text-primary-theme hover:underline text-xs" onClick={addSKU}>
              Add
            </button>
            <button className="text-primary-theme hover:underline text-xs" onClick={editSku}>
              Edit
            </button>
          </div>
          <div className="w-40 flex items-center">
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={onSearch}
              suffix={
                searchValue ? (
                  <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" />
                ) : (
                  <SearchOutlined />
                )
              }
            />
          </div>
        </div>
      ),
      dataIndex: 'skuName',

      width: 250,
    },

    {
      title: 'MFR Ref No', dataIndex: 'akiManufacturerRef',width:160
    },
    { title: 'Item No', dataIndex: 'akiitemid' ,width:130},
    { title: 'List Order', dataIndex: 'akiListOrder' ,width:130},
    {
      title: 'Obsolete',
      dataIndex: 'akiObsolete',
      align: 'center',
      render: (isObsolete) => <Checkbox checked={isObsolete} disabled />,width:120
    },
    {
      title: 'Unavailable',
      dataIndex: 'salesBlocked',
      align: 'center',
      render: (isBlocked) => <Checkbox checked={isBlocked} disabled />,width:120
    },
    {
      title: 'Cat Active',
      dataIndex: 'akiSKUIsActive',
      align: 'center',
      render: (isActive) => <Checkbox checked={isActive} disabled />,width:120
    },
    {
      title: 'Temp ID', dataIndex: 'akiTemplateID', align: 'center', width:120,
    },
    { title: 'AltSkuName', dataIndex: 'akiAltSKUName' },
    { title: 'Comm Code', dataIndex: 'akiCommodityCode', align: 'center',width:150 },
  ];

  return (
    <div className="">
      <Spin spinning={loading}>
        <div className="">
          <Table
            scroll={{ x: 1000 }}
            columns={columns}
            tableLayout='auto'
            dataSource={filteredData}
            rowKey="akiitemid"
            size="small"
            bordered
            pagination={false}
            locale={{ emptyText: displayText }}
            onRow={(record) => ({
              onClick: () => handleRowSelect(record),
              className: selectedRow?.akiitemid === record.akiitemid ? 'bg-primary-theme-active' : 'cursor-pointer',
            })}
          />
        </div>
      </Spin>
    </div>
  );
};

export default SkusDisplay;
