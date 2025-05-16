export interface CategoryModel {
  akiCategoryID: string | number;
  akiCategoryParentID: string | number;
  akiCategoryName: string;
  akiCategoryIsActive: boolean;
  akiDepartment?: string | number;
  selected?: boolean;
  akiCategoryListOrder: number;
  akiDepartmentID: number;
  
}

export interface UpdateCategoryOrderRequest {
  categoryid?: string; 
  abovecategoryid?: string; 
  belowcategoryid?: string;
  parentid?: string
}
