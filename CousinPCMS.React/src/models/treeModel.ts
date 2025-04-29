export interface TreeNode {
  name?: string;
  title?: string;
  key: string;
  children?: TreeNode[];
  isDepartment?: boolean;
  isLeaf?: boolean;
  expanded?: boolean;
  parentId?: string | null;
  parentNode?: TreeNode | null;
  level?: number;
  isLast?: boolean;
}

export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isDepartment?: boolean;
  key?: string;
}
