import {useState, useEffect, useCallback} from 'react';
import {useNavigate, Link} from 'react-router';
import {Table, Checkbox, Spin, Button} from 'antd';
import type {TableProps} from 'antd/es/table';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';

import {getAttributeValuesByListofNames, addUpdateSKULinkedAttribute} from '../../services/SkusService';
import {extractUserMessage} from '../../services/DataService';
import type {ApiResponse} from '../../models/generalModel';
import type {AttributeValueModel} from '../../models/attributesModel';
import type {LikedSkuModel} from '../../models/skusModel';
import {useNotification} from '../../contexts.ts/useNotification';

interface GroupedValues {
  [attributeName: string]: ExtendedAttributeValueModel[];
}

interface ExtendedAttributeValueModel extends AttributeValueModel {
  key: string;
  attributeValueLinkedToSKU: boolean;
}

interface TableRowData {
  key: number;
  [attributeName: string]: string | boolean | number | null | ExtendedAttributeValueModel | undefined;
}

const AttributeMultiUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [attributeNames, setAttributeNames] = useState<string[]>([]);
  const [tableDataSource, setTableDataSource] = useState<TableRowData[]>([]);
  const notify = useNotification();

  const navigate = useNavigate();

  const loadAttributeValues = useCallback(async (names: string[]) => {
    setLoading(true);
    setTableDataSource([]);
    try {
      const req = {attributeNames: names};
      const response: ApiResponse<AttributeValueModel[]> = await getAttributeValuesByListofNames(req);
      if (response.isSuccess && response.value) {
        if (response.value.length > 0) {
          const attributeList: ExtendedAttributeValueModel[] = response.value.map((val: AttributeValueModel, index: number) => ({
            ...val,
            attributeValueLinkedToSKU: val.attributeValueLinkedToSKU ?? false,
            key: `${val.attributeName}-${val.attributeValue}-${index}`,
          }));

          const groups: GroupedValues = {};
          names.forEach((name) => {
            groups[name] = attributeList.filter((val) => val.attributeName === name);
          });

          const maxRowCount = Math.max(0, ...names.map((h) => groups[h]?.length || 0));
          const dataSource: TableRowData[] = [];
          for (let i = 0; i < maxRowCount; i++) {
            const row: TableRowData = {key: i};
            names.forEach((header) => {
              const item = groups[header]?.[i];
              row[`${header}_value`] = item?.attributeValue ?? null;
              row[`${header}_checked`] = item?.attributeValueLinkedToSKU ?? false;
              row[`${header}_item`] = item ? {...item} : null;
            });
            dataSource.push(row);
          }
          setTableDataSource(dataSource);
        } else {
          extractUserMessage('No attribute values found for the selected names.');
        }
      } else {
        extractUserMessage('Failed To Load Attribute Values');
      }
    } catch (error) {
      console.error('Error loading attribute values:', error);
      extractUserMessage('Something went wrong loading attribute values.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedNames = sessionStorage.getItem('attributeNames');
    const names = storedNames ? JSON.parse(storedNames) : [];
    if (names.length === 0) {
      extractUserMessage('No attribute names found in session storage.');
      navigate(-1);
      return;
    }
    setAttributeNames(names);
    loadAttributeValues(names);
  }, [loadAttributeValues, navigate]);

  const handleCancel = () => {
    sessionStorage.removeItem('attributeNames');
    navigate('/skus');
  };

  const handleCheckboxChange = async (event: CheckboxChangeEvent, rowIndex: number, header: string) => {
    const isChecked = event.target.checked;
    const item = tableDataSource[rowIndex][`${header}_item`] as ExtendedAttributeValueModel | null;
    if (!item) {
      console.error('Could not find item data for checkbox change.');
      return;
    }
    const updatedDataSource = [...tableDataSource];
    updatedDataSource[rowIndex] = {
      ...updatedDataSource[rowIndex],
      [`${header}_checked`]: isChecked,
      [`${header}_item`]: {...item, attributeValueLinkedToSKU: isChecked},
    };
    setTableDataSource(updatedDataSource);
    const req: LikedSkuModel = {
      akiItemNo: sessionStorage.getItem('itemNumber') || '',
      akiAttributeName: item.attributeName,
      akiAttributeValue: item.attributeValue,
      akiLink: isChecked,
    };
    if (!req.akiItemNo) {
      extractUserMessage('Item Number not found in session storage.');
      return;
    }
    try {
      const response: ApiResponse<LikedSkuModel> = await addUpdateSKULinkedAttribute(req);
      if (response.isSuccess) {
        notify.success('Attribute Link Updated Successfully!');
      } else {
        extractUserMessage('Failed to update attribute link.');
        const revertedDataSource = [...tableDataSource];
        revertedDataSource[rowIndex] = {
          ...revertedDataSource[rowIndex],
          [`${header}_checked`]: !isChecked,
          [`${header}_item`]: {...item, attributeValueLinkedToSKU: !isChecked},
        };
        setTableDataSource(revertedDataSource);
      }
    } catch (error) {
      console.error('Error updating linked attribute:', error);
      extractUserMessage('Something went wrong updating link.');
      const revertedDataSource = [...tableDataSource];
      revertedDataSource[rowIndex] = {
        ...revertedDataSource[rowIndex],
        [`${header}_checked`]: !isChecked,
        [`${header}_item`]: {...item, attributeValueLinkedToSKU: !isChecked},
      };
      setTableDataSource(revertedDataSource);
    }
  };

  const columns: TableProps<TableRowData>['columns'] = attributeNames.flatMap((header) => [
    {
      title: header,
      dataIndex: `${header}_value`,
      key: `${header}_value`,
      render: (text: string | null) => text ?? '',
    },
    {
      title: 'Select',
      dataIndex: `${header}_checked`,
      key: `${header}_checked`,
      width: 80,
      align: 'center',
      render: (checked: boolean, record: TableRowData, rowIndex: number) => {
        const hasValue = record[`${header}_value`] !== null;
        return hasValue ? <Checkbox checked={checked} onChange={(e) => handleCheckboxChange(e, rowIndex, header)} /> : null;
      },
    },
  ]);

  return (
    <div className="main-container">
      <Spin spinning={loading}>
        <div className="flex flex-wrap justify-between items-center p-4 pb-1">
          <span className="text-sm font-medium">Attribute Multi Upload Form</span>
          <div className="flex gap-x-3">
            <Button type="default" onClick={handleCancel}>
              Close
            </Button>
            <Link to="/attributes/add">
              <Button type="primary">New Value</Button>
            </Link>
          </div>
        </div>
        <hr className="mt-2 mb-1 border-gray-200" />

        <div className="p-4">
          <Table columns={columns} dataSource={tableDataSource} rowKey="key" size="small" bordered pagination={false} className="attribute-multi-upload-table" />
        </div>
      </Spin>
    </div>
  );
};

export default AttributeMultiUpload;
