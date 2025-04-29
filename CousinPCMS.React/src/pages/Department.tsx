import React, {useState, useEffect} from 'react';
import {Form, Input, Select, Checkbox, Button, Upload, Spin} from 'antd';
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import {CommodityCode} from '../models/commodityCodeModel';
import {layoutDepartment} from '../models/layoutTemplateModel';
import {DepartmentCharLimit} from '../models/char.constant';
import type {Department} from '../models/departmentModel';
import {getCommodityCodes, cleanEmptyNullToString} from '../services/DataService';
import {useNotification} from '../contexts.ts/useNotification';
import {getLayoutTemplateList, getDepartmentById, updateDepartment} from '../services/DepartmentService';
import {useLocation, useNavigate} from 'react-router';

interface DepartmentInfoProps {
  deptData?: Department | null;
}

const Department: React.FC<DepartmentInfoProps> = () => {
  const [form] = Form.useForm<Department>();
  const [commodityCode, setCommodityCode] = useState<CommodityCode[]>([]);
  const [layoutOptions, setLayoutOptions] = useState<layoutDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const akiDepartmentName = Form.useWatch('akiDepartmentName', form);
  const akiDepartmentDescText = Form.useWatch('akiDepartmentDescText', form);
  const akiDepartmentImageURL = Form.useWatch('akiDepartmentImageURL', form);
  const akiDepartmentKeyWords = Form.useWatch('akiDepartmentKeyWords', form);
  const charLimit = DepartmentCharLimit;
  const departmentId = sessionStorage.getItem('departmentId') || '';
  const notify = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commodities, layouts] = await Promise.all([getCommodityCodes(), getLayoutTemplateList()]);
        setCommodityCode(commodities);
        setLayoutOptions(layouts);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        notify.error('Failed to load form data.');
      }
    };
    fetchData();
  }, [notify]);

  useEffect(() => {
    // If on add page, do not fetch department or show error
    if (location.pathname === '/departments/add') {
      form.setFieldValue('akiDepartmentID', 0); // Clear department ID field
      setLoading(false);
      return;
    }
    if (!departmentId) {
      notify.error('Department ID not found. Please select a department.');
      // navigate('/home');
      return;
    }
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(departmentId);
        if (response.isSuccess && response.value && response.value.length > 0) {
          form.setFieldsValue({
            ...response.value[0],
            akiDepartmentWebActive: response.value[0].akiDepartmentWebActive,
            akiDeptPromptUserifblank: response.value[0].akiDeptPromptUserifblank,
            akiDepartmentIsActive: response.value[0].akiDepartmentIsActive,
            akiColor: response.value[0].akiColor?.startsWith('#') ? response.value[0].akiColor : `#${response.value[0].akiColor || 'F7941D'}`,
            akiFeaturedProdBGColor: response.value[0].akiFeaturedProdBGColor?.startsWith('#') ? response.value[0].akiFeaturedProdBGColor : `#${response.value[0].akiFeaturedProdBGColor || 'FFFF80'}`,
          });
        } else {
          notify.error('Failed To Load Data');
        }
      } catch (error) {
        console.log('Error fetching department:', error);
        notify.error('Something went wrong');
      } finally {
        setLoading(false); // Hide spinner after department fetch
      }
    };
    fetchDepartment();
  }, [form, departmentId, navigate, notify]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Department) => {
    const {value} = event.target;
    form.setFieldsValue({[fieldName]: value});
  };

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Department) => {
    let value = event.target.value.trim();
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    form.setFieldsValue({[fieldName]: value});
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      form.setFieldsValue({akiDepartmentImageURL: info.file.response?.url || info.file.name});
    } else if (info.file.status === 'error') {
      notify.error(`${info.file.name} file upload failed.`);
      console.error('Upload Error:', info.file.error);
    } else if (info.file.originFileObj) {
      form.setFieldsValue({akiDepartmentImageURL: info.file.name});
    }
  };

  const hexColorRule = {
    pattern: /^#([0-9A-Fa-f]{6})$/,
    message: 'Please enter a valid 6-digit hex color (e.g., #RRGGBB)',
  };

  const handleFormSubmit = () => {
    console.log('Form Submitted:', form.getFieldsValue());
    form
      .validateFields()
      .then((values) => {
        values.akiDepartmentIsActive = true;

        const cleanedForm = cleanEmptyNullToString(values);
        console.log('Form Values:', values, cleanedForm);

        updateDepartment(cleanedForm)
          .then((response) => {
            if (response.isSuccess) {
              notify.success('Department Details Updated Successfully');
              navigate('/home');
            } else {
              notify.error('Department Details Failed to Update');
            }
          })
          .catch((err) => {
            console.error('Error updating department:', err);
            notify.error('Failed to update department details.');
          });
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo);
        notify.error('Please fill in all required fields correctly.');
      });
  };

  return (
    <Spin spinning={loading}>
      <div className="main-container">
        <div className="flex justify-between items-center p-4 pb-1">
          <span className="text-sm font-medium">Department Form</span>
          <div className="flex gap-x-3">
            <Button type="default">Cancel</Button>
            <Button type="primary" onClick={handleFormSubmit}>
              Save
            </Button>
          </div>
        </div>
        <hr className="mt-2 mb-1 border-light-border" />
        <div className="p-4 pt-3">
          <Form
            form={form}
            layout="vertical"
            className="rounded-lg"
            initialValues={{
              akiDepartmentWebActive: false,
              akiDeptPromptUserifblank: false,
              akiDepartmentIsActive: true,
              akiColor: '#F7941D',
              akiFeaturedProdBGColor: '#FFFF80',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-6 md:col-span-6">
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item label="Department ID" name="akiDepartmentID" colon={false} className="col-span-1">
                    <Input disabled className="w-full" />
                  </Form.Item>
                  {/* Department Name */}
                  <Form.Item label="List Order" name="akiDepartmentListOrder" rules={[{required: true, message: 'Please enter a list order number'}]} colon={false} className="col-span-1">
                    <Input type="number" className="w-full" />
                  </Form.Item>
                  <div className="relative  col-span-2 ">
                    <Form.Item label="Department Name" name="akiDepartmentName" rules={[{required: true, message: 'Please enter a department name'}]} colon={false} className="w-full">
                      <Input maxLength={charLimit.akiDepartmentName} className="w-full " />
                    </Form.Item>
                    <span className=" absolute -right-14 top-7 transform -translate-y-1/2  text-xs">
                      {akiDepartmentName?.length || 0} / {charLimit.akiDepartmentName}
                    </span>
                  </div>
                  {/* Checkboxes */}
                  <div className="col-span-2 nz-checkbox-wrapper flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-2 mb-2">
                    <Form.Item name="akiDepartmentWebActive" valuePropName="checked" noStyle>
                      <Checkbox>Web Active</Checkbox>
                    </Form.Item>
                    <Form.Item name="akiDeptPromptUserifblank" valuePropName="checked" noStyle>
                      <Checkbox>Prompt User If Price Group Is Blank</Checkbox>
                    </Form.Item>
                  </div>
                  {/* Department Text */}
                  <div className="relative col-span-2">
                    <Form.Item label="Department Text" name="akiDepartmentDescText" colon={false}>
                      <Input.TextArea rows={3} maxLength={charLimit.akiDepartmentDescText} className="w-full " />
                    </Form.Item>
                    <span className=" absolute bottom-3 -right-16  text-xs">
                      {akiDepartmentDescText?.length || 0} / {charLimit.akiDepartmentDescText}
                    </span>
                  </div>
                  {/* Image URL & Upload */}
                  <div className="flex items-end gap-x-2 relative col-span-2">
                    <Form.Item label="Image URL" name="akiDepartmentImageURL" colon={false} className="w-full">
                      <Input maxLength={charLimit.akiDepartmentImageURL} className="w-full " />
                    </Form.Item>
                    <Upload
                      customRequest={({file, onSuccess}) => {
                        console.log('Custom request uploading:', file);
                        setTimeout(() => {
                          console.log('Simulating upload success');
                          onSuccess?.({url: (file as File).name}, (file as UploadFile).originFileObj);
                        }, 1000);
                      }}
                      headers={{authorization: 'your-auth-token'}}
                      onChange={handleFileChange}
                      showUploadList={false}
                      accept=".png,.jpeg,.jpg"
                    >
                      <Button type="primary" className="m-0 px-4">
                        Upload
                      </Button>
                    </Upload>
                    <span className=" absolute -right-14 top-7 transform -translate-y-1/2  text-xs">
                      {akiDepartmentImageURL?.length || 0} / {charLimit.akiDepartmentImageURL}
                    </span>
                  </div>
                  <Form.Item label="Image Height" name="akiDepartmentImageHeight" colon={false}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item label="Image Width" name="akiDepartmentImageWidth" colon={false}>
                    <Input type="number" />
                  </Form.Item>
                  {/* Key Words */}
                  <div className="relative col-span-2">
                    <Form.Item label="Key Words" name="akiDepartmentKeyWords" colon={false}>
                      <Input maxLength={charLimit.akiDepartmentKeyWords} className="w-full " />
                    </Form.Item>
                    <span className=" absolute -right-14 top-7 transform -translate-y-1/2  text-xs">
                      {akiDepartmentKeyWords?.length || 0} / {charLimit.akiDepartmentKeyWords}
                    </span>
                  </div>
                  {/* Commodity Code */}
                  <Form.Item label="Commodity Code" name="akiDepartmentCommodityCode" htmlFor="commodityCode" colon={false}>
                    <Select
                      id="commodityCode"
                      allowClear
                      showSearch
                      className="w-full"
                      placeholder="Select a commodity code"
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={(commodityCode || []).map((commodity, index) => ({
                        value: commodity.commodityCode,
                        label: commodity.commodityCode,
                        key: commodity.commodityCode || index,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 md:col-span-6 lg:pl-20">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="col-span-2 flex items-center space-x-2 my-2">
                    <span className="ant-form-item-label" style={{flexShrink: 0}}>
                      <label>Catalogue Active</label>
                    </span>
                    <Form.Item name="akiDepartmentIsActive" valuePropName="checked" noStyle>
                      <Checkbox />
                    </Form.Item>
                  </div>
                  <Form.Item label="Layout Template" name="akiLayoutTemplate" colon={false} className="col-span-2">
                    <Select
                      allowClear
                      showSearch
                      className="w-full"
                      placeholder="Select a layout template"
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={(layoutOptions || []).map((option) => ({
                        value: option.templateCode,
                        label: option.layoutDescription,
                        key: option.templateCode,
                      }))}
                    />
                  </Form.Item>
                  {/* Colour Selection */}
                  <Form.Item label="Colour" name="akiColor" colon={false} className="flex-grow" rules={[hexColorRule]}>
                    <Input type="color" className="w-full" onChange={(e) => handleColorChange(e, 'akiColor')} />
                  </Form.Item>
                  <Form.Item label="OR Enter hex colour value" name="akiColor" colon={false} className="flex-grow" rules={[hexColorRule]}>
                    <Input maxLength={7} placeholder="#RRGGBB" onChange={(e) => handleHexChange(e, 'akiColor')} />
                  </Form.Item>
                  <Form.Item label="Featured Product Background Colour" name="akiFeaturedProdBGColor" colon={false} className="flex-grow" rules={[hexColorRule]}>
                    <Input type="color" className="w-full" onChange={(e) => handleColorChange(e, 'akiFeaturedProdBGColor')} />
                  </Form.Item>
                  <Form.Item label="OR Enter hex colour value" name="akiFeaturedProdBGColor" colon={false} className="flex-grow" rules={[hexColorRule]}>
                    <Input maxLength={7} placeholder="#RRGGBB" onChange={(e) => handleHexChange(e, 'akiFeaturedProdBGColor')} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Department;
