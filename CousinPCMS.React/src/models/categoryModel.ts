export interface CategoryModel {
  akiCategoryID: string | number;
  akiCategoryParentID: string | number;
  akiCategoryName: string;
  akiCategoryIsActive: boolean;
  akiDepartment?: string | number;
  selected?: boolean;
}
