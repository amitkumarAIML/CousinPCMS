import {useEffect, useState} from 'react';
import {Spin, Input, TableProps, Table, Checkbox} from 'antd';
import {SearchOutlined, CloseCircleFilled, CaretRightOutlined} from '@ant-design/icons';
import {getSkuByProductId} from '../../services/HomeService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {SKuList} from '../../models/skusModel';

interface SkusDisplayProps {
  selectedProductId?: number;
  selectedCategory?: string;
}

const SkusDisplay: React.FC<SkusDisplayProps> = ({selectedProductId, selectedCategory}) => {
  const [skus, setSkus] = useState<SKuList[]>([]);
  const [filteredData, setFilteredData] = useState<SKuList[]>([]);
  const [displayText, setDisplayText] = useState('Click on a product to view the SKU');
  const [loading, setLoading] = useState(false);
  const [selectedSku, setSelectedSku] = useState<number | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');
  const notify = useNotification();
  const [selectedRow, setSelectedRow] = useState<SKuList | null>(null);

  useEffect(() => {
    if (!selectedProductId || selectedProductId <= 0 || !selectedCategory || !sessionStorage.getItem('productId')) {
      setDisplayText('Click on a product to view the SKU');
      setSkus([]);
      setFilteredData([]);
      return;
    }
    const productIdStr = sessionStorage.getItem('itemNumber') || '';
    setSelectedSku(productIdStr ? +productIdStr : undefined);
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
        } else {
          setSkus([]);
          setFilteredData([]);
          setDisplayText('No SKU Found');
        }
      } else {
        setDisplayText('Failed to load SKU');
      }
    } catch {
      setDisplayText('Failed to load SKU');
      notify.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSkuClick = (data: SKuList) => {
    if (!data) return;
    setSelectedSku(data.akiSKUID);
    sessionStorage.setItem('itemNumber', String(data.akiitemid));
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
      return normalize(item.skuName).includes(searchText);
    });
    setFilteredData(filtered);
    if (filtered.length === 0) setDisplayText('No SKU Found');
  };

  const clearSearchText = () => {
    setSearchValue('');
    setFilteredData([...skus]);
  };

  const editSku = () => {
    if (!selectedSku) {
      setProductSkusVisible(false);
      notify.error('Please select sku name.');
      return;
    }
    setProductSkusVisible(true);
  };

  const addSKU = () => {};

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
    {title: 'SkuName', dataIndex: 'skuName'},
    {title: 'ManufacturerRef', dataIndex: 'akiManufacturerRef'},
    {title: 'ITEM_NUMBER', dataIndex: 'akiitemid'},
    {title: 'ListOrder', dataIndex: 'akiListOrder'},
    {
      title: 'Obsolete',
      dataIndex: 'akiObsolete',
      align: 'center',
      render: (isObsolete) => <Checkbox checked={isObsolete} disabled />,
    },
    {
      title: 'Unavailable',
      dataIndex: 'salesBlocked',
      align: 'center',
      render: (isBlocked) => <Checkbox checked={isBlocked} disabled />,
    },
    {
      title: 'CatActive',
      dataIndex: 'akiSKUIsActive',
      align: 'center',
      render: (isActive) => <Checkbox checked={isActive} disabled />,
    },
    {title: 'TemplateID', dataIndex: 'akiTemplateID'},
    {title: 'AltSkuName', dataIndex: 'akiAltSKUName'},
    {title: 'CommodityCode', dataIndex: 'akiCommodityCode'},
  ];

  return (
    <div className="border border-border rounded-[5px] w-full bg-white overflow-hidden">
      <div className="bg-light-border text-primary-font text-[11px] font-semibold px-4 py-[5px] border-b border-border flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span>SKUs</span>
          <button className="text-primary-theme hover:underline text-xs" onClick={addSKU}>
            Add
          </button>
          <button className="text-primary-theme hover:underline text-xs" onClick={editSku}>
            Edit
          </button>
        </div>
        <div className="w-64 flex items-center">
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={onSearch}
            suffix={searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />}
          />
        </div>
      </div>

      {/* <Spin spinning={loading}>
        <div className="min-h-[48px] flex flex-col justify-center items-center bg-white">
          {filteredData && filteredData.length > 0 ? (
            <ul className="sku-list list-none p-0 m-0 overflow-y-auto max-h-[700px] lg:max-h-[700px] md:max-h-[50vh] sm:max-h-[40vh] w-full divide-y divide-border leading-tight">
              {filteredData.map((sku) => (
                <li
                  key={sku.akiSKUID}
                  className={`sku-item px-4 py-2 cursor-pointer text-[10px]  transition-colors duration-300 ${
                    selectedSku === sku.akiSKUID ? ' bg-primary-theme-active' : 'hover:bg-gray-100  text-secondary-font '
                  }`}
                  onClick={() => onSkuClick(sku)}
                >
                  {sku.skuName}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-12 text-secondary-font text-[10px] text-center">{displayText}</div>
          )}
        </div>
      </Spin> */}
      <Spin spinning={loading}>
        <div className="pt-2">
          <Table scroll={{x: 1500}} columns={columns} dataSource={filteredData} rowKey="akiitemid" size="small" bordered pagination={false} />
        </div>
      </Spin>
    </div>
  );
};

export default SkusDisplay;
