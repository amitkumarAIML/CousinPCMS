import {useState, useEffect} from 'react';
import {Table, Checkbox, Spin} from 'antd';
import type {TableProps} from 'antd/es/table';
import {useNotification} from '../../contexts.ts/useNotification';
import type {SKuList, SkuListResponse} from '../../models/skusModel';
import {getSkuByProductId} from '../../services/HomeService';

const SKUsList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [skusList, setSkusList] = useState<SKuList[]>([]);
  const [selectedRow, setSelectedRow] = useState<SKuList | null>(null);
  const [productId] = useState<string | null>(sessionStorage.getItem('productId') || '');
  const notify = useNotification();

  useEffect(() => {
    const loadSkuForProduct = async () => {
      if (!productId) {
        setLoading(false);
        setSkusList([]);
        return;
      }
      setLoading(true);
      setSelectedRow(null);
      try {
        const data: SkuListResponse = await getSkuByProductId(Number(productId));
        if (data.isSuccess && data.value) {
          const activeSkus = data.value.filter((sku: SKuList) => sku?.akiSKUIsActive);
          setSkusList(activeSkus);
        } else {
          notify.info(data.exceptionInformation || 'No SKU data found or request failed.');
          setSkusList([]);
        }
      } catch (error) {
        notify.error(error instanceof Error ? error.message : 'Something went wrong while fetching SKUs.');
        setSkusList([]);
      } finally {
        setLoading(false);
      }
    };
    loadSkuForProduct();
  }, [productId, notify]);

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
    {title: 'SkuName', dataIndex: 'skuName', width: 200, ellipsis: true},
    {title: 'ManufacturerRef', dataIndex: 'akiManufacturerRef', ellipsis: true},
    {title: 'ITEM_NUMBER', dataIndex: 'akiitemid'},
    {title: 'ListOrder', dataIndex: 'akiListOrder', width: 100, align: 'right'},
    {
      title: 'Obsolete',
      dataIndex: 'akiObsolete',
      width: 90,
      align: 'center',
      render: (isObsolete) => <Checkbox checked={isObsolete} disabled />,
    },
    {
      title: 'Unavailable',
      dataIndex: 'salesBlocked',
      width: 100,
      align: 'center',
      render: (isBlocked) => <Checkbox checked={isBlocked} disabled />,
    },
    {
      title: 'CatActive',
      dataIndex: 'akiSKUIsActive',
      width: 90,
      align: 'center',
      render: (isActive) => <Checkbox checked={isActive} disabled />,
    },
    {title: 'TemplateID', dataIndex: 'akiTemplateID', width: 100},
    {title: 'AltSkuName', dataIndex: 'akiAltSKUName', ellipsis: true},
    {title: 'CommodityCode', dataIndex: 'akiCommodityCode', width: 120},
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={skusList}
          rowKey="akiitemid"
          size="small"
          bordered
          pagination={false}
          className="no-header-scroll"
          onRow={(record) => ({
            onClick: () => handleRowSelect(record),
            className: record.akiitemid === selectedRow?.akiitemid ? 'selected-row' : '',
          })}
        />
      </Spin>
    </div>
  );
};

export default SKUsList;
