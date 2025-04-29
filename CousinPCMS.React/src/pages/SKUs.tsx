import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button, Spin} from 'antd';
import type {FormInstance} from 'antd/es/form';
import SKUDetails from '../components/skus/SKUDetails';
import RelatedSKUs from '../components/skus/RelatedSKUs';
import AttributeSKU from '../components/skus/AttributeSKU';
import {updateSkus, getSkuItemById} from '../services/SkusService';
import {useNotification} from '../contexts.ts/useNotification';
import type {SKuList, SkuRequestModel} from '../models/skusModel';
import type {ApiResponse} from '../models/generalModel';

const SKUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [btnSaveLoading, setBtnSaveLoading] = useState<boolean>(false);
  const [skuData, setSkuData] = useState<SKuList | null>(null);
  const [skuDetailsFormInstance, setSkuDetailsFormInstance] = useState<FormInstance | null>(null);
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
          notify.error(response.exceptionInformation || 'Failed To Load SKU Data');
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
    const itemNumFromSession = sessionStorage.getItem('itemNumber') || '145341';
    if (itemNumFromSession) {
      fetchSkuByItemNumber(itemNumFromSession);
    } else {
      notify.error('SKU Item Number not found. Please select an SKU.');
      setLoading(false);
      navigate('/home');
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
    if (!skuData) {
      notify.error('SKU data is missing.');
      return;
    }
    try {
      const values = await skuDetailsFormInstance.validateFields();
      const formData = values;
      const cleanData = (obj: Record<string, unknown>): SkuRequestModel => {
        const cleaned: Record<string, unknown> = {...obj};
        if (skuData) {
          cleaned.akiSKUID = skuData.akiSKUID;
          cleaned.akiProductID = skuData.akiProductID;
        }
        return cleaned as unknown as SkuRequestModel;
      };
      const cleanedPayload = cleanData(formData);
      const isLayoutTemplateSet = !!cleanedPayload.akiLayoutTemplate;
      cleanedPayload.akiPrintLayoutTemp = isLayoutTemplateSet;
      setBtnSaveLoading(true);
      const response = await updateSkus(cleanedPayload);
      if (response.isSuccess) {
        notify.success('SKU Details Updated Successfully');
        navigate('/home');
      } else {
        notify.error(response.exceptionInformation || 'SKU Details Update Failed');
      }
    } catch (errorInfo: unknown) {
      console.log('Validation Failed:', errorInfo);
      if (
        errorInfo &&
        typeof errorInfo === 'object' &&
        'errorFields' in errorInfo &&
        Array.isArray((errorInfo as {errorFields?: unknown[]}).errorFields) &&
        ((errorInfo as {errorFields?: unknown[]}).errorFields?.length ?? 0) > 0
      ) {
        notify.error('Please fill in all required fields correctly.');
        setActiveTab('1');
      } else {
        notify.error('An unexpected error occurred during save.');
      }
    } finally {
      setBtnSaveLoading(false);
    }
  };

  const tabBarExtraContent =
    activeTab === '1' ? (
      <div className="flex gap-x-3 mb-2 mr-4">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" loading={btnSaveLoading} onClick={handleSave} disabled={!skuData}>
          Save
        </Button>
      </div>
    ) : null;

  return (
    <>
      <Spin spinning={loading}>
        <div className="main-container">
          <div className="p-4 pb-1">
            <span className="text-sm font-medium">Sku Form</span>
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
