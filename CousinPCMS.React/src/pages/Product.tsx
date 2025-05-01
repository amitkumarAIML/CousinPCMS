import {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button} from 'antd';
import ProductDetails from '../components/product/ProductDetails';
import SKUsList from '../components/product/SKUsList';
import {addProduct, updateProduct} from '../services/ProductService';
import {cleanEmptyNullToString, getSessionItem} from '../services/DataService';
import type {Product} from '../models/productModel';
import {useNotification} from '../contexts.ts/useNotification';

const Product = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const navigate = useNavigate();
  const notify = useNotification();
  const [isEdit, setIsEdit] = useState(false);
  const [checkIdValue, setCheckIdValue] = useState<boolean>(false);

  const productFormRef = useRef<{getFormData: () => {validateFields: () => Promise<Product>}} | null>(null);

  useEffect(() => {
    if (location.pathname === '/products/edit') {
      setIsEdit(true);
    }
    const hasRealIds = getSessionItem('CategoryId');
    const hasTempIds = getSessionItem('tempCategoryId');
    if (!hasRealIds && !hasTempIds) {
      setCheckIdValue(true);
    }
  }, []);

  const handleCancel = () => {
    navigate('/home');
  };

  // Save handler to be called from ProductDetails
  const handleSave = async () => {
    if (productFormRef.current) {
      const formData = productFormRef.current.getFormData();
      formData
        .validateFields()
        .then((values: Product) => {
          const productData = cleanEmptyNullToString(values);

          if (productData.aki_Layout_Template) {
            productData.akiProductPrintLayoutTemp = true;
          }
          const req = {
            ...productData,
            categoryName: productData.category_Name,
          };
          delete req.category_Name;
          console.log('Product data:', productData, req);
          if (isEdit) {
            updateProduct(req)
              .then((response: {isSuccess: boolean}) => {
                if (response.isSuccess) {
                  notify.success('Product Details Updated Successfully');
                  navigate('/home');
                } else {
                  notify.error('Product Details Failed to Update');
                }
              })
              .catch((err: Error) => {
                console.error('Error updating product:', err);
                notify.error('Failed to update product details.');
              });
          } else {
            addProduct(req)
              .then((response: {isSuccess: boolean}) => {
                if (response.isSuccess) {
                  notify.success('Product Details Added Successfully');
                  navigate('/home');
                } else {
                  notify.error('Product Details Failed to Add');
                }
              })
              .catch((err: Error) => {
                console.error('Error updating product:', err);
                notify.error('Failed to update product details.');
              });
          }
        })
        .catch((errorInfo: unknown) => {
          notify.error('Please fill in all required fields correctly.' + errorInfo);
        });
    } else {
      console.error('Product form reference is null.');
    }
  };

  const tabBarExtraContent = (
    <div className="flex gap-x-3 mb-2 mr-4">
      <Button size="small" onClick={handleCancel}>
        Close
      </Button>
      {activeTab === '1' && (
        <Button size="small" type="primary" onClick={handleSave} disabled={checkIdValue}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      )}
    </div>
  );

  return (
    <div className="main-container pt-2">
      <label className="px-4 text-sm font-medium ">Product Form</label>
      <div className="pb-1">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={tabBarExtraContent}
          className="product-tabs"
          items={[
            {
              label: 'Product Details',
              key: '1',
              children: <ProductDetails ref={productFormRef} />, // Pass ref
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
