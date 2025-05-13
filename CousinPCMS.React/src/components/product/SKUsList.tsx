import {useState, useEffect} from 'react';
import {Table, Checkbox, Spin} from 'antd';
import type {TableProps} from 'antd/es/table';
import {useNotification} from '../../hook/useNotification';
import type {SKuList, SkuListResponse} from '../../models/skusModel';
import {getSkuByProductId} from '../../services/HomeService';
import {getSessionItem, setSessionItem} from '../../services/DataService';

const SKUsList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [skusList, setSkusList] = useState<SKuList[]>([]);
  const [selectedRow, setSelectedRow] = useState<SKuList | null>(null);
  const [productId] = useState<string | null>(getSessionItem('productId') || getSessionItem('tempProductId'));
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
          // const activeSkus = data.value.filter((sku: SKuList) => sku?.akiSKUIsActive).sort((a, b) => Number(a.akiListOrder || 0) - (Number(b.akiListOrder) || 0));
          const activeSkus = data.value.sort((a, b) => Number(a.akiListOrder || 0) - (Number(b.akiListOrder) || 0));
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
      setSessionItem('itemNumber', record.akiitemid || '');
      setSessionItem('skuId', String(record.akiSKUID || ''));
    } else {
      sessionStorage.removeItem('itemNumber');
      sessionStorage.removeItem('skuId');
    }
  };

  const columns: TableProps<SKuList>['columns'] = [
    {
      title: 'Sku Name',
      dataIndex: 'skuName',
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.skuName.localeCompare(b.skuName),
    },
    {
      title: 'MFR Ref No',
      dataIndex: 'akiManufacturerRef',
      ellipsis: true,
      width: 190,
      sorter: (a, b) => a.akiManufacturerRef.localeCompare(b.akiManufacturerRef),
    },
    {
      title: 'Item No',
      dataIndex: 'akigpItemNumber',
      width: 120,
      sorter: (a, b) => (Number(a.akigpItemNumber) || 0) - (Number(b.akigpItemNumber) || 0),
    },
    {
      title: 'List Order',
      dataIndex: 'akiListOrder',
      width: 100,
      align: 'right',
      sorter: (a, b) => (Number(a.akiListOrder) || 0) - (Number(b.akiListOrder) || 0),
    },
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
      title: 'Web Active',
      dataIndex: 'akiWebActive',
      align: 'center',
      render: (isWebActive) => <Checkbox checked={isWebActive} disabled />,
      width: 100,
    },
    {
      title: 'Cat Active',
      dataIndex: 'akiSKUIsActive',
      width: 90,
      align: 'center',
      render: (isActive) => <Checkbox checked={isActive} disabled />,
    },
    {title: 'TemplateID', dataIndex: 'akiTemplateID', width: 100, align: 'center'},
    {
      title: 'AltSku Name',
      dataIndex: 'akiAlternativeTitle',
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a.akiAlternativeTitle.localeCompare(b.akiAlternativeTitle),
    },
    {
      title: 'Comm Code',
      dataIndex: 'akiCommodityCode',
      width: 120,
      sorter: (a, b) => (Number(a.akiCommodityCode) || 0) - (Number(b.akiCommodityCode) || 0),
    },
  ];

  return (
    <div className="px-4">
      <Spin spinning={loading}>
        <Table
          columns={columns}
          scroll={{x: 1100}}
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
          showSorterTooltip={false}
        />
      </Spin>
    </div>
  );
};

export default SKUsList;
