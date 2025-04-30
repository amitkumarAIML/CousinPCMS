import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {Form, Input, InputNumber, Select, Checkbox, Button, Upload, Modal, Spin} from 'antd';
import type {FormInstance} from 'antd/es/form';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import {getLayoutTemplateList, getCompetitorDetails, getPriceGroupDetails, getPriceBreaksDetails, getPricingFormulasDetails, getSkuAttributesBycategoryId} from '../../services/SkusService';
import {getCountryOrigin, getCommodityCodes} from '../../services/DataService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {Country} from '../../models/countryOriginModel';
import type {CommodityCode} from '../../models/commodityCodeModel';
import type {layoutSkus} from '../../models/layoutTemplateModel';
import type {CompetitorItem} from '../../models/competitorModel';
import type {ItemModel} from '../../models/itemModel';
import type {SKuList} from '../../models/skusModel';
import type {AttributeModel} from '../../models/attributeModel';
import type {ApiResponse} from '../../models/generalModel';
import {ItemCharLimit} from '../../models/char.constant';
import AttributeValuesPopup from '../../components/attribute/AttributeValuesPopup';
interface SkuDetailsProps {
  skuData?: SKuList | null;
  onFormInstanceReady: (form: FormInstance<SKuList>) => void;
}

interface SkuFormValues extends SKuList {
  additionalImages?: string;
  urlLinks?: string;
}

const SKUDetails: React.FC<SkuDetailsProps> = ({skuData, onFormInstanceReady}) => {
  const [form] = Form.useForm<SkuFormValues>();
  const navigate = useNavigate();

  const [countries, setCountries] = useState<Country[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<layoutSkus[]>([]);
  const [commodityCode, setCommodityCode] = useState<CommodityCode[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [priceGroupItem, setPriceGroupItem] = useState<ItemModel[]>([]);
  const [priceBreaks, setPriceBreaks] = useState<ItemModel[]>([]);
  const [pricingFormulas, setPricingFormulas] = useState<ItemModel[]>([]);

  const [savedAttributes, setSavedAttributes] = useState<AttributeModel[]>([]);
  const [isLoadingAttributeNames, setIsLoadingAttributeNames] = useState<boolean>(false);
  const [isAttributeValueModalVisible, setIsAttributeValueModalVisible] = useState<boolean>(false);
  const [selectedAttributeForModal, setSelectedAttributeForModal] = useState<AttributeModel | null>(null);

  const charLimit = ItemCharLimit;

  const skuName = Form.useWatch('skuName', form);
  const akiSKUDescription = Form.useWatch('akiSKUDescription', form);
  const akiManufacturerRef = Form.useWatch('akiManufacturerRef', form);
  const akiitemid = Form.useWatch('akiitemid', form);
  const akiImageURL = Form.useWatch('akiImageURL', form);
  const notify = useNotification();
  const fetchSkuAttributesByCategoryId = useCallback(
    async (categoryId: string | number) => {
      setIsLoadingAttributeNames(true);
      setSavedAttributes([]);
      try {
        const response: ApiResponse<AttributeModel[]> = await getSkuAttributesBycategoryId(String(categoryId));
        if (response.isSuccess && response.value) {
          setSavedAttributes(response.value);
        } else if (!response.isSuccess && response.exceptionInformation) {
          notify.warning(String(response.exceptionInformation));
        }
      } catch (error) {
        console.error('Error fetching SKU attributes:', error);
        notify.error('Failed to load SKU attributes.');
      } finally {
        setIsLoadingAttributeNames(false);
      }
    },
    [notify]
  );
  const defaultValue = {
    akiGuidePriceTBC: 0,
    akiGuideWeightTBC: 0,
    akiListOrder: 0,
    akiObsolete: false,
    akiSKUIsActive: false,
    akiWebActive: false,
    akiCurrentlyPartRestricted: false,
    akiSKUDescription: '',
    akiPricingFormula: '',
    akiPriceGroup: '',
    akiPriceBreak: '',
    akiManufacturerRef: '',
    akiImageURL: '',
    akiCompetitors: '',
    akiCommodityCode: '',
    akiAlternativeTitle: '',
  };

  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
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
        setPriceGroupItem(pgRes?.isSuccess ? (pgRes.value && pgRes.value.length > 0 ? pgRes.value : []) : []);
        setPriceBreaks(pbRes?.isSuccess ? (pbRes.value && pbRes.value.length > 0 ? pbRes.value : []) : []);
        setPricingFormulas(pfRes?.isSuccess ? (pfRes.value && pfRes.value.length > 0 ? pfRes.value : []) : []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        notify.error('Failed to load some form options.');
      }
    };
    fetchDropdowns();
    if (location.pathname === '/skus/add') {
      form.setFieldValue('akiCategoryID', sessionStorage.getItem('CategoryId') || '0');
      form.setFieldValue('akiProductID', sessionStorage.getItem('productId') || '0');
      form.setFieldValue('akiSKUID', '0');
      form.setFieldValue('akiitemid', '0');
      console.log('SKU Add page loaded', form.getFieldsValue());
      return;
    }
    if (skuData) {
      form.resetFields();
      form.setFieldsValue({
        ...skuData,
        akiObsolete: !!skuData.akiObsolete,
        akiWebActive: !!skuData.akiWebActive,
        akiCurrentlyPartRestricted: !!skuData.akiCurrentlyPartRestricted,
        akiSKUIsActive: !!skuData.akiSKUIsActive,
        additionalImages: String((skuData as {additionalImagesCount?: number}).additionalImagesCount || 0),
        urlLinks: String((skuData as {urlLinksCount?: number}).urlLinksCount || 0),
      });
      if (skuData.akiCategoryID) {
        fetchSkuAttributesByCategoryId(skuData.akiCategoryID);
      } else {
        setSavedAttributes([]);
      }
    } else {
      form.resetFields();
      setSavedAttributes([]);
    }
  }, [notify, form, fetchSkuAttributesByCategoryId, skuData]);

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const file = info.file?.originFileObj;
    if (file) {
      form.setFieldsValue({akiImageURL: file.name});
      if (info.file.status === 'done') {
        notify.success(`${info.file.name} file uploaded successfully (simulated)`);
      } else if (info.file.status === 'error') {
        notify.error(`${info.file.name} file upload failed.`);
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
  };

  const goToLinkMaintenance = () => {
    if (!skuData?.akiSKUID) return;
    navigate(`/SKUs/link-maintenance`);
  };

  const goToAdditionalImage = () => {
    if (!skuData?.akiSKUID) return;
    navigate(`/SKUs/additional-images`);
  };

  const goToUploadForm = () => {
    if (!savedAttributes || savedAttributes.length === 0) return;
    const attributeNames = savedAttributes.map((item) => item.attributeName);
    sessionStorage.setItem('attributeNames', JSON.stringify(attributeNames));
    navigate(`/skus/attribute-multi-upload`);
  };

  return (
    <div>
      <Form form={form} layout="vertical" initialValues={defaultValue}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-0">
          <div className="lg:col-span-6 md:col-span-6">
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

            <div className="relative">
              <Form.Item label="Sku Name" name="skuName" rules={[{required: true, message: 'SKU Name is required'}]}>
                <Input maxLength={charLimit.skuName} />
              </Form.Item>
              <span className="absolute -right-12 top-7 transform -translate-y-1/2  ">
                {skuName?.length || 0} / {charLimit.skuName}
              </span>
            </div>

            <div className="relative">
              <Form.Item label="SKu Description" name="akiSKUDescription">
                <Input.TextArea rows={3} maxLength={charLimit.akiSKUDescription} />
              </Form.Item>
              <span className="absolute bottom-2 -right-12">
                {akiSKUDescription?.length || 0} / {charLimit.akiSKUDescription}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className=" col-span-1 flex items-end gap-x-2">
                <Form.Item className="w-full" label="Manufacturer Ref" name="akiManufacturerRef">
                  <Input maxLength={charLimit.akiManufacturerRef} />
                </Form.Item>
                <span className="whitespace-nowrap">
                  {akiManufacturerRef?.length || 0} / {charLimit.akiManufacturerRef}
                </span>
              </div>
              <div className=" col-span-1 flex items-end gap-x-2">
                <Form.Item className="w-full" label="Item Number" name="akiitemid">
                  <Input maxLength={charLimit.akiitemid} />
                </Form.Item>
                <span className="whitespace-nowrap">
                  {String(akiitemid ?? '').length || 0} / {charLimit.akiitemid}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 items-end">
              <div className="col-span-1">
                <Form.Item className="col-span-2" label="List Order" name="akiListOrder">
                  <InputNumber min={0} style={{width: '100%'}} />
                </Form.Item>
              </div>
              <div className="col-span-1 flex items-end justify-between gap-x-2">
                <Form.Item name="akiObsolete" valuePropName="checked">
                  <Checkbox>Obsolete</Checkbox>
                </Form.Item>
                <Form.Item name="akiWebActive" valuePropName="checked">
                  <Checkbox>Web Active</Checkbox>
                </Form.Item>
                <Form.Item name="akiCurrentlyPartRestricted" valuePropName="checked">
                  <Checkbox>Part Restricted / Unavailable</Checkbox>
                </Form.Item>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 items-center">
              <div className="flex items-end space-x-2 col-span-2 ">
                <Form.Item label="Image URL" name="akiImageURL" className="w-full" rules={[{type: 'url', message: 'Please enter a valid URL'}]}>
                  <Input maxLength={charLimit.akiImageURL} />
                </Form.Item>
                <Upload
                  customRequest={(options) => setTimeout(() => options.onSuccess && options.onSuccess({}, options.file), 500)}
                  headers={{authorization: 'your-auth-token'}}
                  onChange={handleFileChange}
                  showUploadList={false}
                  accept=".png,.jpeg,.jpg"
                >
                  <Button type="primary">Upload</Button>
                </Upload>
                <span className=" whitespace-nowrap ">
                  {akiImageURL?.length || 0} / {charLimit.akiImageURL}
                </span>
              </div>
              <div className="col-span-1">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-center">
              <Form.Item label="Guide Price" name="akiGuidePriceTBC">
                <InputNumber min={0} style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Guide Weight" name="akiGuideWeightTBC">
                <InputNumber min={0} style={{width: '100%'}} />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 mt-2">
              <div className="md:col-span-2">
                <Form.Item label="Attribute Names" className="mb-0">
                  <Spin spinning={isLoadingAttributeNames}>
                    <div className="border border-border rounded-lg p-2 min-h-[60px]">
                      {savedAttributes.length > 0 ? (
                        savedAttributes.map((attr) => (
                          <div key={attr.attributeName}>
                            <a onClick={() => handleShowAttributeValueModal(attr)} className="text-primary-theme hover:underline">
                              {attr.attributeName}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className=" text-sm italic">{isLoadingAttributeNames ? 'Loading...' : 'No attributes found for this category.'}</span>
                      )}
                    </div>
                  </Spin>
                </Form.Item>
              </div>
              <div className="mt-auto mb-2 self-end">
                <Button type="primary" onClick={goToUploadForm} disabled={isLoadingAttributeNames || savedAttributes.length === 0} block>
                  Attribute Multi Upload
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 md:col-span-6 lg:pl-10">
            <div className="mt-1">
              <label className="font-medium text-p block mb-1">Catalogue Options</label>
              <div className="border border-border rounded-lg p-3">
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
            <div className="mt-4">
              <label className="font-medium text-primary-font block mb-1">Price Details</label>
              <div className="border border-border rounded-lg p-3">
                <div className="grid grid-cols-1 gap-y-3">
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
          </div>
        </div>
      </Form>
      <Modal
        title={`Attribute Values for: ${selectedAttributeForModal?.attributeName || ''}`}
        open={isAttributeValueModalVisible}
        onCancel={handleAttributeValueModalClose}
        footer={null}
        width={600}
        destroyOnClose
        maskClosable={false}
      >
        {selectedAttributeForModal && skuData && (
          <AttributeValuesPopup attributeName={selectedAttributeForModal.attributeName} skuId={skuData.akiSKUID} itemNumber={skuData.akiitemid} onClose={handleAttributeValueModalClose} />
        )}
      </Modal>
    </div>
  );
};

export default SKUDetails;
