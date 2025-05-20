import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useLocation} from 'react-router';
import {Button, Input, Select, Form, Spin, List, Popconfirm} from 'antd';
import {DeleteOutlined, MenuOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {getProductUrls, saveProductLinkUrl, deleteProductLinkUrl, updateProductLinkUrls} from '../../services/ProductService';
import {getCategoryUrls, saveCategoryLinkUrl, deleteCategoryLinkUrl, updateCategoryLinkUrls} from '../../services/CategoryService';
import {getSkuUrls, saveSkuLinkUrl, deleteSkuLinkUrl, updateSkuLinkUrls} from '../../services/SkusService';
import {useNotification} from '../../hook/useNotification';
import type {LinkValue, LinkRequestModel, LinkDeleteRequestModel, UpdateLinkOrderModel} from '../../models/linkMaintenanaceModel';
import type {ApiResponse} from '../../models/generalModel';
import {getSessionItem} from '../../services/DataService';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
type ContextType = 'product' | 'category' | 'sku' | null;
const {Option} = Select;

// Helper function to get a consistent string ID for sortable items based on your condition
const getSortableItemId = (link: LinkValue): string => {
  if (link.categoryurlID !== undefined && link.categoryurlID !== null) {
    return String(link.categoryurlID);
  }
  if (link.producturlID !== undefined && link.producturlID !== null) {
    return String(link.producturlID);
  }
  if (link.skuitemURLid !== undefined && link.skuitemURLid !== null) {
    return String(link.skuitemURLid);
  }
  if (link.linkURL !== undefined && link.linkURL !== null && link.linkURL.trim() !== '') {
    return link.linkURL; // linkURL is already a string, use directly
  }
  return `unsortable-link-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
const LinkMaintenance = () => {
  const [form] = Form.useForm();
  const [links, setLinks] = useState<LinkValue[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateUrl, setIsDuplicateUrl] = useState<boolean>(false);

  const [contextId, setContextId] = useState<string | number | undefined>(undefined);
  const [contextType, setContextType] = useState<ContextType>(null);

  const location = useLocation();
  const notify = useNotification();
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

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
          // Ensure links are sorted by listorder if property exists
          const sortedLinks = response.value.sort((a, b) => (a.listorder || 0) - (b.listorder || 0));
          setLinks(sortedLinks);
          if (sortedLinks.length === 0) {
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

  const handleContextAndFetchLinks = useCallback(() => {
    const path = location.pathname.toLowerCase();
    let id: string | number | undefined;
    let type: 'product' | 'category' | 'sku' | null = null;

    if (path.includes('/products')) {
      const idStr = getSessionItem('linkProductId');
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = getSessionItem('linkCategoryId');
      type = 'category';
    } else if (path.includes('/skus')) {
      id = getSessionItem('linkSkusId');
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

  useEffect(() => {
    handleContextAndFetchLinks();
  }, [handleContextAndFetchLinks]);

  const goBack = () => {
    sessionStorage.removeItem('linkProductId');
    sessionStorage.removeItem('linkCategoryId');
    sessionStorage.removeItem('linkSkusId');
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

      const maxListOrder = links.length > 0 ? Math.max(...links.map((link) => link.listorder || 0)) : 0;
      const nextListOrder = maxListOrder + 1;

      const requestData: LinkRequestModel = {
        ...values,
        listorder: nextListOrder,
        productID: contextType === 'product' ? (contextId as number) : undefined,
        categoryID: contextType === 'category' ? contextId.toString() : undefined,
        skuItemID: contextType === 'sku' ? contextId.toString() : undefined,
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
        setLinks((prev) => [...prev, requestData]);
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

  const handleDeleteLink = async (linkToDelete: LinkValue) => {
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
        await handleContextAndFetchLinks();
      } else {
        notify.error('Failed to delete link.');
      }
    } catch {
      notify.error('Something went wrong during deletion.');
    } finally {
      setLoadingData(false);
    }
  };

  const getLinkIdByContext = (link: LinkValue, contextType: ContextType): number | undefined => {
    if (contextType === 'product') return link.producturlID;
    if (contextType === 'category') return link.categoryurlID;
    if (contextType === 'sku') return link.skuitemURLid;
  };

  const sortedFileList = useMemo(() => {
    return [...links].sort((a, b) => (a.listorder || 0) - (b.listorder || 0));
  }, [links]);

  // Function to handle drag end and persist order
  const handleLinkDragEnd = async ({active, over}: {active: any; over: any}) => {
    if (active.id !== over?.id) {
      const newIndex = sortedFileList.findIndex((link) => getLinkIdByContext(link, contextType)?.toString() === over?.id?.toString());
      // Call API to persist new order
      setLoadingData(true);
      try {
        const link = sortedFileList.find((links) => getLinkIdByContext(links, contextType)?.toString() === active.id?.toString());
        if (!link) {
          notify.error('Link not found.');
          setLoadingData(false);
          return;
        }

        const oldListOrder = link.listorder || 0;
        const newListOrder = sortedFileList[newIndex]?.listorder || 0;

        const updateRequest: UpdateLinkOrderModel = {
          newlistorder: newListOrder,
          oldlistorder: oldListOrder,
          ...(contextType === 'product' && {producturlID: link.producturlID}),
          ...(contextType === 'category' && {categoryurlID: link.categoryurlID}),
          ...(contextType === 'sku' && {skuitemURLID: link.skuitemURLid}),
        };
        let response: ApiResponse<string>;
        switch (contextType) {
          case 'product':
            response = await updateProductLinkUrls(updateRequest);
            break;
          case 'category':
            response = await updateCategoryLinkUrls(updateRequest);
            break;
          case 'sku':
            response = await updateSkuLinkUrls(updateRequest);
            break;
          default:
            throw new Error('Invalid context type for updating link order');
        }

        if (response.isSuccess) {
          handleContextAndFetchLinks();
          notify.success('Link order updated successfully.');
        } else {
          notify.error('Failed to update link order.');
        }
      } catch (error) {
        console.error('Error updating link order:', error);
        notify.error('Failed to update link order.');
      } finally {
        setLoadingData(false);
      }
    }
  };

  // Sortable Link Item component
  function SortableLinkItem({id, link, onDelete}: {id: string | number; link: LinkValue; onDelete: (link: LinkValue) => void}) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#f0f0f0' : undefined,
      cursor: 'grab',
      marginBottom: 0,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <List.Item
          className="flex justify-between items-center px-2 py-1"
          actions={[
            <Popconfirm title="Delete this link?" onConfirm={() => onDelete(link)} okText="Yes" cancelText="No" placement="left" icon={<QuestionCircleOutlined style={{color: 'red'}} />}>
              <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          <span className="flex items-center flex-grow truncate">
            <Button type="text" size="small" icon={<MenuOutlined />} {...listeners} style={{cursor: 'grab', marginRight: 8}} className="drag-handle" />
            <span className="text-sm truncate" title={`(${link.linkURL})`}>
              {link.linkURL}
            </span>
          </span>
        </List.Item>
      </div>
    );
  }

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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
                  <SortableContext items={sortedFileList.map((url) => getSortableItemId(url))} strategy={verticalListSortingStrategy}>
                    {sortedFileList.length > 0 ? (
                      <ul style={{margin: 0, padding: 0}} className="divide-y divide-border">
                        {[...sortedFileList]
                          .sort((a, b) => (a.listorder || 0) - (b.listorder || 0))
                          .map((link) => {
                            const sortableId = getSortableItemId(link);
                            return <SortableLinkItem key={sortableId} id={sortableId} link={link} onDelete={handleDeleteLink} />;
                          })}
                      </ul>
                    ) : (
                      <div className="flex justify-center items-center h-48 text-secondary-font">{displayText}</div>
                    )}
                  </SortableContext>
                </DndContext>
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
