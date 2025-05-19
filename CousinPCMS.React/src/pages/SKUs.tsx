import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button, Spin} from 'antd';
import type {FormInstance} from 'antd/es/form';
import SKUDetails from '../components/skus/SKUDetails';
import RelatedSKUs from '../components/skus/RelatedSKUs';
import AttributeSKU from '../components/skus/AttributeSKU';
import {updateSkus, getSkuItemById, addSkus} from '../services/SkusService';
import {useNotification} from '../hook/useNotification';
import type {SKuList, SkuRequestModel} from '../models/skusModel';
import type {ApiResponse} from '../models/generalModel';
import {cleanEmptyNullToString, extractUserMessage, getSessionItem} from '../services/DataService';

const SKUs = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [btnSaveLoading, setBtnSaveLoading] = useState<boolean>(false);
  const [skuData, setSkuData] = useState<SKuList | null>(null);
  const [skuDetailsFormInstance, setSkuDetailsFormInstance] = useState<FormInstance | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [checkIdValue, setCheckIdValue] = useState<boolean>(false);
  const [checkIdValueMsg, setCheckIdValueMsg] = useState<string>('');
  const navigate = useNavigate();
  const notify = useNotification();
  const [formChanged, setFormChanged] = useState(false);

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
    const hasRealIds = getSessionItem('CategoryId') || getSessionItem('productId');
    const hasTempIds = getSessionItem('tempCategoryId') || getSessionItem('tempProductId');
    if (!hasRealIds && !hasTempIds) {
      setCheckIdValueMsg('Select respective category and product to view SKUs');
      setCheckIdValue(true);
      setLoading(false);
      return;
    }
    if (location.pathname === '/skus/add') {
      setLoading(false);
      return;
    }

    const itemNumFromSession = getSessionItem('itemNumber') || getSessionItem('tempItemNumber');
    if (itemNumFromSession) {
      setIsEdit(true);
      fetchSkuByItemNumber(itemNumFromSession);
    } else {
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
      const akiPriceBreaks = values?.akiPriceBreak ? true : false;
      const req: SkuRequestModel = {
        ...skusData,
        akiPriceBreaks,
      };
      delete req.additionalImagesCount;
      delete req.urlLinksCount;
      try {
        setBtnSaveLoading(true);
        if (isEdit) {
          const response = await updateSkus(req);
          if (response.isSuccess) {
            notify.success('SKU Details Updated Successfully');
            setFormChanged(false);
            // navigate('/home');
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
            // notify.error('SKU Details Update Failed');
          }
          setBtnSaveLoading(false);
        } else {
          const response = await addSkus(req);
          if (response.isSuccess) {
            if (Number(response.value) && Number(response.value) > 0) {
              skuDetailsFormInstance.setFieldValue('akiSKUID', response.value);
              setIsEdit(true);
              setFormChanged(false);
              notify.success('SKU Details Added Successfully');
            } else {
              const raw = response?.value || 'Unknown error';
              const userMsg = extractUserMessage(raw);
              notify.error(userMsg);
              notify.error('SKU Details Added Failed');
            }
          } else {
            const raw = response?.value || 'Unknown error';
            const userMsg = extractUserMessage(raw);
            notify.error(userMsg);
            // notify.error('SKU Details Added Failed');
          }
          setBtnSaveLoading(false);
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
        <Button size="small" type="primary" loading={btnSaveLoading} onClick={handleSave} disabled={checkIdValue || (isEdit && !formChanged)}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      )}
    </div>
  );

  const tabItems = [
    {
      label: 'Sku',
      key: '1',
      children: <SKUDetails skuData={skuData} onFormInstanceReady={handleFormInstanceReady} onFormChange={setFormChanged} />,
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
  ];

  return (
    <>
      <Spin spinning={loading}>
        <div className="main-container pt-2">
          <div className="px-4 text-sm font-medium flex gap-x-3">
            Sku Form <span>{checkIdValue && <div className="text-red-500">{checkIdValueMsg !== '' && <span>({checkIdValueMsg})</span>}</div>}</span>
          </div>

          <div className="pb-1">
            <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarExtraContent={tabBarExtraContent} className="product-tabs" items={tabItems} />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default SKUs;
