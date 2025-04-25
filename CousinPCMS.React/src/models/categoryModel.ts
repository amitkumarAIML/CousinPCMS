export interface CategoryModel {
  akiCategoryID: string | number;
  akiCategoryParentID?: string | number | null;
  akiCategoryName: string;
  akiCategoryIsActive: boolean;
  akiDepartment?: string | number;
}
