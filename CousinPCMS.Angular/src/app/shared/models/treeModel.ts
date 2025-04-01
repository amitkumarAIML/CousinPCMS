export interface TreeNode {
  name?: string;
  title?: string; // Added for nz-tree compatibility
  key: string;   // Added for nz-tree compatibility
  children?: TreeNode[];
  isDepartment?: boolean;
  isLeaf?: boolean; // Added for nz-tree compatibility
  expanded?: boolean; // Added for nz-tree compatibility
  parentId?: string | null; // Added for parent tracking
  parentNode?: TreeNode | null;
  level?: number;
}

export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isDepartment?: boolean;
  key?: string;   // Added for nz-tree compatibility
}
