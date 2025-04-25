import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button, Spin, Popconfirm} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import type {FormInstance} from 'antd/es/form';

// --- Import Child Components ---
import SKUDetails from '../components/skus/SKUDetails';
import RelatedSKUs from '../components/skus/RelatedSKUs';
import AttributeSKU from '../components/skus/AttributeSKU';

// --- Import Services and Types ---
import {
  updateSkus,
  deleteSkus,
  getSkuItemById
} from '../services/SkusService';
import { showNotification } from '../services/DataService';
import type { SKuList, SkuRequestModel } from '../models/skusModel';
import type { ApiResponse } from '../models/generalModel';

const {TabPane} = Tabs;

const SKUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1'); // Antd Tabs use string keys
  const [loading, setLoading] = useState<boolean>(true);
  const [btnSaveLoading, setBtnSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [skuData, setSkuData] = useState<SKuList | null>(null);

  // State to hold the form instance from the SkuDetails child component
  const [skuDetailsFormInstance, setSkuDetailsFormInstance] = useState<FormInstance | null>(null);

  const navigate = useNavigate();

  // Callback to receive the form instance from the child
  const handleFormInstanceReady = useCallback((form: FormInstance) => {
    setSkuDetailsFormInstance(form);
  }, []);

  // --- Effects ---
  useEffect(() => {
    const itemNumFromSession = sessionStorage.getItem('itemNumber') || '145341';
    if (itemNumFromSession) {
      fetchSkuByItemNumber(itemNumFromSession);
    } else {
      showNotification('error', 'SKU Item Number not found. Please select an SKU.');
      setLoading(false);
      navigate('/home'); // Redirect if no identifier
    }
  }, [navigate]);

  // --- Data Fetching ---
  const fetchSkuByItemNumber = async (itemNum: string) => {
    setLoading(true);
    try {
      // Assuming getSkuItemById returns ApiResponse<SKuList[]>
      const response: ApiResponse<SKuList[]> = await getSkuItemById(itemNum);

      if (response.isSuccess && response.value && response.value.length > 0) {
        setSkuData(response.value[0]); // Assuming the API returns an array with one item
      } else {
        showNotification('error', response.exceptionInformation || 'Failed To Load SKU Data');
        setSkuData(null); // Ensure data is cleared on failure
        // Optionally navigate back if load fails critically
        // navigate('/home');
      }
    } catch (err: unknown) {
      console.error('Error fetching SKU:', err);
      if (err && typeof err === 'object' && 'error' in err && (err as { error?: { title?: string } }).error?.title) {
        showNotification('error', (err as { error?: { title?: string } }).error?.title || '');
      } else {
        showNotification('error', 'Something went wrong while fetching SKU data.');
      }
      setSkuData(null);
      // Optionally navigate back
      // navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  // --- Action Handlers ---
  const handleCancel = () => {
    navigate('/home');
    // props.onCancel?.(); // If parent needs notification
  };

  const handleDelete = async () => {
    if (!skuData?.akiSKUID) {
      // Use the internal ID if available, otherwise maybe itemNumber
      showNotification('error', 'Cannot delete: SKU ID is missing.');
      return;
    }
    setDeleteLoading(true);
    try {
      // Assuming deleteSkus takes the internal akiSKUID
      const response = await deleteSkus(skuData.akiSKUID);
      if (response.isSuccess) {
        showNotification('success', 'SKU Successfully Deleted');
        sessionStorage.removeItem('itemNumber');
        sessionStorage.removeItem('skuId'); // Also remove skuId if used
        navigate('/home');
        // props.onDeleteComplete?.();
      } else {
        showNotification('error', response.exceptionInformation || 'SKU Deletion Failed');
      }
    } catch (err: unknown) {
      console.error('Error deleting SKU:', err);
      if (err && typeof err === 'object' && 'error' in err && (err as { error?: { title?: string } }).error?.title) {
        showNotification('error', (err as { error?: { title?: string } }).error?.title || '');
      } else {
        showNotification('error', 'Something went wrong during deletion.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = async () => {
    if (!skuDetailsFormInstance) {
      showNotification('error', 'SKU details form is not ready.');
      return;
    }
    if (!skuData) {
      // Check if skuData exists before trying to save
      showNotification('error', 'SKU data is missing.');
      return;
    }

    try {
      // Validate the child form
      const values = await skuDetailsFormInstance.validateFields();

      // Get current form values (use validated values 'values' as base)
      const formData = values;

      // Apply transformations (clean data, set derived fields)
      // Assume dataService.cleanEmptyNullToString exists or implement similar logic
      const cleanData = (obj: Record<string, unknown>): SkuRequestModel => {
        // Build the cleaned object as a plain object, then cast to SkuRequestModel
        const cleaned: Record<string, unknown> = { ...obj };
        if (skuData) {
          cleaned.akiSKUID = skuData.akiSKUID;
          cleaned.akiProductID = skuData.akiProductID;
        }
        return cleaned as unknown as SkuRequestModel;
      };

      const cleanedPayload = cleanData(formData);

      // Set derived fields
      const isLayoutTemplateSet = !!cleanedPayload.akiLayoutTemplate;
      cleanedPayload.akiPrintLayoutTemp = isLayoutTemplateSet;

      // Remove fields not part of SkuRequestModel if necessary
      // delete (cleanedPayload as any).someExtraFormField;

      setBtnSaveLoading(true);
      const response = await updateSkus(cleanedPayload);

      if (response.isSuccess) {
        showNotification('success', 'SKU Details Updated Successfully');
        navigate('/home');
        // props.onSaveComplete?.();
      } else {
        showNotification('error', response.exceptionInformation || 'SKU Details Update Failed');
      }
    } catch (errorInfo: unknown) {
      console.log('Validation Failed:', errorInfo);
      if (
        errorInfo &&
        typeof errorInfo === 'object' &&
        'errorFields' in errorInfo &&
        Array.isArray((errorInfo as { errorFields?: unknown[] }).errorFields) &&
        ((errorInfo as { errorFields?: unknown[] }).errorFields?.length ?? 0) > 0
      ) {
        showNotification('error', 'Please fill in all required fields correctly.');
        setActiveTab('1');
      } else {
        showNotification('error', 'An unexpected error occurred during save.');
      }
    } finally {
      setBtnSaveLoading(false);
    }
  };

  // --- Tab Bar Extra Content (conditional rendering) ---
  const tabBarExtraContent =
    activeTab === '1' ? ( // Only show buttons on the first tab ('Sku')
      <div className="flex gap-x-3 mb-2 mr-4">
        <Button onClick={handleCancel}>Cancel</Button>
        <Popconfirm
          title="Are you sure delete this SKU?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
          placement="left"
          icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          disabled={!skuData} // Disable if no data loaded
        >
          <Button danger loading={deleteLoading} disabled={!skuData}>
            Delete
          </Button>
        </Popconfirm>
        <Button type="primary" loading={btnSaveLoading} onClick={handleSave} disabled={!skuData}>
          Save
        </Button>
      </div>
    ) : null; // No extra content on other tabs

  // --- Dynamic Label ---
  const getTabLabel = () => {
    switch (activeTab) {
      case '1':
        return 'Sku Form';
      case '2':
        return 'Related Skus';
      case '3':
        return 'All Linked Attributes';
      default:
        return 'Sku Editor';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md m-5 pb-4">
      {' '}
      {/* Added shadow */}
      <label className="block px-4 pt-3 mb-1 text-gray-700 text-lg font-medium">
        {' '}
        {/* Adjusted styling */}
        {getTabLabel()}
      </label>
      <Spin spinning={loading}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarExtraContent={tabBarExtraContent} className="sku-tabs">
          <TabPane tab="Sku" key="1">
            {/* Conditionally render SkuDetails only after data is loaded */}
            {skuData ? (
              <SKUDetails skuData={skuData} onFormInstanceReady={handleFormInstanceReady} />
            ) : (
              !loading && <div className="p-4 text-center text-gray-500">SKU data could not be loaded.</div>
            )}
          </TabPane>

          <TabPane tab="Related Skus" key="2" disabled={!skuData}>
            {' '}
            {/* Disable tab if no base SKU data */}
            {/* Pass necessary identifiers to RelatedSku */}
            {skuData && <RelatedSKUs skuData={skuData} />}
          </TabPane>

          <TabPane tab="All Linked Attributes" key="3" disabled={!skuData}>
            {' '}
            {/* Disable tab if no base SKU data */}
            {/* Pass necessary identifiers to AttributeSku */}
            {skuData && <AttributeSKU skuData={skuData} />}
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default SKUs;
