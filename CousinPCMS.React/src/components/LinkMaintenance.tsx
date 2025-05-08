import React, {useState, useEffect, useCallback} from 'react';
import {useLocation} from 'react-router';
import {Button, Input, Select, Form, Spin, List, Popconfirm} from 'antd';
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {getProductUrls, saveProductLinkUrl, deleteProductLinkUrl} from '../services/ProductService';
import {getCategoryUrls, saveCategoryLinkUrl, deleteCategoryLinkUrl} from '../services/CategoryService';
import {getSkuUrls, saveSkuLinkUrl, deleteSkuLinkUrl} from '../services/SkusService';
import {useNotification} from '../contexts.ts/useNotification';
import type {LinkValue, LinkRequestModel, LinkDeleteRequestModel} from '../models/linkMaintenanaceModel';
import type {ApiResponse} from '../models/generalModel';
import {getSessionItem} from '../services/DataService';

const {Option} = Select;

const LinkMaintenance = () => {
  const [form] = Form.useForm();
  const [links, setLinks] = useState<LinkValue[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateUrl, setIsDuplicateUrl] = useState<boolean>(false);

  const [contextId, setContextId] = useState<string | number | undefined>(undefined);
  const [contextType, setContextType] = useState<'product' | 'category' | 'sku' | null>(null);

  const location = useLocation();
  const notify = useNotification();

  const fetchLinks = useCallback(
    async (id: string | number, type: 'product' | 'category' | 'sku') => {
      setLoadingData(true);
      setLinks([]);
      setDisplayText('');
      try {
        let response: ApiResponse<LinkValue[]>;
        switch (type) {
          case 'product':
            response = await getProductUrls(String(id));
            break;
          case 'category':
            response = await getCategoryUrls(String(id));
            break;
          case 'sku':
            response = await getSkuUrls(String(id));
            break;
          default:
            throw new Error('Invalid context type');
        }

        if (response.isSuccess && response.value) {
          setLinks(response.value);
          if (response.value.length === 0) {
            setDisplayText('No links added yet.');
          }
        } else {
          setDisplayText('No Data.');
          if (response.exceptionInformation) notify.error(String(response.exceptionInformation));
        }
      } catch (error) {
        console.error('Error fetching links:', error);
        setDisplayText('Error loading links.');
        notify.error('Something went wrong while fetching links.');
      } finally {
        setLoadingData(false);
      }
    },
    [notify]
  );

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let id: string | number | undefined;
    let type: 'product' | 'category' | 'sku' | null = null;

    if (path.includes('/products')) {
      const idStr = getSessionItem('productId') || getSessionItem('tempProductId');
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = getSessionItem('CategoryId') || getSessionItem('tempProductId');
      type = 'category';
    } else if (path.includes('/skus')) {
      id = getSessionItem('skuId') || getSessionItem('itemNumber') || getSessionItem('tempItemNumber');
      type = 'sku';
    }

    setContextId(id);
    setContextType(type);

    if (id && type) {
      fetchLinks(id, type);
    } else {
      console.warn('Could not determine context or ID for link maintenance.');
      setLoadingData(false);
      setLinks([]);
      setDisplayText('Context ID not found.');
    }
  }, [location.pathname, fetchLinks]);

  const goBack = () => {
    window.history.back();
  };

  const checkDuplicateUrl = (url: string | undefined | null) => {
    const inputValue = url?.trim().toLowerCase();
    const isDuplicate = links.some((link) => link.linkURL?.trim().toLowerCase() === inputValue);
    setIsDuplicateUrl(isDuplicate);
    return isDuplicate;
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkDuplicateUrl(e.target.value);
  };

  const handleSave = async () => {
    if (!contextId || !contextType) {
      notify.error('Context ID or Type is missing.');
      return;
    }
    setLoading(true);
    try {
      const values = await form.validateFields();

      if (checkDuplicateUrl(values.linkURL)) {
        notify.error('This URL already exists.');
        setLoading(false);
        return;
      }

      const requestData: LinkRequestModel = {
        ...values,
        productID: contextType === 'product' ? (contextId as number) : undefined,
        categoryID: contextType === 'category' ? (contextId as string) : undefined,
        skuItemID: contextType === 'sku' ? (contextId as string) : undefined,
      };

      let response: ApiResponse<string>;
      switch (contextType) {
        case 'product':
          response = await saveProductLinkUrl(requestData);
          break;
        case 'category':
          response = await saveCategoryLinkUrl(requestData);
          break;
        case 'sku':
          response = await saveSkuLinkUrl(requestData);
          break;
        default:
          throw new Error('Invalid context type for saving link');
      }

      if (response.isSuccess) {
        notify.success(`${contextType.charAt(0).toUpperCase() + contextType.slice(1)} Video link added successfully`);
        form.resetFields();
        setLinks((prev) => [...prev, values]);
      } else {
        notify.error('Failed to add link.');
      }
    } catch (errorInfo: any) {
      if (Array.isArray(errorInfo?.errorFields)) {
        notify.error('Please fill in all required fields correctly.');
      } else {
        console.error('An unexpected error occurred during save:', errorInfo);
        notify.error('Something went wrong during save.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkToDelete: LinkValue, index: number) => {
    if (!contextId || !contextType) {
      notify.error('Context ID or Type is missing.');
      return;
    }

    setLoadingData(true);

    const req: LinkDeleteRequestModel = {
      linkURL: linkToDelete.linkURL,

      productID: contextType === 'product' ? (contextId as number) : undefined,
      categoryID: contextType === 'category' ? (contextId as string) : undefined,
      skuItemID: contextType === 'sku' ? (contextId as string) : undefined,
    };

    try {
      let response: ApiResponse<string>;
      switch (contextType) {
        case 'product':
          response = await deleteProductLinkUrl(req);
          break;
        case 'category':
          response = await deleteCategoryLinkUrl(req);
          break;
        case 'sku':
          response = await deleteSkuLinkUrl(req);
          break;
        default:
          throw new Error('Invalid context type for deleting link');
      }

      if (response.isSuccess) {
        notify.success(`${contextType.charAt(0).toUpperCase() + contextType.slice(1)} Video link successfully deleted.`);
        setLinks((prevList) => prevList.filter((_, i) => i !== index));
      } else {
        notify.error('Failed to delete link.');
      }
    } catch {
      notify.error('Something went wrong during deletion.');
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="main-container">
      <div className="flex flex-wrap justify-between items-center p-4 pb-1">
        <span className="text-sm font-medium">Video Links</span>
        <Button type="default" onClick={goBack}>
          Close
        </Button>
      </div>
      <hr className="mt-2 mb-2 border-border" />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 border border-border rounded md:col-span-1">
            <div className="flex justify-between items-center mb-2">
              <label>Existing Links</label>
            </div>
            <Spin spinning={loadingData}>
              <div className="border border-border rounded divide-y divide-border max-h-[70vh] overflow-y-auto">
                {links.length > 0 ? (
                  <List
                    size="small"
                    dataSource={links}
                    renderItem={(link, index) => (
                      <List.Item
                        key={`${link.linkURL}-${index}`}
                        className="flex justify-between items-center px-2 py-1 "
                        actions={[
                          <Popconfirm
                            title="Delete this link?"
                            onConfirm={() => handleDeleteLink(link, index)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                          >
                            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]}
                      >
                        <span className="text-sm  truncate" title={link.linkURL}>
                          {link.linkURL}
                        </span>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="flex justify-center items-center h-48 text-secondary-font">{displayText}</div>
                )}
              </div>
            </Spin>
          </div>

          <div className="border border-border rounded p-4 md:col-span-2 w-1/2">
            <label className="text-sm">Add New Video Links</label>
            <Form form={form} layout="vertical" className="space-y-2">
              <Form.Item label="Link Text" name="linkText" rules={[{required: true, message: 'Link Text is required.'}]}>
                <Input placeholder="e.g., View Datasheet" />
              </Form.Item>
              <Form.Item
                label="Link URL"
                name="linkURL"
                validateFirst
                rules={[
                  {required: true, message: 'Link URL is required.'},
                  {type: 'url', message: 'Please enter a valid URL.'},
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      return checkDuplicateUrl(value) ? Promise.reject('This URL already exists.') : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="https://example.com/datasheet.pdf" onChange={handleUrlInputChange} />
              </Form.Item>

              <Form.Item label="Tooltip" name="toolTip" rules={[{required: true, message: 'Tooltip is required.'}]}>
                <Input placeholder="e.g., Click to view PDF datasheet" />
              </Form.Item>

              <Form.Item label="Link Type" name="linkType" rules={[{required: true, message: 'Link Type is required.'}]}>
                <Select placeholder="Select type">
                  <Option value="Youtube">Youtube</Option>
                  <Option value="Web site">Web site</Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{offset: 6, span: 18}}>
                <div className="flex justify-end gap-x-2">
                  <Button type="primary" onClick={handleSave} loading={loading} disabled={form.getFieldsError().some(({errors}) => errors.length > 0) || isDuplicateUrl}>
                    Save Link
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkMaintenance;
