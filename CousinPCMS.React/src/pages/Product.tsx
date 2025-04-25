import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button, Popconfirm} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import ProductDetails from '../components/product/ProductDetails';
import {deleteProduct} from '../services/ProductService';
import {showNotification} from '../services/DataService';
import SKUsList from '../components/product/SKUsList';

const Product: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const productIdFromSession = sessionStorage.getItem('productId');
    if (productIdFromSession) {
      setProductId(productIdFromSession);
    } else {
      showNotification('error', 'Product ID not found. Please select a product.');
      navigate('/home');
    }
  }, [navigate]);

  const handleCancel = () => {
    navigate('/home');
  };

  const handleDelete = async () => {
    if (!productId) {
      showNotification('error', 'Product ID is missing.');
      return;
    }
    setDeleteLoading(true);
    try {
      const response = await deleteProduct(Number(productId));
      if (response.isSuccess) {
        showNotification('success', 'Product Successfully Deleted');
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
        sessionStorage.removeItem('skuId');
        navigate('/home');
      } else {
        showNotification('error', response.exceptionInformation || 'Product Deletion Failed');
      }
    } catch (err: unknown) {
      console.error('Error deleting product:', err);
      showNotification('error', 'Something went wrong during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = () => {
    showNotification('info', 'Save functionality is not implemented in this component.');
  };

  const tabBarExtraContent = (
    <div className="flex gap-x-3 mb-2 mr-4">
      <Button onClick={handleCancel}>Cancel</Button>
      <Popconfirm title="Are you sure delete this product?" onConfirm={handleDelete} okText="Yes" cancelText="No" placement="left" icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
        <Button danger loading={deleteLoading}>
          Delete
        </Button>
      </Popconfirm>
      <Button type="primary" loading={deleteLoading} onClick={handleSave}>
        Save
      </Button>
    </div>
  );

  return (
    <div className="bg-white shadow-cousins-box rounded-lg">
      <div className="p-2 pb-1">
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
