import React, {useState, useEffect, useMemo} from 'react';
import {Input, Table, Checkbox, Spin, Form} from 'antd';
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import type {TableProps} from 'antd/es/table';

import {getSkuLinkedAttributes} from '../../services/SkusService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {ApiResponse} from '../../models/generalModel';
import type {LikedSkuModel} from '../../models/skusModel';

interface AttributeSkuProps {
  skuData: {
    akiitemid: number | string | null | undefined;
  } | null;
}

interface LinkedAttributeItem extends LikedSkuModel {
  key: string;
}

const AttributeSKU: React.FC<AttributeSkuProps> = ({skuData}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [linkedAttributeList, setLinkedAttributeList] = useState<LinkedAttributeItem[]>([]);

  const notify = useNotification();
  const getSkuLinkedAttributesHandler = async (itemId: number | string) => {
    setLoading(true);
    setLinkedAttributeList([]);
    try {
      const response: ApiResponse<LikedSkuModel[]> = await getSkuLinkedAttributes(String(itemId));
      if (response.isSuccess && response.value) {
        const dataWithKeys = response.value.map((item, index) => ({
          ...item,
          key: `${item.akiAttributeName}-${item.akiAttributeValue}-${index}`,
        }));
        setLinkedAttributeList(dataWithKeys);
      } else {
        notify.info('No linked attributes found.');
      }
    } catch {
      notify.error('Failed to load linked attributes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const itemNumber = skuData?.akiitemid;
    if (itemNumber) {
      getSkuLinkedAttributesHandler(itemNumber);
    }
  }, [skuData]);

  const filteredAttributeList = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    if (!normalizedSearch) {
      return linkedAttributeList;
    }

    const normalize = (str: string | undefined | null) => str?.toLowerCase().replace(/\s/g, '') || '';

    return linkedAttributeList.filter((item) => normalize(item.akiAttributeName).includes(normalizedSearch) || normalize(item.akiAttributeValue).includes(normalizedSearch));
  }, [searchValue, linkedAttributeList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearchText = () => {
    setSearchValue('');
  };

  const columns: TableProps<LinkedAttributeItem>['columns'] = [
    {
      title: 'Attribute Name',
      dataIndex: 'akiAttributeName',
      ellipsis: true,
      sorter:(a,b)=>a.akiAttributeName.localeCompare(b.akiAttributeName)
    },
    {
      title: 'Attribute Value',
      dataIndex: 'akiAttributeValue',
      ellipsis: true,
      sorter:(a,b)=>a.akiAttributeValue.localeCompare(b.akiAttributeValue)
    },
    {
      title: 'Link',
      dataIndex: 'akiLink',
      width: 100,
      align: 'center',
      render: (isLinked) => <Checkbox checked={isLinked} disabled={!skuData?.akiitemid} />,
    },
  ];

  return (
    <div className="px-4">
      <Form layout="vertical" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <Form.Item label="Search" className="md:col-span-2 mb-0">
            <Input
              placeholder="Search by name or value..."
              value={searchValue}
              onChange={handleSearchChange}
              suffix={searchValue ? <CloseCircleFilled onClick={clearSearchText} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
            />
          </Form.Item>
        </div>
      </Form>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredAttributeList} rowKey="key" size="small" bordered pagination={false} className="linked-attributes-table" showSorterTooltip={false}/>
      </Spin>
    </div>
  );
};

export default AttributeSKU;
