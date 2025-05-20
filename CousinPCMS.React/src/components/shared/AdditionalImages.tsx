import {useState, useEffect, useCallback, useMemo} from 'react';
import {useLocation} from 'react-router';
import {Button, Input, Spin, Popconfirm, Form, Upload, List} from 'antd';
import {DeleteOutlined, PlusOutlined, UploadOutlined, QuestionCircleOutlined, MenuOutlined} from '@ant-design/icons';
import {DndContext, closestCenter, useSensor, useSensors, PointerSensor} from '@dnd-kit/core';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {ApiResponse} from '../../models/generalModel';
import type {AdditionalImagesModel, AdditionalImageDeleteRequestModel, UpdateAdditionalImagesModel} from '../../models/additionalImagesModel';
import {getProductAdditionalImages, saveProductImagesUrl, deleteProductImagesUrl, updateProductAdditionalImage} from '../../services/ProductService';
import {getCategoryAdditionalImages, saveCategoryImagesUrl, deleteCategoryImagesUrl, updateCategoryAdditionalImage} from '../../services/CategoryService';
import {getSkuAdditionalImages, saveSkuImagesUrl, deleteSkuImagesUrl, updateSkuAdditionalImage} from '../../services/SkusService';
import {useNotification} from '../../hook/useNotification';
import {getSessionItem} from '../../services/DataService';

type ContextType = 'product' | 'category' | 'sku' | null;

const getSortableItemId = (image: AdditionalImagesModel): string => {
  const id = image.catimageid ?? image.productImageID ?? image.skuImageID;
  if (id !== null && id !== undefined) {
    return String(id);
  }
  if (image.imageURL) {
    return image.imageURL;
  }
  return `unsortable-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const AdditionalImages = () => {
  const [fileList, setFileList] = useState<AdditionalImagesModel[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateUrl, setIsDuplicateUrl] = useState<boolean>(false);
  const [form] = Form.useForm();
  const location = useLocation();

  const [contextId, setContextId] = useState<string | number | undefined>(undefined);
  const [contextType, setContextType] = useState<ContextType>(null);
  const notify = useNotification();

  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

  const fetchImages = useCallback(
    async (id: string | number, type: 'product' | 'category' | 'sku') => {
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
        if (response.isSuccess) {
          if (!response.value || response.value.length === 0) {
            setFileList([]);
            setDisplayText('No additional images found.');
          } else {
            setFileList(response.value);
            setDisplayText('');
          }
        } else {
          setDisplayText('No Data.');
          if (response.exceptionInformation) notify.error(String(response.exceptionInformation));
        }
      } catch (error) {
        console.error(`Error fetching images for ${type} ${id}:`, error);
        setDisplayText('Error loading images.');
        notify.error('Something went wrong while fetching images.');
      } finally {
        setLoadingData(false);
      }
    },
    [notify]
  );

  // Function to handle context and image fetching logic
  const handleContextAndFetchImages = useCallback(() => {
    const path = location.pathname.toLowerCase();
    let id: string | number | undefined;
    let type: 'product' | 'category' | 'sku' | null = null;

    if (path.includes('/products')) {
      const idStr = getSessionItem('imageProductId') || undefined;
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = getSessionItem('imageCategoryId') || undefined;
      type = 'category';
    } else if (path.includes('/skus')) {
      id = getSessionItem('imageSkusId') || undefined;
      type = 'sku';
    }
    setLoadingData(true);

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

  useEffect(() => {
    handleContextAndFetchImages();
  }, [handleContextAndFetchImages]);

  const goBack = () => {
    sessionStorage.removeItem('imageProductId');
    sessionStorage.removeItem('imageCategoryId');
    sessionStorage.removeItem('imageSkusId');
    window.history.back();
  };

  const checkDuplicateUrl = (url: string) => {
    const inputValue = url?.trim().toLowerCase();
    const isDuplicate = fileList.some((file) => file.imageURL?.trim().toLowerCase() === inputValue);
    setIsDuplicateUrl(isDuplicate);
    return isDuplicate;
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      const currentImageUrl = file.name;
      setImageUrl(currentImageUrl);
      const isDuplicate = checkDuplicateUrl(currentImageUrl);
      setIsDuplicateUrl(isDuplicate);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      notify.error('Error reading file for preview.');
    };
    reader.readAsDataURL(file);
    // Return false to prevent automatic upload
    return false;
  };

  const handleUpload = async () => {
    if (!imageUrl || isDuplicateUrl || !contextId || !contextType) {
      if (!imageUrl) notify.error('Please select an image file.');
      if (isDuplicateUrl) notify.error('This image URL already exists.');
      if (!contextId || !contextType) notify.error('Context (Product/Category/SKU) is missing.');
      return;
    }
    setLoading(true);
    // Find the max listOrder in the current list and add 1
    const maxListOrder = fileList.length > 0 ? Math.max(...fileList.map((img) => img.listorder || 0)) : 0;
    const nextListOrder = maxListOrder + 1;
    const requestData: Partial<AdditionalImagesModel> = {
      imageURL: imageUrl,
      imagename: imageUrl.replace(/\.[^/.]+$/, ''),
      listorder: nextListOrder,
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
          saveData = {...requestData, categoryID: contextId.toString()} as AdditionalImagesModel;
          response = await saveCategoryImagesUrl(saveData);
          break;
        case 'sku':
          saveData = {...requestData, skuItemID: contextId.toString()} as AdditionalImagesModel;
          response = await saveSkuImagesUrl(saveData);
          break;
        default:
          throw new Error('Invalid context type for saving image');
      }
      if (response.isSuccess) {
        notify.success('Image Added Successfully');
        setImageUrl('');
        setAvatarUrl(null);
        setIsDuplicateUrl(false);
        form.resetFields();
        // setFileList((prev) => [...prev, saveData]);
        await handleContextAndFetchImages();
      } else {
        notify.error('Failed to add image.');
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

  const handleDeleteImage = async (imageToDelete: AdditionalImagesModel) => {
    if (!contextId || !contextType) {
      notify.error('Context (Product/Category/SKU) is missing.');
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
        await handleContextAndFetchImages();
      } else {
        notify.error('Failed to delete image.');
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

  const getImageIdByContext = (image: AdditionalImagesModel, contextType: ContextType): number | undefined => {
    if (contextType === 'product') return image.productImageID;
    if (contextType === 'category') return image.catimageid;
    if (contextType === 'sku') return image.skuImageID;
  };

  const sortedFileList = useMemo(() => {
    return [...fileList].sort((a, b) => (a.listorder || 0) - (b.listorder || 0));
  }, [fileList]);

  // Function to handle drag end and persist order
  const handleImageDragEnd = async ({active, over}: {active: any; over: any}) => {
    if (active.id !== over?.id) {
      const newIndex = sortedFileList.findIndex((img) => getImageIdByContext(img, contextType)?.toString() === over?.id?.toString());

      // Call API to persist new order
      setLoadingData(true);
      try {
        const image = sortedFileList.find((img) => getImageIdByContext(img, contextType)?.toString() === active.id?.toString());
        if (!image) {
          notify.error('Image not found.');
          setLoadingData(false);
          return;
        }

        const oldListOrder = image.listorder || 0;
        const newListOrder = sortedFileList[newIndex]?.listorder || 0;

        const updateRequest: UpdateAdditionalImagesModel = {
          newlistorder: newListOrder,
          oldlistorder: oldListOrder,
          ...(contextType === 'product' && {productimageid: image.productImageID}),
          ...(contextType === 'category' && {catimageid: image.catimageid}),
          ...(contextType === 'sku' && {skuImageID: image.skuImageID}),
        };
        let response: ApiResponse<string>;
        switch (contextType) {
          case 'product':
            response = await updateProductAdditionalImage(updateRequest);
            break;
          case 'category':
            response = await updateCategoryAdditionalImage(updateRequest);
            break;
          case 'sku':
            response = await updateSkuAdditionalImage(updateRequest);
            break;
          default:
            throw new Error('Invalid context type for updating image order');
        }

        if (response.isSuccess) {
          handleContextAndFetchImages();
          notify.success('Image order updated successfully.');
        } else {
          notify.error('Failed to update image order.');
        }
      } catch (error) {
        console.error('Error updating image order:', error);
        notify.error('Failed to update image order.');
      } finally {
        setLoadingData(false);
      }
    }
  };

  // Sortable image item using dnd-kit
  function SortableImageItem({image, onDelete, id}: {image: AdditionalImagesModel; onDelete: (image: AdditionalImagesModel, index: number) => void; id: string | number}) {
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
            <Popconfirm
              title="Delete this image?"
              onConfirm={() =>
                onDelete(
                  image,
                  fileList.findIndex((img) => img.imageURL === image.imageURL)
                )
              }
              okText="Yes"
              cancelText="No"
              placement="left"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            >
              <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          <span className="flex items-center">
            <MenuOutlined style={{cursor: 'grab', color: '#999', marginRight: 8}} />
            <span className="text-sm truncate" title={image.imageURL}>
              {image.imageURL}
            </span>
          </span>
        </List.Item>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="flex flex-wrap justify-between items-center p-4 pb-1">
        <span className="text-sm font-medium">Additional Website Images</span>
        <Button type="default" onClick={goBack}>
          Close
        </Button>
      </div>
      <hr className="mt-2 mb-2 border-border" />
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-border rounded col-span-1">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Additional Website Images</label>
            </div>
            <Spin spinning={loadingData}>
              <div className="border border-border rounded divide-y divide-border max-h-[60vh] overflow-y-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleImageDragEnd}>
                  <SortableContext items={sortedFileList.map((img) => getSortableItemId(img))} strategy={verticalListSortingStrategy}>
                    {sortedFileList && sortedFileList.length > 0 ? (
                      <ul className="divide-y divide-border p-0 m-0 overflow-y-auto max-h-[700px] lg:max-h-[700px] md:max-h-[50vh] sm:max-h-[40vh] w-full">
                        {sortedFileList.map((image: AdditionalImagesModel) => {
                          const sortableId = getSortableItemId(image);
                          return <SortableImageItem key={sortableId} id={sortableId} image={image} onDelete={handleDeleteImage} />;
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

          <div className="p-4 border border-border rounded col-span-1">
            <label className="block mb-2 font-medium">Upload New Website Image</label>
            <div className="p-4 space-y-6">
              <Form layout="vertical" form={form}>
                <Form.Item label="Image URL / Filename" required validateStatus={isDuplicateUrl ? 'error' : ''} help={isDuplicateUrl ? 'This image URL already exists.' : ''}>
                  <div className="flex items-end gap-x-2">
                    <Input value={imageUrl} name="imageUrl" readOnly placeholder="Select a file using Browse" />
                    <Upload beforeUpload={handleFileSelect} accept="image/png,image/jpeg,image/jpg" showUploadList={false}>
                      <Button type="default" icon={<UploadOutlined />}>
                        Browse
                      </Button>
                    </Upload>
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
        </div>
      </div>
    </div>
  );
};

export default AdditionalImages;
