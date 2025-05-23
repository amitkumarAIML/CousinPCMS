import {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router';
import {Tabs, Button} from 'antd';
import ProductDetails from '../components/product/ProductDetails';
import SKUsList from '../components/product/SKUsList';
import {cleanEmptyNullToString, getSessionItem, setSessionItem} from '../services/DataService';
import type {Product} from '../models/productModel';
import {useNotification} from '../hook/useNotification';
import {addProduct, updateProduct} from '../services/ProductService';

const Product = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const navigate = useNavigate();
  const notify = useNotification();
  const [isEdit, setIsEdit] = useState(false);
  const [checkIdValue, setCheckIdValue] = useState<boolean>(false);

  const productFormRef = useRef<{
    getFormData: () => {validateFields: () => Promise<Product>};
    getCommityCodeChange: () => boolean;
    getCountryOriginChange: () => boolean;
    setProductId: (id: string) => void;
  } | null>(null);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    const hasRealIds = getSessionItem('CategoryId');
    const hasTempIds = getSessionItem('tempCategoryId');
    if (!hasRealIds && !hasTempIds) {
      setCheckIdValue(true);
    }

    if (location.pathname === '/products/add' || (!getSessionItem('productId') && !getSessionItem('tempProductId'))) {
      setIsEdit(false);
      return;
    }
    setIsEdit(true);
  }, []);

  const handleCancel = () => {
    navigate('/home');
    sessionStorage.removeItem('originalCommodityCode');
    sessionStorage.removeItem('originalCountryOfOrigin');
  };

  const handleSave = async () => {
    if (productFormRef.current) {
      const formData = productFormRef.current.getFormData();
      try {
        const values = await formData.validateFields();
        const productData = cleanEmptyNullToString(values);

        if (productData.akiLayoutTemplate) {
          productData.akiProductPrintLayoutTemp = true;
        }
        const req = {
          ...productData,
          aki_Layout_Template: productData.akiLayoutTemplate,
          categoryName: productData.category_Name,
        };
        delete req.category_Name;
        delete req.akiLayoutTemplate;
        delete req.additionalImagesCount;
        delete req.urlLinksCount;

        if (isEdit) {
          const data = {
            ...req,
            iscommoditychange: productFormRef.current.getCommityCodeChange(),
            iscountrychange: productFormRef.current.getCountryOriginChange(),
          };

          const response = await updateProduct(data);
          if (response.isSuccess) {
            notify.success('Product details updated successfully');
            setSessionItem('originalCommodityCode', values.akiProductCommodityCode);
            setSessionItem('originalCountryOfOrigin', values.akiProductCountryOfOrigin);
            setFormChanged(false);
          } else {
            notify.error('Category details not updated');
          }
        } else {
          const response = await addProduct(req);
          if (response.isSuccess) {
            if (Number(response.value) && Number(response.value) > 0) {
              if (productFormRef.current) {
                productFormRef.current.setProductId(response.value);
                setIsEdit(true);
                setSessionItem('originalCommodityCode', values.akiProductCommodityCode);
                setSessionItem('originalCountryOfOrigin', values.akiProductCountryOfOrigin);
              }
              notify.success('Product Details Added Successfully');
            } else {
              notify.success('Product details not added');
            }
          } else {
            notify.error('Product Details Failed to Add');
          }
        }

        // sessionStorage.removeItem('originalCommodityCode');
        // sessionStorage.removeItem('originalCountryOfOrigin');
      } catch (errorInfo) {
        notify.error('Please fill in all required fields correctly.' + errorInfo);
      }
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
        <Button size="small" type="primary" onClick={handleSave} disabled={checkIdValue && isEdit && !formChanged}>
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
              children: <ProductDetails ref={productFormRef} onFormChange={setFormChanged} />, // Pass ref
            },
            {
              label: 'SKUs',
              key: '2',
              children: <SKUsList />,
            },
          ]}
        />
      </div>
      {/* Confirm Modal */}
    </div>
  );
};

export default Product;
