import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  Upload,
  Modal,
  Spin,
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import type {FormInstance} from 'antd/es/form';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';

// --- Import Services, Types, Constants, Child Components ---
import {
  getLayoutTemplateList,
  getCompetitorDetails,
  getPriceGroupDetails,
  getPriceBreaksDetails,
  getPricingFormulasDetails,
  getSkuAttributesBycategoryId
} from '../../services/SkusService';
import { getCountryOrigin, getCommodityCodes, showNotification } from '../../services/DataService';
import type { Country } from '../../models/countryOriginModel';
import type { CommodityCode } from '../../models/commodityCodeModel';
import type { layoutSkus } from '../../models/layoutTemplateModel';
import type { CompetitorItem } from '../../models/competitorModel';
import type { ItemModel } from '../../models/itemModel';
import type { SKuList } from '../../models/skusModel';
import type { AttributeModel } from '../../models/attributeModel';
import type { ApiResponse } from '../../models/generalModel';
import { ItemCharLimit } from '../../models/char.constant';
import AttributeValuesPopup from '../../components/attribute/AttributeValuesPopup';

// --- Component Props ---
interface SkuDetailsProps {
  skuData: SKuList | null;
  onFormInstanceReady: (form: FormInstance<SKuList>) => void; // Callback to pass form instance up
}

// Interface matching the form structure (can be based on SKuList or a specific form model)
interface SkuFormValues extends SKuList {
  // Add any temporary/display fields if needed
  additionalImages?: string;
  urlLinks?: string;
}

const SKUDetails: React.FC<SkuDetailsProps> = ({skuData, onFormInstanceReady}) => {
  const [form] = Form.useForm<SkuFormValues>();
  const navigate = useNavigate();

  // --- State for Dropdowns ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<layoutSkus[]>([]);
  const [commodityCode, setCommodityCode] = useState<CommodityCode[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [priceGroupItem, setPriceGroupItem] = useState<ItemModel[]>([]);
  const [priceBreaks, setPriceBreaks] = useState<ItemModel[]>([]);
  const [pricingFormulas, setPricingFormulas] = useState<ItemModel[]>([]);

  // --- State for Attributes ---
  const [savedAttributes, setSavedAttributes] = useState<AttributeModel[]>([]);
  const [isLoadingAttributeNames, setIsLoadingAttributeNames] = useState<boolean>(false);
  const [isAttributeValueModalVisible, setIsAttributeValueModalVisible] = useState<boolean>(false);
  const [selectedAttributeForModal, setSelectedAttributeForModal] = useState<AttributeModel | null>(null);

  // --- Other State ---
  // const [loading, setLoading] = useState<boolean>(false); // General loading can be handled by parent

  const charLimit = ItemCharLimit;

  // Watch form values for char counts
  const skuName = Form.useWatch('skuName', form);
  const akiSKUDescription = Form.useWatch('akiSKUDescription', form);
  const akiManufacturerRef = Form.useWatch('akiManufacturerRef', form);
  const akiitemid = Form.useWatch('akiitemid', form); // Item Number
  const akiImageURL = Form.useWatch('akiImageURL', form);

  // --- Data Fetching Functions ---
  const fetchSkuAttributesByCategoryId = useCallback(async (categoryId: string | number) => {
    setIsLoadingAttributeNames(true);
    setSavedAttributes([]); // Clear previous attributes
    try {
      const response: ApiResponse<AttributeModel[]> = await getSkuAttributesBycategoryId(String(categoryId));
      if (response.isSuccess && response.value) {
        setSavedAttributes(response.value);
      } else if (!response.isSuccess && response.exceptionInformation) {
        showNotification('warning', response.exceptionInformation);
      }
      // Don't show error if it's just empty, but log or handle specific errors
      console.log(`No attributes found for category ${categoryId} or request failed.`);
    } catch (error) {
      console.error('Error fetching SKU attributes:', error);
      showNotification('error', 'Failed to load SKU attributes.');
    } finally {
      setIsLoadingAttributeNames(false);
    }
  }, []); // Dependencies can be added if skusService changes

  // --- Effects ---

  // Pass form instance up to parent
  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      // setLoading(true); // Optional: Set local loading state if needed
      try {
        // Use Promise.all for parallel fetching
        const [countryRes, commRes, layoutRes, compRes, pgRes, pbRes, pfRes] = await Promise.all([
          getCountryOrigin(),
          getCommodityCodes(),
          getLayoutTemplateList(),
          getCompetitorDetails(),
          getPriceGroupDetails(),
          getPriceBreaksDetails(),
          getPricingFormulasDetails(),
        ]);

        setCountries(countryRes || []);
        setCommodityCode(commRes || []);
        setLayoutOptions(layoutRes || []);
        setCompetitors(compRes || []);
        setPriceGroupItem(pgRes?.isSuccess ? pgRes.value : []);
        setPriceBreaks(pbRes?.isSuccess ? pbRes.value : []);
        setPricingFormulas(pfRes?.isSuccess ? pfRes.value : []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        showNotification('error', 'Failed to load some form options.');
      } finally {
        // setLoading(false);
      }
    };
    fetchDropdowns();
  }, []); // Empty dependency array runs once on mount

  // Effect to patch form when skuData prop changes & fetch attributes
  useEffect(() => {
    if (skuData) {
      form.resetFields(); // Reset fields before patching to clear previous data
      form.setFieldsValue({
        ...skuData,
        // Handle booleans explicitly to avoid issues with null/undefined
        akiObsolete: !!skuData.akiObsolete,
        akiWebActive: !!skuData.akiWebActive,
        akiCurrentlyPartRestricted: !!skuData.akiCurrentlyPartRestricted,
        akiSKUIsActive: !!skuData.akiSKUIsActive,
        // Populate disabled fields if counts are available in skuData
        additionalImages: String((skuData as { additionalImagesCount?: number }).additionalImagesCount || 0),
        urlLinks: String((skuData as { urlLinksCount?: number }).urlLinksCount || 0),
      });

      // Fetch attributes related to this SKU's category
      if (skuData.akiCategoryID) {
        fetchSkuAttributesByCategoryId(skuData.akiCategoryID);
      } else {
        setSavedAttributes([]); // Clear attributes if no category ID
      }
    } else {
      form.resetFields(); // Clear form if skuData is null
      setSavedAttributes([]);
    }
  }, [skuData, form, fetchSkuAttributesByCategoryId]); // Add fetchSkuAttributesByCategoryId to dependencies

  // --- Event Handlers ---
  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const file = info.file?.originFileObj;
    if (file) {
      form.setFieldsValue({akiImageURL: file.name}); // Set file name immediately
      // Handle upload status for feedback (implement actual upload)
      if (info.file.status === 'uploading') {
        console.log('Uploading...');
      } else if (info.file.status === 'done') {
        showNotification('success', `${info.file.name} file uploaded successfully (simulated)`);
        // Update with actual URL if upload service provides one:
        // form.setFieldsValue({ akiImageURL: info.file.response?.url || file.name });
      } else if (info.file.status === 'error') {
        showNotification('error', `${info.file.name} file upload failed.`);
      }
    } else if (info.file.status === 'removed') {
      form.setFieldsValue({akiImageURL: ''});
    }
  };

  const handleShowAttributeValueModal = (attribute: AttributeModel) => {
    setSelectedAttributeForModal(attribute);
    setIsAttributeValueModalVisible(true);
  };

  const handleAttributeValueModalClose = () => {
    setIsAttributeValueModalVisible(false);
    setSelectedAttributeForModal(null);
    // Optionally trigger a refetch or update if the modal could have changed data
    // relevant to this component (though likely not in this case)
  };

  const goToLinkMaintenance = () => {
    if (!skuData?.akiSKUID) return;
    // Pass SKU ID or Item Number if needed by the target route
    navigate(`/skus/link-maintenance`);
  };

  const goToAdditionalImage = () => {
    if (!skuData?.akiSKUID) return;
    // Pass SKU ID or Item Number if needed by the target route
    navigate(`/skus/additional-images`);
  };

  const goToUploadForm = () => {
    if (!savedAttributes || savedAttributes.length === 0) return;
    const attributeNames = savedAttributes.map((item) => item.attributeName);
    // Storing in session storage as per Angular example
    sessionStorage.setItem('attributeNames', JSON.stringify(attributeNames));
    // Pass SKU ID or Item Number if needed by the target route
    navigate(`/skus/attribute-multi-upload`);
  };

  // --- Render ---
  return (
    <div className="px-4 pt-1">
      {' '}
      {/* Removed pt-1 to match parent padding likely */}
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-0">
          {' '}
          {/* Reduced y-gap */}
          {/* Left Section */}
          <div className="lg:col-span-6 md:col-span-6">
            {/* IDs Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
              <Form.Item label="Sku Id" name="akiSKUID">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Product Id" name="akiProductID">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Category Id" name="akiCategoryID">
                <Input disabled />
              </Form.Item>
            </div>

            {/* Sku Name */}
            <Form.Item label="Sku Name" name="skuName" rules={[{required: true, message: 'SKU Name is required'}]}>
              <div className="relative">
                <Input maxLength={charLimit.skuName} className="pr-12" />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charLimit.skuName - (skuName?.length || 0)}</span>
              </div>
            </Form.Item>

            {/* Sku Description */}
            <Form.Item label="SKu Description" name="akiSKUDescription">
              <div className="relative">
                <Input.TextArea rows={3} maxLength={charLimit.akiSKUDescription} className="pr-12" />
                <span className="absolute bottom-2 right-2 text-gray-500 text-xs">{charLimit.akiSKUDescription - (akiSKUDescription?.length || 0)}</span>
              </div>
            </Form.Item>

            {/* Manufacturer Ref / Item Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <Form.Item label="Manufacturer Ref" name="akiManufacturerRef">
                <div className="relative">
                  <Input maxLength={charLimit.akiManufacturerRef} className="pr-12" />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charLimit.akiManufacturerRef - (akiManufacturerRef?.length || 0)}</span>
                </div>
              </Form.Item>
              <Form.Item label="Item Number" name="akiitemid">
                <div className="relative">
                  {/* Assuming Item Number might have length limit but isn't strictly number */}
                  <Input maxLength={charLimit.akiitemid} className="pr-12" />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">{charLimit.akiitemid - (String(akiitemid ?? '').length || 0)}</span>
                </div>
              </Form.Item>
            </div>

            {/* List Order & Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-2 items-end">
              <Form.Item label="List Order" name="akiListOrder">
                <InputNumber min={0} style={{width: '100%'}} />
              </Form.Item>
              {/* Checkboxes - wrap label text if needed */}
              <Form.Item name="akiObsolete" valuePropName="checked" className="mb-2 self-center">
                <Checkbox>Obsolete</Checkbox>
              </Form.Item>
              <Form.Item name="akiWebActive" valuePropName="checked" className="mb-2 self-center">
                <Checkbox>Web Active</Checkbox>
              </Form.Item>
              <Form.Item name="akiCurrentlyPartRestricted" valuePropName="checked" className="mb-2 self-center">
                <Checkbox>
                  <span className="text-xs leading-tight block">Part Restricted / Unavailable</span>
                </Checkbox>
              </Form.Item>
            </div>

            {/* Commodity Code / Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <Form.Item label="Commodity Code" name="akiCommodityCode">
                <Select
                  allowClear
                  showSearch
                  placeholder="Select code"
                  optionFilterProp="label"
                  options={commodityCode.map((c) => ({value: c.commodityCode, label: c.commodityCode, key: c.commodityCode}))}
                />
              </Form.Item>
              <Form.Item label="Country of Origin" name="akiCountryOfOrigin">
                <Select
                  allowClear
                  showSearch
                  placeholder="Select country"
                  optionFilterProp="label"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={countries.map((c) => ({value: c.code, label: c.name, key: c.code}))}
                />
              </Form.Item>
            </div>

            {/* Image URL / Upload / Additional Images Link */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-center">
              <Form.Item label="Image URL" name="akiImageURL" className="md:col-span-2" rules={[{type: 'url', message: 'Please enter a valid URL'}]}>
                <div className="flex items-center space-x-2 relative">
                  <Input maxLength={charLimit.akiImageURL} className="flex-grow pr-16" />
                  <Upload
                    // action="/your-upload-endpoint" // Replace
                    customRequest={(options) => setTimeout(() => options.onSuccess && options.onSuccess({}, options.file), 500)} // Mock
                    headers={{authorization: 'your-auth-token'}} // Replace
                    onChange={handleFileChange}
                    showUploadList={false}
                    accept=".png,.jpeg,.jpg"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                  <span className="text-gray-400 text-sm whitespace-nowrap absolute right-28 top-1/2 transform -translate-y-1/2">{charLimit.akiImageURL - (akiImageURL?.length || 0)}</span>
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <a onClick={goToAdditionalImage} className="underline cursor-pointer">
                    No of Additional Images
                  </a>
                }
                name="additionalImages"
              >
                <Input disabled />
              </Form.Item>
            </div>

            {/* Guide Price / Weight / URL Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-center">
              {/* Assuming TBC means To Be Confirmed - these might not be standard fields */}
              {/* Check SKuList model for actual field names */}
              <Form.Item label="Guide Price" name="akiGuidePriceTBC">
                <InputNumber min={0} step={0.01} precision={2} style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Guide Weight" name="akiGuideWeightTBC">
                <InputNumber min={0} step={0.01} precision={2} style={{width: '100%'}} />
              </Form.Item>
              <Form.Item
                label={
                  <a onClick={goToLinkMaintenance} className="underline cursor-pointer">
                    No of URL Links
                  </a>
                }
                name="urlLinks"
              >
                <Input disabled />
              </Form.Item>
            </div>

            {/* Attributes Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 mt-2">
              <div className="md:col-span-2">
                <Form.Item label="Attribute Names" className="mb-0">
                  <Spin spinning={isLoadingAttributeNames}>
                    <div className="border border-gray-300 rounded-lg p-2 min-h-[60px]">
                      {savedAttributes.length > 0 ? (
                        savedAttributes.map((attr) => (
                          <div key={attr.attributeName}>
                            <a onClick={() => handleShowAttributeValueModal(attr)} className="text-blue-600 hover:underline">
                              {attr.attributeName}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">{isLoadingAttributeNames ? 'Loading...' : 'No attributes found for this category.'}</span>
                      )}
                    </div>
                  </Spin>
                </Form.Item>
              </div>
              <div className="mt-auto mb-2 self-end">
                {' '}
                {/* Align button to bottom */}
                <Button
                  type="primary"
                  onClick={goToUploadForm}
                  disabled={isLoadingAttributeNames || savedAttributes.length === 0}
                  block // Make button full width of its column
                >
                  Attribute Multi Upload
                </Button>
              </div>
            </div>
          </div>{' '}
          {/* End Left Section */}
          {/* Right Section */}
          <div className="lg:col-span-5 md:col-span-6 lg:pl-10">
            {' '}
            {/* Adjusted padding */}
            {/* Catalogue Options */}
            <div className="mt-1">
              <label className="font-medium text-gray-700 block mb-1">Catalogue Options</label>
              <div className="border border-gray-300 rounded-lg p-3">
                <Form.Item name="akiSKUIsActive" valuePropName="checked" className="mb-3">
                  <Checkbox>Cat Active</Checkbox>
                </Form.Item>
                <Form.Item label="Layout Template" name="akiLayoutTemplate" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select layout"
                    optionFilterProp="label"
                    options={layoutOptions.map((opt) => ({value: opt.templateCode, label: opt.layoutDescription, key: opt.templateCode}))}
                  />
                </Form.Item>
                <Form.Item label="Alternative Title" name="akiAlternativeTitle" className="mb-0">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </div>
            </div>
            {/* Price Details */}
            <div className="mt-4">
              {' '}
              {/* Increased top margin */}
              <label className="font-medium text-gray-700 block mb-1">Price Details</label>
              <div className="border border-gray-300 rounded-lg p-3">
                <div className="grid grid-cols-1 gap-y-3">
                  {' '}
                  {/* Increased vertical gap */}
                  <Form.Item label="Price Formula" name="akiPricingFormula" className="mb-0">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select formula"
                      optionFilterProp="label"
                      options={pricingFormulas.map((opt) => ({value: opt.code, label: opt.description, key: opt.code}))}
                    />
                  </Form.Item>
                  <Form.Item label="Competitors" name="akiCompetitors" className="mb-0">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select competitor"
                      optionFilterProp="label"
                      options={competitors.map((opt) => ({value: opt.akiCompetitorID, label: opt.akiCompetitorName, key: opt.akiCompetitorID}))}
                    />
                  </Form.Item>
                  <Form.Item label="Price Break" name="akiPriceBreak" className="mb-0">
                    <Select allowClear showSearch placeholder="Select break" optionFilterProp="label" options={priceBreaks.map((opt) => ({value: opt.code, label: opt.description, key: opt.code}))} />
                  </Form.Item>
                  <Form.Item label="Price Group" name="akiPriceGroup" className="mb-0">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select group"
                      optionFilterProp="label"
                      options={priceGroupItem.map((opt) => ({value: opt.code, label: opt.description, key: opt.code}))}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>{' '}
          {/* End Right Section */}
        </div>{' '}
        {/* End Main Grid */}
      </Form>
      {/* Modal for Attribute Values */}
      <Modal
        title={`Attribute Values for: ${selectedAttributeForModal?.attributeName || ''}`}
        visible={isAttributeValueModalVisible}
        onCancel={handleAttributeValueModalClose}
        footer={null} // Footer likely handled within AttributesValues component
        width={600} // Or adjust as needed
        destroyOnClose // Good practice for modals containing forms/state
        maskClosable={false} // Prevent closing by clicking outside if needed
      >
        {selectedAttributeForModal && skuData && (
          <AttributeValuesPopup
            attributeName={selectedAttributeForModal.attributeName}
            // Pass other necessary identifiers like skuId or itemNumber
            skuId={skuData.akiSKUID}
            itemNumber={skuData.akiitemid}
            onClose={handleAttributeValueModalClose} // Pass close handler
            // onSave={handleAttributeValueModalClose} // Could also trigger close on save
          />
        )}
      </Modal>
    </div>
  );
};

export default SKUDetails;
