import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useLocation} from 'react-router';
import {Button, Input, Spin, List, Popconfirm, Form, message} from 'antd';
import {DeleteOutlined, PlusOutlined, UploadOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import type {ApiResponse} from '../models/generalModel';
import type {AdditionalImagesModel, AdditionalImageDeleteRequestModel} from '../models/additionalImagesModel';
import {getProductAdditionalImages, saveProductImagesUrl, deleteProductImagesUrl} from '../services/ProductService';
import {getCategoryAdditionalImages, saveCategoryImagesUrl, deleteCategoryImagesUrl} from '../services/CategoryService';
import {getSkuAdditionalImages, saveSkuImagesUrl, deleteSkuImagesUrl} from '../services/SkusService';
import {useNotification} from '../contexts.ts/NotificationProvider';

const AdditionalImages: React.FC = () => {
  const [fileList, setFileList] = useState<AdditionalImagesModel[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateUrl, setIsDuplicateUrl] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const [contextId, setContextId] = useState<string | number | undefined>(undefined);
  const [contextType, setContextType] = useState<'product' | 'category' | 'sku' | null>(null);
  const notify = useNotification();

  const fetchImages = useCallback(async (id: string | number, type: 'product' | 'category' | 'sku') => {
    setLoadingData(true);
    setFileList([]);
    setDisplayText('');
    try {
      let response: ApiResponse<AdditionalImagesModel[]>;
      switch (type) {
        case 'product':
          response = await getProductAdditionalImages(String(id));
          break;
        case 'category':
          response = await getCategoryAdditionalImages(String(id));
          break;
        case 'sku':
          response = await getSkuAdditionalImages(String(id));
          break;
        default:
          throw new Error('Invalid context type');
      }
      if (response.isSuccess && response.value) {
        setFileList(response.value);
        if (response.value.length === 0) {
          setDisplayText('No additional images found.');
        }
      } else {
        setDisplayText(response.exceptionInformation || 'Failed to load images.');
        if (response.exceptionInformation) notify.error(response.exceptionInformation);
      }
    } catch (error) {
      console.error(`Error fetching images for ${type} ${id}:`, error);
      setDisplayText('Error loading images.');
      notify.error('Something went wrong while fetching images.');
    } finally {
      setLoadingData(false);
    }
  }, [notify]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let id: string | number | undefined;
    let type: 'product' | 'category' | 'sku' | null = null;

    if (path.includes('/products')) {
      const idStr = sessionStorage.getItem('productId');
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = sessionStorage.getItem('categoryId') || undefined;
      type = 'category';
    } else if (path.includes('/skus')) {
      id = sessionStorage.getItem('skuId') || sessionStorage.getItem('itemNumber') || undefined;
      type = 'sku';
    }

    setContextId(id);
    setContextType(type);

    if (id && type) {
      fetchImages(id, type);
    } else {
      console.warn('Could not determine context or ID for additional images.');
      setLoadingData(false);
      setFileList([]);
      setDisplayText('Context ID not found.');
    }
  }, [location.pathname, fetchImages]);

  const goBack = () => {
    window.history.back();
  };

  const handleAddClick = () => {
    setImageUrl('');
    setAvatarUrl(null);
    setIsDuplicateUrl(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowForm(true);
  };

  const checkDuplicateUrl = (url: string) => {
    const inputValue = url?.trim().toLowerCase();
    const isDuplicate = fileList.some((file) => file.imageURL?.trim().toLowerCase() === inputValue);
    setIsDuplicateUrl(isDuplicate);
    return isDuplicate;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const currentImageUrl = file.name;
      setImageUrl(currentImageUrl);
      checkDuplicateUrl(currentImageUrl);

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        message.error('Error reading file for preview.');
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl('');
      setAvatarUrl(null);
      setIsDuplicateUrl(false);
    }
  };

  const handleUpload = async () => {
    if (!imageUrl || isDuplicateUrl || !contextId || !contextType) {
      if (!imageUrl) message.error('Please select an image file.');
      if (isDuplicateUrl) message.error('This image URL already exists.');
      if (!contextId || !contextType) message.error('Context (Product/Category/SKU) is missing.');
      return;
    }
    setLoading(true);
    const requestData: Partial<AdditionalImagesModel> = {
      imageURL: imageUrl,
      imagename: imageUrl.replace(/\.[^/.]+$/, ''),
    };
    try {
      let response: ApiResponse<string>;
      let saveData: AdditionalImagesModel;
      switch (contextType) {
        case 'product':
          saveData = {...requestData, productID: contextId as number} as AdditionalImagesModel;
          response = await saveProductImagesUrl(saveData);
          break;
        case 'category':
          saveData = {...requestData, categoryID: contextId as string} as AdditionalImagesModel;
          response = await saveCategoryImagesUrl(saveData);
          break;
        case 'sku':
          saveData = {...requestData, skuItemID: contextId as string} as AdditionalImagesModel;
          response = await saveSkuImagesUrl(saveData);
          break;
        default:
          throw new Error('Invalid context type for saving image');
      }
      if (response.isSuccess) {
        notify.success('Image Added Successfully');
        setFileList((prev) => [...prev, saveData]);
        setShowForm(false);
      } else {
        notify.error(response.exceptionInformation || 'Failed to add image.');
      }
    } catch (error) {
      console.error(`Error saving image for ${contextType} ${contextId}:`, error);
      if (typeof error === 'object' && error && 'error' in error && typeof (error as {error?: {title?: string}}).error?.title === 'string') {
        notify.error((error as {error: {title: string}}).error.title);
      } else {
        notify.error('Something went wrong while saving the image.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageToDelete: AdditionalImagesModel, index: number) => {
    if (!contextId || !contextType) {
      message.error('Context (Product/Category/SKU) is missing.');
      return;
    }
    setLoadingData(true);
    const reqBase: AdditionalImageDeleteRequestModel & {imagename?: string} = {
      imageURL: imageToDelete.imageURL,
      imagename: imageToDelete.imagename || imageToDelete.imageURL.replace(/\.[^/.]+$/, ''),
    };
    try {
      let response: ApiResponse<string>;
      switch (contextType) {
        case 'product':
          response = await deleteProductImagesUrl({...reqBase, productID: imageToDelete.productID});
          break;
        case 'category':
          response = await deleteCategoryImagesUrl({...reqBase, categoryID: imageToDelete.categoryID});
          break;
        case 'sku':
          response = await deleteSkuImagesUrl({...reqBase, skuItemID: imageToDelete.skuItemID});
          break;
        default:
          throw new Error('Invalid context type for deleting image');
      }
      if (response.isSuccess) {
        notify.success(`${contextType.charAt(0).toUpperCase() + contextType.slice(1)} image successfully deleted.`);
        setFileList((prevList) => prevList.filter((_, i) => i !== index));
      } else {
        notify.error(response.exceptionInformation || 'Failed to delete image.');
      }
    } catch (error) {
      console.error(`Error deleting image for ${contextType} ${contextId}:`, error);
      if (typeof error === 'object' && error && 'error' in error && typeof (error as {error?: {title?: string}}).error?.title === 'string') {
        notify.error((error as {error: {title: string}}).error.title);
      } else {
        notify.error('Something went wrong during deletion.');
      }
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="bg-white shadow-cousins-box rounded-lg m-5">
      
      <div className="flex flex-wrap justify-between items-center p-4 pb-1">
        <span className="text-sm font-medium">Additional Images</span>
        <Button type="default" onClick={goBack}>
          Back
        </Button>
      </div>
      <hr className="mt-2 mb-2 border-border" />
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 border border-border rounded lg:col-span-1 md:col-span-1">
            
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Current Images</label>
              <Button type="primary" onClick={handleAddClick} size="small">
                Add
              </Button>
            </div>
            <Spin spinning={loadingData}>
              <div className="border border-border rounded divide-y divide-border max-h-[60vh] overflow-y-auto">
                
                {fileList.length > 0 ? (
                  <List
                    size="small"
                    dataSource={fileList}
                    renderItem={(image, index) => (
                      <List.Item
                        key={`${image.imageURL}-${index}`}
                        className="flex justify-between items-center px-2 py-1"
                        actions={[
                          <Popconfirm
                            title="Delete this image?"
                            onConfirm={() => handleDeleteImage(image, index)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                          >
                            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]}
                      >
                        <span className="text-sm  truncate" title={image.imageURL}>
                          {image.imageURL}
                        </span>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="flex justify-center items-center h-48">{displayText}</div>
                )}
              </div>
            </Spin>
          </div>

          {showForm && (
            <div className="p-4 border border-border rounded lg:col-span-2 md:col-span-1">
              
              <label className="block mb-2 font-medium">Add New Image</label>
              <div className="p-4 space-y-6">
                <Form layout="vertical">
                  <Form.Item label="Image URL / Filename" required validateStatus={isDuplicateUrl ? 'error' : ''} help={isDuplicateUrl ? 'This image URL already exists.' : ''}>
                    <div className="flex items-end gap-x-2">
                      <Input value={imageUrl} name="imageUrl" readOnly placeholder="Select a file using Browse" />

                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/png, image/jpeg, image/jpg" />

                      <Button type="default" onClick={() => fileInputRef.current?.click()} icon={<UploadOutlined />}>
                        Browse
                      </Button>
                    </div>
                  </Form.Item>
                </Form>

                <div className="flex items-end gap-x-4">
                  <div className="w-[102px] h-[102px] border border-dashed border-border flex justify-center items-center rounded overflow-hidden bg-gray-50">
                    {avatarUrl ? <img src={avatarUrl as string} alt="Preview" className="max-w-full max-h-full object-contain" /> : <PlusOutlined style={{fontSize: '24px', color: '#999'}} />}
                  </div>

                  <Button type="primary" loading={loading} disabled={!imageUrl || isDuplicateUrl} onClick={handleUpload} className="self-end">
                    Save Image Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalImages;
