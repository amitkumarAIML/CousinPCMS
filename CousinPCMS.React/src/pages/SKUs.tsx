import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button, Spin} from 'antd';
import type {FormInstance} from 'antd/es/form';
import SKUDetails from '../components/skus/SKUDetails';
import RelatedSKUs from '../components/skus/RelatedSKUs';
import AttributeSKU from '../components/skus/AttributeSKU';
import {updateSkus, getSkuItemById, addSkus} from '../services/SkusService';
import {useNotification} from '../contexts.ts/useNotification';
import type {SKuList} from '../models/skusModel';
import type {ApiResponse} from '../models/generalModel';
import {cleanEmptyNullToString, getSessionItem} from '../services/DataService';

const SKUs = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [btnSaveLoading, setBtnSaveLoading] = useState<boolean>(false);
  const [skuData, setSkuData] = useState<SKuList | null>(null);
  const [skuDetailsFormInstance, setSkuDetailsFormInstance] = useState<FormInstance | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const notify = useNotification();

  const handleFormInstanceReady = useCallback((form: FormInstance) => {
    setSkuDetailsFormInstance(form);
  }, []);

  const fetchSkuByItemNumber = useCallback(
    async (itemNum: string) => {
      setLoading(true);
      try {
        const response: ApiResponse<SKuList[]> = await getSkuItemById(itemNum);
        if (response.isSuccess && response.value && response.value.length > 0) {
          setSkuData(response.value[0]);
        } else {
          notify.error('Failed To Load SKU Data');
          setSkuData(null);
        }
      } catch (err: unknown) {
        console.error('Error fetching SKU:', err);
        if (err && typeof err === 'object' && 'error' in err && (err as {error?: {title?: string}}).error?.title) {
          notify.error((err as {error?: {title?: string}}).error?.title || '');
        } else {
          notify.error('Something went wrong while fetching SKU data.');
        }
        setSkuData(null);
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );

  useEffect(() => {
    if (location.pathname === '/skus/add') {
      setLoading(false);
      return;
    }
    if (location.pathname === '/skus/edit') {
      setIsEdit(true);
    }
    const itemNumFromSession = getSessionItem('itemNumber') || '';
    if (itemNumFromSession) {
      fetchSkuByItemNumber(itemNumFromSession);
    } else {
      notify.error('SKU Item Number not found. Please select an SKU.');
      setLoading(false);
    }
  }, [navigate, notify, fetchSkuByItemNumber]);

  const handleCancel = () => {
    navigate('/home');
  };

  const handleSave = async () => {
    if (!skuDetailsFormInstance) {
      notify.error('SKU details form is not ready.');
      return;
    }

    try {
      const values = await skuDetailsFormInstance.validateFields();
      const skusData = cleanEmptyNullToString(values);

      skusData.akiPrintLayoutTemp = !!skusData.akiLayoutTemplate;
      const akiPriceBreaksTBC = skuData?.akiPriceBreak ?? false;
      const req = {
        ...skusData,
        akiPriceBreaksTBC,
      };
      console.log('Product data:', req, skuData?.akiPriceBreak ?? 'No Price Break');
      try {
        setBtnSaveLoading(true);
        if (isEdit) {
          const response = await updateSkus(req);
          if (response.isSuccess) {
            notify.success('SKU Details Updated Successfully');
            navigate('/home');
          } else {
            setBtnSaveLoading(false);
            notify.error('SKU Details Update Failed');
          }
        } else {
          const response = await addSkus(req);
          if (response.isSuccess) {
            notify.success('SKU Details Added Successfully');
            navigate('/home');
          } else {
            setBtnSaveLoading(false);
            notify.error('SKU Details Added Failed');
          }
        }
      } catch (errorInfo: unknown) {
        setBtnSaveLoading(false);
        notify.error('Please fill in all required fields correctly.' + errorInfo);
      }
    } catch (error: unknown) {
      console.error('Error saving SKU:', error);
      notify.error('An error occurred while saving SKU details.');
    }
  };

  const tabBarExtraContent = (
    <div className="flex gap-x-3 mb-2 mr-4">
      <Button size="small" onClick={handleCancel}>
        Close
      </Button>
      {activeTab === '1' && (
        <Button size="small" type="primary" loading={btnSaveLoading} onClick={handleSave}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Spin spinning={loading}>
        <div className="main-container pt-2">
        <label className="px-4 text-sm font-medium">Sku Form</label>
          <div className="pb-1">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={tabBarExtraContent}
              className="product-tabs"
              items={[
                {
                  label: 'Sku',
                  key: '1',
                  children: <SKUDetails skuData={skuData} onFormInstanceReady={handleFormInstanceReady} />,
                },
                {
                  label: 'Related Skus',
                  key: '2',
                  children: <RelatedSKUs skuData={skuData} />,
                },

                {
                  label: 'All Linked Attributes',
                  key: '3',
                  children: <AttributeSKU skuData={skuData} />,
                },
              ]}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default SKUs;
