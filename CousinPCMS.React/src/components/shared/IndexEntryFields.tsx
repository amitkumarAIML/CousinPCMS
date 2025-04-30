import React, {useState, useEffect} from 'react';
import {Form, Input, Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

interface IndexEntryFieldsProps {
  form: any;
  fieldPrefix: string; // e.g., 'akiProductIndexText' or 'akiCategoryIndex'
  labelPrefix?: string; // e.g., 'Index Entry'
  max?: number;
}

const IndexEntryFields: React.FC<IndexEntryFieldsProps> = ({form, fieldPrefix, labelPrefix = 'Index Entry', max = 5}) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    for (let i = max; i > 1; i--) {
      if (form.getFieldValue(`${fieldPrefix}${i}`)) {
        setCount(i);
        break;
      }
    }
  }, [form, fieldPrefix, max]);

  const handleAdd = () => {
    if (count < max) setCount(count + 1);
  };

  return (
    <div className="grid grid-cols-1">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          <Form.Item label={`${labelPrefix} ${i + 1}`} name={`${fieldPrefix}${i + 1}`} className="mb-1 flex-1" style={{marginBottom: 0, flex: 1}}>
            <Input />
          </Form.Item>
          {i === count - 1 && count < max && <Button className="float-right mt-2" type="primary" icon={<PlusOutlined />} onClick={handleAdd} aria-label={`Add ${labelPrefix}`} />}
        </div>
      ))}
    </div>
  );
};

export default IndexEntryFields;
