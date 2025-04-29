import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button} from 'antd';
import ProductDetails from '../components/product/ProductDetails';
import {useNotification} from '../contexts.ts/useNotification';
import SKUsList from '../components/product/SKUsList';

const Product: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loading] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotification();

  useEffect(() => {
    const productIdFromSession = sessionStorage.getItem('productId');
    if (productIdFromSession) {
      console.log(`Product ID from session: ${productIdFromSession}`);
    } else {
      navigate('/home');
    }
  }, [navigate, notify]);

  const handleCancel = () => {
    navigate('/home');
  };

  const handleSave = () => {
    notify.info('Save functionality is not implemented in this component.');
  };

  const tabBarExtraContent = (
    <div className="flex gap-x-3 mb-2 mr-4">
      <Button onClick={handleCancel}>Cancel</Button>
      <Button type="primary" loading={loading} onClick={handleSave}>
        Save
      </Button>
    </div>
  );

  return (
    <div className="main-container">
      <div className="p-4 pb-1">
        <span className="text-sm font-medium">Product Form</span>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={tabBarExtraContent}
          className="product-tabs"
          items={[
            {
              label: 'Product Details',
              key: '1',
              children: <ProductDetails />,
            },
            {
              label: 'SKUs',
              key: '2',
              children: <SKUsList />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Product;
