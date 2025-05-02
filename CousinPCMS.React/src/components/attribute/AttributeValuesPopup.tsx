import React, {useState, useEffect} from 'react';
import {Form, Input, Button} from 'antd';
import {addAttributesValues, updateAttributeValues} from '../../services/AttributesService';
import {useNotification} from '../../contexts.ts/useNotification';
import type {AttributeValuesRequestModel} from '../../models/attributesModel';
import {PlusOutlined} from '@ant-design/icons';

const {TextArea} = Input;

interface AttributesValuesProps {
  attributeName: string | null | undefined;
  onClose: (reason: 'save' | 'cancel') => void;
  valueData?: AttributeValueFormData | null;
}

interface AttributeValueFormData {
  attributeValue: string;
  attributeName: string;
  alternateValues?: string;
  newAlternateValue?: string;
  exitingAttributeValue?: string;
}

const AttributeValuesPopup: React.FC<AttributesValuesProps> = ({attributeName, onClose, valueData}) => {
  const [form] = Form.useForm<AttributeValueFormData>();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [alternateList, setAlternateList] = useState<string[]>([]);
  const notify = useNotification();

  useEffect(() => {
    if (valueData) {
      form.setFieldsValue({
        attributeName: valueData.attributeName,
        attributeValue: valueData.attributeValue,
        alternateValues: valueData.alternateValues,
        newAlternateValue: valueData.newAlternateValue,
        exitingAttributeValue: valueData.attributeValue,
      });
      if (valueData.alternateValues) {
        const arr = valueData.alternateValues
          .split(/,|\n/)
          .map((v) => v.trim())
          .filter(Boolean);
        setAlternateList(arr);
      }
    } else if (attributeName !== undefined && attributeName !== null) {
      form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
      form.setFieldsValue({
        attributeName: attributeName,
      });
      setAlternateList([]);
    } else {
      form.resetFields();
      setAlternateList([]);
    }
  }, [attributeName, valueData, form]);

  useEffect(() => {
    // Keep alternateValues field in sync with alternateList
    form.setFieldsValue({alternateValues: alternateList.join(', ')});
  }, [alternateList, form]);

  const cleanData = (rawData: Partial<AttributeValueFormData>): AttributeValuesRequestModel => {
    const cleaned: Partial<AttributeValuesRequestModel> = {};
    cleaned.attributeName = attributeName || '';
    cleaned.attributeValue = rawData.attributeValue ?? '';
    cleaned.alternateValues = alternateList.join(', ');
    cleaned.newAlternateValue = rawData.newAlternateValue ?? '';
    return cleaned as AttributeValuesRequestModel;
  };

  const handleAddAlternate = () => {
    const value = form.getFieldValue('newAlternateValue');
    if (value && !alternateList.includes(value.trim())) {
      setAlternateList([...alternateList, value.trim()]);
      form.setFieldsValue({newAlternateValue: ''});
    }
  };

  const handleRemoveAlternate = (val: string) => {
    setAlternateList(alternateList.filter((item) => item !== val));
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
        setAlternateList([]);
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

  const handleEdit = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const payload = cleanData(values);
      payload.attributeName = attributeName || '';
      const response = await updateAttributeValues(payload);

      if (response.isSuccess) {
        notify.success('Attribute Value added successfully.');
        form.resetFields(['attributeValue', 'alternateValues', 'newAlternateValue']);
        setAlternateList([]);
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
    setAlternateList([]);
    onClose('cancel');
  };

  return (
    <Form form={form} layout="vertical">
      <div className="grid grid-cols-1 px-3 py-1 gap-y-3">
        <Form.Item label="Attribute Name" name="attributeName" rules={[{required: true}]}>
          <Input readOnly disabled />
        </Form.Item>
        {valueData && valueData.attributeValue && (
          <Form.Item label="Existing Attribute Value" name="exitingAttributeValue">
            <Input disabled />
          </Form.Item>
        )}
        <Form.Item label="Attribute Value" name="attributeValue" rules={[{required: true, message: 'Attribute Value is required.'}]}>
          <Input placeholder="Enter the attribute value" />
        </Form.Item>
        <Form.Item label="New Alternate Value" name="newAlternateValue" tooltip="Enter a new alternate value to potentially add to the list below.">
          <Input
            placeholder="Enter a single new alternate value (optional)"
            onPressEnter={handleAddAlternate}
            suffix={<PlusOutlined style={{color: '#1890ff', cursor: 'pointer'}} onClick={handleAddAlternate} title="Add alternate value" />}
          />
        </Form.Item>
        {alternateList.length > 0 && (
          <Form.Item label="Alternate Values (Existing)" name="alternateValues" tooltip="List of existing alternate values, separated by commas or new lines (optional).">
            {/* {alternateList.length > 0 && ( */}
            <div className="mb-2 flex flex-wrap gap-2 px-1">
              {alternateList.map((val) => (
                <span key={val} className="bg-gray-200 rounded px-2 py-1 flex items-center text-xs">
                  {val}
                  <span style={{marginLeft: 6, color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleRemoveAlternate(val)} title="Remove">
                    ×
                  </span>
                </span>
              ))}
            </div>
            {/* )} */}
            <TextArea rows={3} placeholder="Existing alternate values..." value={alternateList.join(', ')} hidden />
          </Form.Item>
        )}
        <div className="flex justify-end gap-x-3 mt-5">
          <Button size="small" onClick={handleCancel}>
            Close
          </Button>
          {valueData && valueData.attributeValue ? (
            <Button size="small" type="primary" loading={btnLoading} onClick={handleEdit}>
              Update
            </Button>
          ) : (
            <Button size="small" type="primary" loading={btnLoading} onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

export default AttributeValuesPopup;
