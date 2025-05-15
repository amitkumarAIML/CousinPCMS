export interface CategoryModel {
  akiCategoryID: string | number;
  akiCategoryParentID: string | number;
  akiCategoryName: string;
  akiCategoryIsActive: boolean;
  akiDepartment?: string | number;
  selected?: boolean;
}

export interface UpdateCategoryOrderRequest {
  categoryid?: string; 
  abovecategoryid?: string; 
  belowcategoryid?: string;
  parentid?: string
}
