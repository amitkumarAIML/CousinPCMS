import {useState, useEffect} from 'react';
import {Table, Checkbox, Spin} from 'antd';
import type {TableProps} from 'antd/es/table';
import {useNotification} from '../../hook/useNotification';
import type {SKuList, SkuListResponse} from '../../models/skusModel';
import {getSkuByProductId} from '../../services/HomeService';
import {getSessionItem} from '../../services/DataService';
import {updateProductSKus} from '../../services/ProductService';
import {UpdateProductSkusRequest} from '../../models/productModel';

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
    // if (record.akiitemid !== selectedRow?.akiitemid) {
    //   setSessionItem('itemNumber', record.akiitemid || '');
    //   setSessionItem('skuId', String(record.akiSKUID || ''));
    // } else {
    //   sessionStorage.removeItem('itemNumber');
    //   sessionStorage.removeItem('skuId');
    // }
  };

  const handleCheckboxChange = async (data: SKuList, field: string, checked: boolean) => {
    setLoading(true);
    try {
      const req: UpdateProductSkusRequest = {
        skuITEMID: Number(data.akiitemid),
        productid: Number(data.akiProductID),
        obsolete: field === 'akiObsolete' ? checked : data.akiObsolete,
        unavailable: field === 'akiCurrentlyPartRestricted' ? checked : data.akiCurrentlyPartRestricted,
        webactive: field === 'akiWebActive' ? checked : data.akiWebActive,
        catactive: field === 'akiSKUIsActive' ? checked : data.akiSKUIsActive,
      };
      const response = await updateProductSKus(req);
      if (response.isSuccess) {
        notify.success('Updated successfully.');
        setSkusList((prevList) => prevList.map((item) => (item.akiitemid === data.akiitemid ? {...item, [field]: checked} : item)));
      } else {
        notify.error('Failed to update.');
      }
    } catch {
      notify.error('Something went wrong while updating.');
    } finally {
      setLoading(false);
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
      render: (isObsolete, record) => <Checkbox checked={isObsolete} onChange={(e) => handleCheckboxChange(record, 'akiObsolete', e.target.checked)} />,
    },
    {
      title: 'Unavailable',
      dataIndex: 'akiCurrentlyPartRestricted',
      width: 100,
      align: 'center',
      render: (isBlocked, record) => <Checkbox checked={isBlocked} onChange={(e) => handleCheckboxChange(record, 'akiCurrentlyPartRestricted', e.target.checked)} />,
    },
    {
      title: 'Web Active',
      dataIndex: 'akiWebActive',
      align: 'center',
      render: (isWebActive, record) => <Checkbox checked={isWebActive} onChange={(e) => handleCheckboxChange(record, 'akiWebActive', e.target.checked)} />,
      width: 100,
    },
    {
      title: 'Cat Active',
      dataIndex: 'akiSKUIsActive',
      width: 90,
      align: 'center',
      render: (isActive, record) => <Checkbox checked={isActive} onChange={(e) => handleCheckboxChange(record, 'akiSKUIsActive', e.target.checked)} />,
    },
    {title: 'TemplateID', dataIndex: 'akiTemplateID', width: 100, align: 'center'},
    {
      title: 'AltSku Name',
      dataIndex: 'akiAltSKUName',
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a.akiAltSKUName.localeCompare(b.akiAltSKUName),
    },
    {
      title: 'Comm Code',
      dataIndex: 'akiCommodityCode',
      width: 120,
      sorter: (a, b) => (Number(a.akiCommodityCode) || 0) - (Number(b.akiCommodityCode) || 0),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="px-4">
        <Table
          columns={columns}
          scroll={{y: 800}}
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
      </div>
    </Spin>
  );
};

export default SKUsList;
