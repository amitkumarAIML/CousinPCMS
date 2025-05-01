import {useState, useEffect, useCallback} from 'react';
import {useLocation} from 'react-router';
import {Button, Spin, List, Popconfirm, Form, message, Modal, Upload} from 'antd';
import {DeleteOutlined, PaperClipOutlined, PlusOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import type {ApiResponse} from '../models/generalModel';
import type {AdditionalImagesModel, AdditionalImageDeleteRequestModel} from '../models/additionalImagesModel';
import {getProductAdditionalImages, saveProductImagesUrl, deleteProductImagesUrl} from '../services/ProductService';
import {getCategoryAdditionalImages, saveCategoryImagesUrl, deleteCategoryImagesUrl} from '../services/CategoryService';
import {getSkuAdditionalImages, saveSkuImagesUrl, deleteSkuImagesUrl} from '../services/SkusService';
import {useNotification} from '../contexts.ts/useNotification';
import {getSessionItem} from '../services/DataService';

const AdditionalImages = () => {
  const [fileList, setFileList] = useState<AdditionalImagesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUploadFile, setCurrentUploadFile] = useState<UploadFile | null>(null);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDuplicateFilename, setIsDuplicateFilename] = useState<boolean>(false);

  const location = useLocation();
  const [contextId, setContextId] = useState<string | number | undefined>(undefined);
  const [contextType, setContextType] = useState<'product' | 'category' | 'sku' | null>(null);
  const notify = useNotification();

  const fetchImages = useCallback(
    async (id: string | number, type: 'product' | 'category' | 'sku') => {
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
          setDisplayText('Failed to load images.');
          const errorMsg =
            Array.isArray(response.exceptionInformation) && response.exceptionInformation.length > 0
              ? response.exceptionInformation[0].description
              : response.exceptionInformation || 'Failed to load images.';
          notify.error(errorMsg);
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

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let id: string | number | undefined;
    let type: 'product' | 'category' | 'sku' | null = null;

    if (path.includes('/products')) {
      const idStr = getSessionItem('productId') || getSessionItem('tempProductId');
      id = idStr ? Number(idStr) : undefined;
      type = 'product';
    } else if (path.includes('/category')) {
      id = getSessionItem('CategoryId') || getSessionItem('tempCategoryId');
      type = 'category';
    } else if (path.includes('/skus')) {
      id = getSessionItem('skuId') || getSessionItem('itemNumber') || getSessionItem('tempItemNumber');
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

  const handleAddClick = () => {
    setCurrentUploadFile(null);
    setIsDuplicateFilename(false);
    setIsModalOpen(true);
  };

  const checkDuplicateFilename = (filename: string) => {
    const inputName = filename?.trim().toLowerCase();

    const isDuplicate = fileList.some((file) => file.imageURL?.trim().toLowerCase() === inputName);
    setIsDuplicateFilename(isDuplicate);
    return isDuplicate;
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    const currentFileList = info.fileList;
    const latestFile = currentFileList.length > 0 ? currentFileList[currentFileList.length - 1] : null;

    if (latestFile) {
      const fileToValidate = latestFile.originFileObj || latestFile;
      setCurrentUploadFile(latestFile);
      checkDuplicateFilename(fileToValidate.name);
    } else {
      setCurrentUploadFile(null);
      setIsDuplicateFilename(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }

    return isAllowedType && isLt5M ? false : Upload.LIST_IGNORE;
  };

  const handleSaveImage = async () => {
    const fileToSave = currentUploadFile?.originFileObj || currentUploadFile;

    if (!fileToSave || !fileToSave.name || isDuplicateFilename || !contextId || !contextType) {
      if (!fileToSave || !fileToSave.name) message.error('Please select an image file.');
      if (isDuplicateFilename) message.error('This image filename already exists in the list.');
      if (!contextId || !contextType) message.error('Context (Product/Category/SKU) is missing.');
      return;
    }
    setLoadingSave(true);
    const filename = fileToSave.name;
    const requestData: Partial<AdditionalImagesModel> = {
      imageURL: filename,
      imagename: filename.substring(0, filename.lastIndexOf('.')) || filename,
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

        const newImageEntry: AdditionalImagesModel = {
          ...saveData,

          productID: contextType === 'product' ? (contextId as number) : undefined,
          categoryID: contextType === 'category' ? (contextId as string) : undefined,
          skuItemID: contextType === 'sku' ? (contextId as string) : undefined,
        };
        setFileList((prev) => [...prev, newImageEntry]);
        if (fileList.length === 0) {
          setDisplayText('');
        }
        setIsModalOpen(false);
      } else {
        const errorMsg =
          Array.isArray(response.exceptionInformation) && response.exceptionInformation.length > 0
            ? response.exceptionInformation[0].description
            : response.exceptionInformation || 'Failed to add image.';
        notify.error(errorMsg);
      }
    } catch (error) {
      console.error(`Error saving image for ${contextType} ${contextId}:`, error);
      if (typeof error === 'object' && error && 'error' in error && typeof (error as {error?: {title?: string}}).error?.title === 'string') {
        notify.error((error as {error: {title: string}}).error.title);
      } else {
        notify.error('Something went wrong while saving the image.');
      }
    } finally {
      setLoadingSave(false);
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
      imagename: imageToDelete.imagename || (imageToDelete.imageURL ? imageToDelete.imageURL.substring(0, imageToDelete.imageURL.lastIndexOf('.')) || imageToDelete.imageURL : undefined),
    };

    if (contextType === 'product') reqBase.productID = imageToDelete.productID ?? (contextId as number);
    if (contextType === 'category') reqBase.categoryID = imageToDelete.categoryID ?? (contextId as string);
    if (contextType === 'sku') reqBase.skuItemID = imageToDelete.skuItemID ?? (contextId as string);

    try {
      let response: ApiResponse<string>;
      switch (contextType) {
        case 'product':
          if (!reqBase.productID || !reqBase.imageURL) throw new Error('Missing productID or imageURL for deletion');
          response = await deleteProductImagesUrl(reqBase as Required<Pick<AdditionalImageDeleteRequestModel, 'productID' | 'imageURL'>>);
          break;
        case 'category':
          if (!reqBase.categoryID || !reqBase.imageURL) throw new Error('Missing categoryID or imageURL for deletion');
          response = await deleteCategoryImagesUrl(reqBase as Required<Pick<AdditionalImageDeleteRequestModel, 'categoryID' | 'imageURL'>>);
          break;
        case 'sku':
          if (!reqBase.skuItemID || !reqBase.imageURL) throw new Error('Missing skuItemID or imageURL for deletion');
          response = await deleteSkuImagesUrl(reqBase as Required<Pick<AdditionalImageDeleteRequestModel, 'skuItemID' | 'imageURL'>>);
          break;
        default:
          throw new Error('Invalid context type for deleting image');
      }
      if (response.isSuccess) {
        notify.success(`${contextType.charAt(0).toUpperCase() + contextType.slice(1)} image successfully deleted.`);
        const newList = fileList.filter((_, i) => i !== index);
        setFileList(newList);
        if (newList.length === 0) {
          setDisplayText('No additional images found.');
        }
      } else {
        const errorMsg =
          Array.isArray(response.exceptionInformation) && response.exceptionInformation.length > 0
            ? response.exceptionInformation[0].description
            : response.exceptionInformation || 'Failed to delete image.';
        notify.error(errorMsg);
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

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center pb-1">
        <span className="font-medium text-primary-font">Additional Website Images</span>
      </div>
      <div>
        <div className="p-2 border border-border rounded-lg">
          <div className="bg-white rounded">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Current Images</label>
              <Button type="primary" onClick={handleAddClick} size="small" disabled={!contextId || !contextType}>
                Add
              </Button>
            </div>

            <Spin spinning={loadingData}>
              <div className="border border-border rounded-md">
                {fileList.length > 0 ? (
                  <List
                    size="small"
                    dataSource={fileList}
                    renderItem={(image, index) => (
                      <List.Item
                        key={`${image.imageURL}-${index}-${image.productID || image.categoryID || image.skuItemID}`}
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
                            {image.imageURL && <Button type="text" danger size="small" icon={<DeleteOutlined />} />}
                          </Popconfirm>,
                        ]}
                      >
                        <span className="font-medium truncate" title={image.imageURL}>
                          {image.imageURL || 'Invalid Image Entry'}
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

          <Modal
            width={400}
            title="Add New Image"
            rootClassName="additional-image-upload"
            open={isModalOpen}
            onCancel={handleModalCancel}
            destroyOnClose
            footer={[
              <Button size="small" key="back" onClick={handleModalCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                size="small"
                loading={loadingSave}
                disabled={!currentUploadFile || isDuplicateFilename || currentUploadFile.status === 'error'}
                onClick={handleSaveImage}
              >
                Save Image
              </Button>,
            ]}
          >
            <Form.Item
              label=""
              required
              validateStatus={isDuplicateFilename ? 'error' : ''}
              help={isDuplicateFilename && currentUploadFile?.status !== 'error' ? 'This image filename already exists in the list.' : ''}
            >
              <Upload
                name="additionalImage"
                listType="picture-card"
                rootClassName="additional-image-upload"
                showUploadList={currentUploadFile ? {showPreviewIcon: false, showRemoveIcon: true} : false}
                fileList={currentUploadFile ? [currentUploadFile] : []}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
                accept="image/png, image/jpeg, image/jpg"
                maxCount={1}
              >
                {!currentUploadFile && uploadButton}
              </Upload>
            </Form.Item>

            {currentUploadFile && currentUploadFile.name && (
              <p style={{marginTop: '8px', textAlign: 'center', color: '#555', wordBreak: 'break-all'}}>
                <PaperClipOutlined /> {currentUploadFile.name}
              </p>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdditionalImages;
