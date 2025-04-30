import React, {useState, useEffect} from 'react';
import {Form, Input, Button} from 'antd';
import {addAttributesValues} from '../../services/AttributesService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {AttributeValuesRequestModel} from '../../models/attributesModel';

const {TextArea} = Input;

interface AttributesValuesProps {
  attributeName: string | null | undefined;
  skuId: number;
  itemNumber: string;
  onClose: (reason: 'save' | 'cancel') => void;
  valueData?: AttributeValueFormData | null;
}

interface AttributeValueFormData {
  attributeValue: string;
  attributeName: string;
  alternateValues?: string;
  newAlternateValue?: string;
}

const AttributeValuesPopup: React.FC<AttributesValuesProps> = ({attributeName, onClose, valueData}) => {
  const [form] = Form.useForm<AttributeValueFormData>();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const notify = useNotification();

  useEffect(() => {
    if (valueData) {
      form.setFieldsValue({
        attributeName: valueData.attributeName,
        attributeValue: valueData.attributeValue,
        alternateValues: valueData.alternateValues,
        newAlternateValue: valueData.newAlternateValue,
      });
    } else if (attributeName !== undefined && attributeName !== null) {
      form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
      form.setFieldsValue({
        attributeName: attributeName,
      });
    } else {
      form.resetFields();
    }
  }, [attributeName, valueData, form]);

  const cleanData = (rawData: Partial<AttributeValueFormData>): AttributeValuesRequestModel => {
    const cleaned: Partial<AttributeValuesRequestModel> = {};
    cleaned.attributeName = attributeName || '';
    cleaned.attributeValue = rawData.attributeValue ?? '';
    cleaned.alternateValues = rawData.alternateValues ?? '';
    cleaned.newAlternateValue = rawData.newAlternateValue ?? '';
    return cleaned as AttributeValuesRequestModel;
  };

  const handleSave = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const payload = cleanData(values);
      payload.attributeName = attributeName || '';
      const response = await addAttributesValues(payload);

      if (response.isSuccess) {
        notify.success('Attribute Value added successfully.');
        form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
        onClose('save');
      } else {
        notify.error('Attribute Value Failed To Add');
      }
    } catch (errorInfo) {
      if (typeof errorInfo === 'object' && errorInfo !== null && 'errorFields' in errorInfo && Array.isArray((errorInfo as {errorFields?: unknown[]}).errorFields)) {
        notify.error('Please fill in all required fields.');
      } else if (
        typeof errorInfo === 'object' &&
        errorInfo !== null &&
        'error' in errorInfo &&
        (errorInfo as {error?: {title?: string}}).error !== undefined &&
        (errorInfo as {error?: {title?: string}}).error?.title
      ) {
        notify.error((errorInfo as {error?: {title?: string}}).error?.title || '');
      } else {
        notify.error('Failed to submit attribute value.');
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
    onClose('cancel');
  };

  return (
    <Form form={form} layout="vertical">
      <div className="grid grid-cols-1 px-3 py-1 gap-y-3">
        <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true}]}>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item label="Attribute Value" name="attributeValue" rules={[{required: true, message: 'Attribute Value is required.'}]}>
          <Input placeholder="Enter the attribute value" />
        </Form.Item>
        <Form.Item label="New Alternate Value" name="newAlternateValue" tooltip="Enter a new alternate value to potentially add to the list below.">
          <Input placeholder="Enter a single new alternate value (optional)" />
        </Form.Item>
        <Form.Item label="Alternate Values (Existing)" name="alternateValues" tooltip="List of existing alternate values, separated by commas or new lines (optional).">
          <TextArea rows={3} placeholder="Existing alternate values..." />
        </Form.Item>
        <div className="flex justify-end gap-x-3 mt-5">
          <Button onClick={handleCancel}>Close</Button>
          <Button type="primary" loading={btnLoading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AttributeValuesPopup;
