import { useEffect, useState } from 'react';
import { Spin, Input, TableProps, Table, Checkbox, Button } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { getSkuByProductId } from '../../services/HomeService';
import { useNotification } from '../../contexts.ts/useNotification';
import type { SKuList } from '../../models/skusModel';
import { useNavigate } from 'react-router';
import { getSessionItem, setSessionItem } from '../../services/DataService';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
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
  const type = 'DraggableBodyRow';
  const notify = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const id = getSessionItem('productId') ? getSessionItem('productId') : getSessionItem('tempProductId');
    if (!selectedProductId || !selectedCategory || !id) {
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
          activeSkus.sort((a, b) => a.akiListOrder - b.akiListOrder);
          setSkus(activeSkus);

          setFilteredData(activeSkus);
          setDisplayText(activeSkus.length > 0 ? '' : 'No SKU Found');

          if (getSessionItem('tempProductId') && activeSkus.length > 0) {
            setSessionItem('tempItemNumber', activeSkus[0].akiitemid.toString());
          }

          const persistedItemNumber = getSessionItem('itemNumber') ? getSessionItem('itemNumber') : getSessionItem('tempItemNumber');
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
      return normalize(item.skuName).includes(searchText) ||
        normalize(item.akiitemid).includes(searchText) ||
        normalize(item.akiListOrder.toString()).includes(searchText) ||
        normalize(item.akiAltSKUName.toString()).includes(searchText) ||
        normalize(item.akiTemplateID.toString()).includes(searchText) ||
        normalize(item.countryRegionOfOriginCode.toString()).includes(searchText) ||
        normalize(item.akiManufacturerRef).includes(searchText) ||
        normalize(item.akiCommodityCode.toString()).includes(searchText);
    });
    setFilteredData(filtered);
    if (filtered.length === 0) setDisplayText('No SKU Found');
  };

  const clearSearchText = () => {
    setSearchValue('');
    setFilteredData([...skus]);
  };

  const handleRowSelect = (record: SKuList) => {
    setSelectedRow((prev: SKuList | null) => (prev?.akiitemid === record.akiitemid ? null : record));
    if (record.akiitemid !== selectedRow?.akiitemid) {
      setSessionItem('itemNumber', record.akiitemid || '');
      if (getSessionItem('tempDepartmentId') && getSessionItem('tempCategoryId')) {
        const dept = getSessionItem('tempDepartmentId');
        setSessionItem('departmentId', dept);
        const categoryId = getSessionItem('tempCategoryId');
        setSessionItem('CategoryId', categoryId);
      }

      sessionStorage.removeItem('tempDepartmentId');
      sessionStorage.removeItem('tempCategoryId');
      sessionStorage.removeItem('tempProductId');
      sessionStorage.removeItem('tempItemNumber');
    } else {
      sessionStorage.removeItem('itemNumber');
    }
  };

  const columns: TableProps<SKuList>['columns'] = [
    {
      title: (
        <div className="flex gap-1 my-1">
          <div className="flex gap-x-2 items-center">
            <span>SKUs</span>
            <Button type="link" size="small" onClick={() => navigate('/skus/add')}>
              Add
            </Button>
            <Button type="link" size="small" onClick={() => navigate('/skus/edit')} disabled={getSessionItem('itemNumber') || getSessionItem('tempItemNumber') ? false : true}>
              Edit
            </Button>
          </div>
          <div className="w-40 flex items-center">
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={onSearch}
              suffix={searchValue ? <CloseCircleFilled className="cursor-pointer" onClick={clearSearchText} aria-hidden="true" /> : <SearchOutlined />}
            />
          </div>
        </div>
      ),
      dataIndex: 'skuName',
      width: 250,
      sorter: (a, b) => a.skuName.localeCompare(b.skuName)
    },

    {
      title: 'MFR Ref No',
      dataIndex: 'akiManufacturerRef',
      width: 160,
      ellipsis: true,
      sorter: (a, b) => a.akiManufacturerRef.localeCompare(b.akiManufacturerRef)
    },
    {
      title: 'Item No', dataIndex: 'akiitemid', width: 130,
      sorter: (a, b) => (Number(a.akiitemid) || 0) - (Number(b.akiitemid) || 0)
    },
    {
      title: 'List Order', dataIndex: 'akiListOrder', width: 130,
      sorter: (a, b) => (Number(a.akiListOrder) || 0) - (Number(b.akiListOrder) || 0)
    },
    {
      title: 'Obsolete',
      dataIndex: 'akiObsolete',
      align: 'center',
      render: (isObsolete) => <Checkbox checked={isObsolete} disabled />,
      width: 120,
    },
    {
      title: 'Unavailable',
      dataIndex: 'salesBlocked',
      align: 'center',
      render: (isBlocked) => <Checkbox checked={isBlocked} disabled />,
      width: 120,
    },
    {
      title: 'Web Active',
      dataIndex: 'akiWebActive',
      align: 'center',
      render: (isWebActive) => <Checkbox checked={isWebActive} disabled />,
      width: 130,
    },
    {
      title: 'Cat Active',
      dataIndex: 'akiSKUIsActive',
      align: 'center',
      render: (isActive) => <Checkbox checked={isActive} disabled />,
      width: 120,
    },
    {
      title: 'Temp ID',
      dataIndex: 'akiTemplateID',
      align: 'center',
      width: 120,
    },
    {
      title: 'AltSku Name', dataIndex: 'akiAltSKUName', width: 150,
      sorter: (a, b) => a.akiAltSKUName.localeCompare(b.akiAltSKUName)
    },
    { title: 'Ctr of Org', dataIndex: 'countryRegionOfOriginCode', width: 150 },
    {
      title: 'Comm Code', dataIndex: 'akiCommodityCode', align: 'center', width: 150,
      sorter: (a, b) => (Number(a.akiCommodityCode) || 0) - (Number(b.akiCommodityCode) || 0)
    },
  ];

  const SortableRow = (props: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: props['data-row-key'],
    });

    const style = {
      ...props.style,
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: 'move',
    };

    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = filteredData.findIndex((item) => item.akiitemid === active.id);
      const newIndex = filteredData.findIndex((item) => item.akiitemid === over.id);

      const newData = arrayMove(filteredData, oldIndex, newIndex);
      setFilteredData(newData);
      setSkus(newData);
    }
  };
  return (
    <div className="">
      <Spin spinning={loading}>
        <div className="">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={filteredData.map(item => item.akiitemid)}
              strategy={verticalListSortingStrategy}
            >
                <Table
                  scroll={{ x: 1200 }}
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="akiitemid"
                  size="small"
                  bordered
                  pagination={false}
                  locale={{ emptyText: displayText }}
                  onRow={(record, index) => ({
                    index,
                    'data-row-key': record.akiitemid,
                    onClick: () => handleRowSelect(record),
                    className: selectedRow?.akiitemid === record.akiitemid
                      ? 'bg-primary-theme-active'
                      : 'cursor-pointer',
                  })}
                  components={{
                    body: {
                      row: SortableRow,
                    },
                  }}
                />
            </SortableContext>
          </DndContext>
        </div>
      </Spin>
    </div>
  );
};

export default SkusDisplay;
