import {useEffect, useState} from 'react';
import {Spin, Modal, Input} from 'antd';
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import {getSkuByProductId} from '../../services/HomeService';
import {showNotification} from '../../services/DataService';
import type {SKuList} from '../../models/skusModel';
import SKUsComponent from '../../pages/SKUs';

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
  const [productSkusVisible, setProductSkusVisible] = useState(false);

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
      showNotification('error', 'Something went wrong');
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

  const handleCancel = (val: string) => {
    setProductSkusVisible(false);
    if (val !== 'cancel') {
      loadSkuForProduct();
    }
  };

  const editSku = () => {
    if (!selectedSku) {
      setProductSkusVisible(false);
      showNotification('error', 'Please select sku name.');
      return;
    }
    setProductSkusVisible(true);
  };

  const addSKU = () => {
    setProductSkusVisible(true);
  };

  return (
    <div className="border border-[#CBD5E1] rounded-[5px] w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-light-border text-primary-font text-[11px] font-semibold px-4 py-[5px] border-b border-[#d1d5db] flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span>SKU Name</span>
          <button className="text-blue-500 hover:underline text-xs" onClick={addSKU}>
            Add
          </button>
          <button className="text-blue-500 hover:underline text-xs" onClick={editSku}>
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
      {/* SKU List */}
      <Spin spinning={loading}>
        <div className="min-h-[48px] flex flex-col justify-center items-center bg-white">
          {filteredData && filteredData.length > 0 ? (
            <ul className="sku-list list-none p-0 m-0 overflow-y-auto max-h-[700px] lg:max-h-[700px] md:max-h-[50vh] sm:max-h-[40vh] w-full divide-y divide-gray-200 leading-tight">
              {filteredData.map((sku) => (
                <li
                  key={sku.akiSKUID}
                  className={`sku-item px-4 py-2 cursor-pointer text-[10px] text-[#67768C] transition-colors duration-300 ${selectedSku === sku.akiSKUID ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
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
      </Spin>
      {/* SKU Modal (for Add/Edit) */}
      <Modal open={productSkusVisible} onCancel={() => handleCancel('cancel')} footer={null} closable={false} width={1500} className="no-padding-modal">
        {/* TODO: Replace with actual Skus component and pass eventComplete */}
        <SKUsComponent />
      </Modal>
    </div>
  );
};

export default SkusDisplay;
