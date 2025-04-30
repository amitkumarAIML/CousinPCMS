export const CategoryCharLimit = {
    akiCategoryName: 100,
    akiCategoryImageURL: 255,
    akiCategoryDescriptionText:5000
  } as const;
  
  export const DepartmentCharLimit = {
    akiDepartmentName: 100,
    akiDepartmentDescText: 5000,
    akiDepartmentImageURL: 255,
    akiDepartmentKeyWords: 500
  } as const;
  
  export const ProductCharLimit = {
    akiProductName: 200,
    akiProductDescription: 5000,
    akiProductImageURL: 255
  } as const;
  
  export const ItemCharLimit = {
    akiitemid: 31,
    akiManufacturerRef: 50,
    akiSKUDescription: 2000,
    skuName: 200,
    akiImageURL: 255
  } as const;
  
  export const AttributeFormCharLimit = {
    attributeName: 50,
    attributeDescription: 100,
  };