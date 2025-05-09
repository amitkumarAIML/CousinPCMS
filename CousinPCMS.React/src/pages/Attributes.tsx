import {useState, useEffect, useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router';
import {Input, Button, Spin} from 'antd';
import {CloseCircleFilled, SearchOutlined} from '@ant-design/icons';
import {useNotification} from '../contexts.ts/useNotification';
import type {AttributeModel} from '../models/attributeModel';
import {getAttributesList} from '../services/AttributesService';
import {setSessionItem} from '../services/DataService';

const Attributes = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [attributeList, setAttributeList] = useState<AttributeModel[]>([]);
  const navigate = useNavigate();
  const notify = useNotification();
  const pageSize = 50;

  const fetchAllAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAttributesList();
      if (response.isSuccess && response.value) {
        setAttributeList(response.value);
      } else {
        notify.error('Failed to load attributes.');
      }
    } catch (error) {
      notify.error('Something went wrong loading attributes.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    sessionStorage.removeItem('attributeName');
    fetchAllAttributes();
  }, [fetchAllAttributes]);

  const handleEdit = (attr: AttributeModel) => {
    setSessionItem('attributeName', attr.attributeName);
    navigate('/attributes/edit');
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchValue?.toLowerCase().replace(/\s/g, '') || '';
    return attributeList.filter((attr) => {
      const normalize = (val: string | undefined | null) => val?.toLowerCase().replace(/\s/g, '') || '';
      return normalize(attr.attributeName).includes(normalizedSearch);
    });
  }, [searchValue, attributeList]);

  // Function to chunk data into columns
  const chunkData = (data: any[], chunkSize: number) => {
    let result: any[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const chunkedData = chunkData(filteredData, pageSize); // Split into 50 items per "column"

  return (
    <div className="h-[calc(100vh-100px)] main-container overflow-x-auto">
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-y-4 p-4 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="me-3">Attribute List</span>
            <div className="max-w-xs w-full">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                suffix={
                  searchValue ? <CloseCircleFilled onClick={() => setSearchValue('')} style={{color: 'rgba(0,0,0,.45)', cursor: 'pointer'}} /> : <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />
                }
              />
            </div>
          </div>
          <div className="flex justify-start md:justify-end gap-x-3">
            <Button size="small" onClick={() => navigate('/home')}>
              Close
            </Button>
            <Button size="small" type="primary" onClick={() => navigate('/attributes/add')}>
              Add
            </Button>
          </div>
        </div>

        <hr className="border-light-border mt-2" />
        <div className="p-4">
          <div className="overflow-x-auto border rounded-lg border-light-border">
            {filteredData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-secondary-font">No data found.</div>
            ) : (
              <div className="min-w-max flex space-x-2 px-2 py-1">
                {chunkedData.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="flex flex-col space-y-2 w-[200px]">
                    {chunk.map((attr, index) => (
                      <div key={index} className="cursor-pointer text-secondary-font hover:text-primary-theme-hover p-0 m-0 text-xs">
                        <span onClick={() => handleEdit(attr)}>{attr.attributeName}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Attributes;
