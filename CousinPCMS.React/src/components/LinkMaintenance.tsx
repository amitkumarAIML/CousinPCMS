import React, {useState, useEffect, useCallback} from 'react';
import {useLocation} from 'react-router';
import {Button, Input, Select, Form, Spin, List, Popconfirm, Modal} from 'antd';
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {getProductUrls, saveProductLinkUrl, deleteProductLinkUrl} from '../services/ProductService';
import {getCategoryUrls, saveCategoryLinkUrl, deleteCategoryLinkUrl} from '../services/CategoryService';
import {getSkuUrls, saveSkuLinkUrl, deleteSkuLinkUrl} from '../services/SkusService';
import {useNotification} from '../contexts.ts/useNotification';
import type {LinkValue, LinkRequestModel, LinkDeleteRequestModel} from '../models/linkMaintenanaceModel';
import type {ApiResponse} from '../models/generalModel';

const {Option} = Select;

const LinkMaintenance = () => {
  const [form] = Form.useForm();
  const [links, setLinks] = useState<LinkValue[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateUrl, setIsDuplicateUrl] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setDisplayText('Failed to load links.');
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
      const idStr = getSessionItem('productId');
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = getSessionItem('categoryId') || undefined;
      type = 'category';
    } else if (path.includes('/skus')) {
      id = getSessionItem('skuId') || getSessionItem('itemNumber') || undefined;
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

  const handleModalCancel = () => {
    form.resetFields();
    setIsDuplicateUrl(false);
    setIsModalOpen(false);
  };

  const handleAddClick = () => {
    form.resetFields();
    setIsDuplicateUrl(false);
    setIsModalOpen(true);
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

  const handleSave = async (values: any) => {
    if (!contextId || !contextType) {
      notify.error('Context ID or Type is missing.');
      return;
    }
    setLoading(true);
    try {
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
        notify.success('Link Added Successfully');
        setLinks((prev) => [...prev, values]);
        setIsModalOpen(false);
        form.resetFields();
      } else {
        notify.error('Failed to add link.');
      }
    } catch (errorInfo: any) {
      // Do not close modal on validation error
      if (Array.isArray(errorInfo?.errorFields)) {
        notify.error('Please fill in all required fields correctly.');
      } else {
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
        notify.success(`${contextType.charAt(0).toUpperCase() + contextType.slice(1)} video link successfully deleted.`);
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
    <div>
      <div className="flex flex-wrap justify-between items-center p-4 pb-1">
        <span className="font-medium text-primary-font">Video Links</span>
      </div>
      <div className="p-2 border border-border rounded-lg">
        <div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label>Existing Links</label>
              <Button type="primary" onClick={handleAddClick} size="small">
                Add
              </Button>
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
                        <span className="font-medium truncate" title={link.linkURL}>
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

          <Modal
            width={400}
            title="Add New Video Links"
            rootClassName="additional-link"
            open={isModalOpen}
            onCancel={handleModalCancel}
            destroyOnClose
            footer={[
              <Button size="small" key="back" onClick={handleModalCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" size="small" loading={loading} disabled={isDuplicateUrl} onClick={() => form.submit()}>
                Save Link
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical" className="space-y-2" autoComplete="off" onFinish={handleSave}>
              <Form.Item label="Link Text" name="linkText" rules={[{required: true, message: 'Link Text is required.'}]}>
                <Input placeholder="e.g., View Datasheet" />
              </Form.Item>
              <Form.Item
                label="Link URL"
                name="linkURL"
                rules={[
                  {required: true, message: 'Link URL is required.'},
                  {type: 'url', message: 'Please enter a valid URL.'},
                ]}
                validateStatus={isDuplicateUrl ? 'error' : ''}
                help={isDuplicateUrl ? 'This URL already exists.' : ''}
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
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LinkMaintenance;
