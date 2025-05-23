import React, {useState, useEffect, useMemo} from 'react';
import {Input, Table, Checkbox, Spin, Form} from 'antd';
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';

import {getRelatedSkuItem, updateRelatedSkuItemObsolete, updateRelatedSkuItemUnavailable} from '../../services/SkusService';
import {useNotification} from '../../hook/useNotification';
import {RelatedSkuItem, RelatedSkuModel, SKuList} from '../../models/skusModel';

interface RelatedSkuProps {
  skuData: SKuList | null;
}

const RelatedSKUs: React.FC<RelatedSkuProps> = ({skuData}) => {
  const notify = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [relatedSkusList, setRelatedSkusList] = useState<RelatedSkuItem[]>([]);

  const [displaySkuName, setDisplaySkuName] = useState<string>('');
  const [displaySkuId, setDisplaySkuId] = useState<number | string>('');

  useEffect(() => {
    if (skuData) {
      setDisplaySkuName(skuData.skuName || '');
      setDisplaySkuId(skuData.akiSKUID || '');

      const itemNumber = skuData.akiitemid;
      if (itemNumber) {
        setTimeout(() => loadRelatedSku(itemNumber), 0);
      } else {
        console.warn('Related SKUs: Main SKU Item Number is missing.');
        setRelatedSkusList([]);
      }
    } else {
      setDisplaySkuName('');
      setDisplaySkuId('');
      setRelatedSkusList([]);
      setSearchValue('');
    }
  }, [skuData]);

  const loadRelatedSku = async (itemNumber: string) => {
    setLoading(true);
    setRelatedSkusList([]);
    try {
      const response = await getRelatedSkuItem(itemNumber);
      if (response.isSuccess && response.value) {
        // const dataWithKeys = (response.value as unknown as RelatedSkuItem[]).map((item: RelatedSkuItem) => ({
        //   ...item,
        //   key: item.relatedItemNo,
        // }));
        setRelatedSkusList(response.value);
      } else {
        notify.info(response.exceptionInformation?.toString() || 'No related SKUs found.');
        setRelatedSkusList([]);
      }
    } catch {
      notify.error('Something went wrong loading related SKUs.');
      setRelatedSkusList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkusList = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return relatedSkusList;
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
  }, [searchValue, relatedSkusList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  const handleCheckboxChange = async (relatedItemNo: string, field: 'itemObsolte' | 'itemIsUnavailable', checked: boolean) => {
    setLoading(true);
    try {
      let response;
      const req: RelatedSkuModel = {
        akiitemid: relatedItemNo,
      };
      if (field === 'itemIsUnavailable') {
        response = await updateRelatedSkuItemUnavailable({...req, akiCurrentlyPartRestricted: checked});
      } else if (field === 'itemObsolte') {
        response = await updateRelatedSkuItemObsolete({...req, akiObsolete: checked});
      } else {
        throw new Error('Invalid field type');
      }
      if (response.isSuccess) {
        notify.success('Updated successfully.');
        setRelatedSkusList((prevList) => prevList.map((item) => (item.relatedItemNo === relatedItemNo ? {...item, [field]: checked} : item)));
      } else {
        // notify.error(response.exceptionInformation || 'Failed to update.');
      }
    } catch {
      notify.error('Something went wrong while updating.');
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<RelatedSkuItem>['columns'] = [
    {title: 'Related', dataIndex: 'relatedItemNo', width: 200, sorter: (a, b) => (Number(a.relatedItemNo) || 0) - (Number(b.relatedItemNo) || 0)},
    {title: 'Relation Type', dataIndex: 'relationType', ellipsis: true, sorter: (a, b) => a.relationType.localeCompare(b.relationType)},
    {title: 'RelatedSku Name', dataIndex: 'relatedSKUName', ellipsis: true, sorter: (a, b) => a.relatedSKUName.localeCompare(b.relatedSKUName)},
    {title: 'MFR Ref No', dataIndex: 'itemManufactureRef', ellipsis: true, sorter: (a, b) => a.itemManufactureRef.localeCompare(b.itemManufactureRef)},
    {title: 'Item No', dataIndex: 'itemNo', sorter: (a, b) => (Number(a.itemNo) || 0) - (Number(b.itemNo) || 0)},
    {
      title: 'Obsolete',
      dataIndex: 'itemObsolte',
      width: 90,
      align: 'center',
      render: (isObsolete, record) => <Checkbox checked={isObsolete} disabled={!skuData?.akiitemid} onChange={(e) => handleCheckboxChange(record.relatedItemNo, 'itemObsolte', e.target.checked)} />,
    },
    {
      title: 'Unavailable',
      dataIndex: 'itemIsUnavailable',
      width: 100,
      align: 'center',
      render: (isUnavailable, record) => (
        <Checkbox checked={isUnavailable} disabled={!skuData?.akiitemid} onChange={(e) => handleCheckboxChange(record.relatedItemNo, 'itemIsUnavailable', e.target.checked)} />
      ),
    },
  ];

  return (
    <div className="px-4">
      <Form layout="vertical" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-3 items-end">
          <Form.Item label="Search" className="md:col-span-2 mb-0">
            <Input
              placeholder="Search related SKUs..."
              value={searchValue}
              onChange={handleSearchChange}
              suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
            />
          </Form.Item>

          <Form.Item label="Sku Name" className="md:col-span-2 mb-0">
            <Input value={displaySkuName} disabled />
          </Form.Item>
          <Form.Item label="Sku ID" className="md:col-span-1 mb-0">
            <Input value={displaySkuId} disabled />
          </Form.Item>
        </div>
      </Form>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredSkusList} rowKey="key" size="small" bordered pagination={false} className="related-skus-table" showSorterTooltip={false} />
      </Spin>
    </div>
  );
};

export default RelatedSKUs;
