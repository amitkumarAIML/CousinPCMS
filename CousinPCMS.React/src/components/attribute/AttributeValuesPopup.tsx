import React, {useState, useEffect} from 'react';
import { Form, Input, Button } from 'antd';
import { addAttributesValues } from '../../services/AttributesService';
import { showNotification } from '../../services/DataService';
import type { AttributeValuesRequestModel } from '../../models/attributesModel';

const {TextArea} = Input;

// --- Component Props ---
interface AttributesValuesProps {
  attributeName: string | null | undefined;
  onClose: (reason: 'save' | 'cancel') => void;
  skuId?: number | string;
  itemNumber?: string | number;
}

// Interface for form values
interface AttributeValueFormData {
  attributeValue: string;
  attributeName: string;
  alternateValues?: string; // Optional based on textarea usage
  newAlternateValue?: string; // Optional new value field
}

const AttributeValuesPopup: React.FC<AttributesValuesProps> = ({attributeName, onClose, skuId, itemNumber}) => {
  const [form] = Form.useForm<AttributeValueFormData>();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // --- Effects ---
  useEffect(() => {
    // When attributeName prop changes, update the form field
    if (attributeName !== undefined && attributeName !== null) {
      // Reset other fields when the attribute name changes to avoid stale data
      form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
      form.setFieldsValue({
        attributeName: attributeName,
      });
    } else {
      // Clear the form if attributeName becomes null/undefined
      form.resetFields();
    }
  }, [attributeName, form]);

  // --- Utility Function ---
  // Simple data cleaner (adjust based on exact requirements)
  const cleanData = (rawData: Partial<AttributeValueFormData>): AttributeValuesRequestModel => {
    const cleaned: Partial<AttributeValuesRequestModel> = {};
    for (const key in rawData) {
      // Basic clean: remove null, undefined, empty strings
      // Keep required fields even if technically empty if API expects them
      // Use type assertion to access keys safely and cast to string, but only assign if key exists in cleaned
      if (key in cleaned) {
        (cleaned as Record<string, unknown>)[key] = String((rawData as Record<string, unknown>)[key] ?? '');
      }
    }
    // Ensure required fields are present even if cleaned out (should be caught by validation though)
    if (!cleaned.attributeName) cleaned.attributeName = attributeName || ''; // Use prop value if form value missing
    if (!cleaned.attributeValue) cleaned.attributeValue = '';

    // Type assertion - ensure the final object matches the request model
    return cleaned as AttributeValuesRequestModel;
  };

  // --- Event Handlers ---
  const handleSave = async () => {
    setBtnLoading(true);
    try {
      // Validate form fields
      const values = await form.validateFields();

      // Clean the data before sending
      const payload = cleanData(values);
      // Ensure attributeName is correctly set from prop if form field was disabled/readOnly
      payload.attributeName = attributeName || '';

      // Call the API service
      const response = await addAttributesValues(payload);

      if (response.isSuccess) {
        showNotification('success', 'Attribute Value added successfully.');
        form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']); // Reset only value fields
        onClose('save'); // Notify parent of success/closure
      } else {
        showNotification('error', response.exceptionInformation || 'Attribute Value Failed To Add');
      }
    } catch (errorInfo) {
      if (
        typeof errorInfo === 'object' &&
        errorInfo !== null &&
        'errorFields' in errorInfo &&
        Array.isArray((errorInfo as { errorFields?: unknown[] }).errorFields)
      ) {
        showNotification('error', 'Please fill in all required fields.');
      } else if (
        typeof errorInfo === 'object' &&
        errorInfo !== null &&
        'error' in errorInfo &&
        (errorInfo as { error?: { title?: string } }).error !== undefined &&
        (errorInfo as { error?: { title?: string } }).error?.title
      ) {
        showNotification('error', (errorInfo as { error?: { title?: string } }).error?.title || '');
      } else {
        showNotification('error', 'Failed to submit attribute value.');
      }
      console.log('Validation Failed:', errorInfo);
      // Antd automatically highlights fields with errors
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']); // Reset only value fields
    onClose('cancel'); // Notify parent of cancellation/closure
  };

  // --- Render ---
  return (
    // No outer div needed if rendered directly in Modal content
    <Form form={form} layout="vertical">
      <div className="grid grid-cols-1 px-3 py-1 gap-y-3">
        {' '}
        {/* Adjusted gap */}
        <Form.Item
          label="Attribute Name"
          name="attributeName"
          rules={[{required: true}]} // Keep validation rule even if readOnly
        >
          <Input readOnly />
          {/* Or display as text: <span className="ant-form-text">{attributeName}</span> */}
        </Form.Item>
        {/* Attribute Value Group Id - Removed as it wasn't in the Angular form group */}
        {/* <Form.Item label="Attribute Value Group Id">
                    <Input placeholder="Not currently used" disabled />
                </Form.Item> */}
        <Form.Item label="Attribute Value" name="attributeValue" rules={[{required: true, message: 'Attribute Value is required.'}]}>
          <Input placeholder="Enter the attribute value" />
        </Form.Item>
        <Form.Item
          label="New Alternate Value"
          name="newAlternateValue"
          tooltip="Enter a new alternate value to potentially add to the list below." // Example tooltip
        >
          <Input placeholder="Enter a single new alternate value (optional)" />
        </Form.Item>
        <Form.Item
          label="Alternate Values (Existing)"
          name="alternateValues"
          tooltip="List of existing alternate values, separated by commas or new lines (optional)." // Example tooltip
        >
          <TextArea rows={3} placeholder="Existing alternate values..." />
        </Form.Item>
        {/* Action Buttons */}
        <div className="flex justify-end gap-x-3 mt-5">
          {' '}
          {/* Use gap-x for horizontal spacing */}
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" loading={btnLoading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AttributeValuesPopup;
