import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Tree, Spin, message} from 'antd';
import {FolderOutlined, PartitionOutlined} from '@ant-design/icons';
import type {TreeDataNode, TreeProps} from 'antd';
import type {EventDataNode, DataNode} from 'antd/es/tree';
import {Department} from '../../models/departmentModel';
import {CategoryModel} from '../../models/categoryModel';
import {getDepartments} from '../../services/DepartmentService';
import {getCategoriesByDepartment} from '../../services/HomeService';

interface CustomTreeDataNode extends TreeDataNode {
  dataType: 'department' | 'category';
  id: number | string;
  parentId?: string | number;
  data?: Department | CategoryModel;
  children?: CustomTreeDataNode[];
}

const buildCategoryTree = (categories: CategoryModel[]): CustomTreeDataNode[] => {
  const categoryMap: Record<string, CustomTreeDataNode> = {};
  const rootCategories: CustomTreeDataNode[] = [];
  categories.forEach((cat) => {
    const node: CustomTreeDataNode = {
      key: `cat-${cat.akiCategoryID}`,
      title: (
        <span>
          <FolderOutlined style={{marginRight: 6}} />
          {cat.akiCategoryName}
        </span>
      ),
      id: cat.akiCategoryID,
      parentId: cat.akiCategoryParentID,
      dataType: 'category',
      isLeaf: true,
      data: cat,
    };
    categoryMap[cat.akiCategoryID] = node;
  });
  categories.forEach((cat) => {
    const node = categoryMap[cat.akiCategoryID];
    if (cat.akiCategoryParentID === '0' || !categoryMap[cat.akiCategoryParentID]) {
      rootCategories.push(node);
    } else {
      const parentNode = categoryMap[cat.akiCategoryParentID];
      if (parentNode) {
        parentNode.isLeaf = false;
        parentNode.children = parentNode.children || [];
        parentNode.children.push(node);
      } else {
        rootCategories.push(node);
      }
    }
  });
  return rootCategories;
};

const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const findDepartmentIdForCategoryKey = useCallback(
    (key: React.Key, nodes: CustomTreeDataNode[], parentDeptId?: string | number): string | number | undefined => {
      for (const node of nodes) {
        if (node.key === key) return parentDeptId;
        if (node.dataType === 'department' && node.children) {
          const found = findDepartmentIdForCategoryKey(key, node.children, node.id);
          if (found !== undefined) return found;
        } else if (node.children) {
          const found = findDepartmentIdForCategoryKey(key, node.children, parentDeptId);
          if (found !== undefined) return found;
        }
      }
      return undefined;
    },
    []
  );

  const onSelect = useCallback(
    (selectedKeys: React.Key[], info: { node: EventDataNode<DataNode> }) => {
      setSelectedKeys(selectedKeys);
      const node = info.node as unknown as CustomTreeDataNode;
      if (node.dataType === 'category') {
        sessionStorage.setItem('selectedCategoryId', String(node.id));
        const deptId = findDepartmentIdForCategoryKey(node.key, treeData);
        if (deptId !== undefined) {
          sessionStorage.setItem('selectedDepartmentId', String(deptId));
          // Expand department and all parent categories
          const getPath = (key: React.Key, nodes: CustomTreeDataNode[], path: React.Key[] = []): React.Key[] | null => {
            for (const n of nodes) {
              if (n.key === key) return [...path, n.key];
              if (n.children) {
                const res = getPath(key, n.children, [...path, n.key]);
                if (res) return res;
              }
            }
            return null;
          };
          const path = getPath(node.key, treeData);
          if (path) setExpandedKeys(path.slice(0, -1));
        }
      } else if (node.dataType === 'department') {
        sessionStorage.setItem('selectedDepartmentId', String(node.id));
        sessionStorage.removeItem('selectedCategoryId');
        setExpandedKeys([node.key]);
      }
    },
    [treeData, findDepartmentIdForCategoryKey]
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDepartments();
        if (response?.isSuccess && Array.isArray(response.value)) {
          const deptNodes: CustomTreeDataNode[] = response.value.map((dept: Department) => ({
            key: `dept-${dept.akiDepartmentID}`,
            title: (
              <span>
                <PartitionOutlined style={{marginRight: 6}} />
                {dept.akiDepartmentName}
              </span>
            ),
            id: dept.akiDepartmentID,
            dataType: 'department',
            isLeaf: false,
            data: dept,
          }));
          setTreeData(deptNodes);
        } else {
          setError('Failed to load departments.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const updateTreeData = useCallback((list: CustomTreeDataNode[], key: React.Key, children: CustomTreeDataNode[]): CustomTreeDataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        return {...node, children};
      }
      if (node.children) {
        return {...node, children: updateTreeData(node.children, key, children)};
      }
      return node;
    });
  }, []);

  const onLoadData = useCallback(
    (treeNode: EventDataNode<DataNode>): Promise<void> => {
      const customNode = treeNode as unknown as CustomTreeDataNode;
      const {key, children, dataType, id} = customNode;
      if (children || dataType !== 'department') {
        return Promise.resolve();
      }
      return getCategoriesByDepartment(String(id))
        .then((response) => {
          if (response?.isSuccess && Array.isArray(response.value)) {
            const categoryNodes = buildCategoryTree(response.value);
            setTreeData((current) => updateTreeData(current, key, categoryNodes));
          } else {
            setTreeData((current) => updateTreeData(current, key, []));
          }
        })
        .catch(() => {
          setTreeData((current) => updateTreeData(current, key, []));
          message.error('Failed to load categories.');
        });
    },
    [updateTreeData]
  );

  const onDrop: TreeProps['onDrop'] = useCallback(
    (info: Parameters<NonNullable<TreeProps['onDrop']>>[0]) => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const data = JSON.parse(JSON.stringify(treeData)) as CustomTreeDataNode[];
      let dragObj: CustomTreeDataNode | undefined;
      const loop = (data: CustomTreeDataNode[], key: React.Key, callback: (node: CustomTreeDataNode, i: number, data: CustomTreeDataNode[]) => void): void => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children!, key, callback);
          }
        }
      };
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!dragObj) return;
      const wrapTitle = (node: CustomTreeDataNode): CustomTreeDataNode => {
        if (node.dataType === 'department') {
          node.title = (
            <span>
              <PartitionOutlined style={{marginRight: 6}} />
              {'data' in node && node.data && 'akiDepartmentName' in node.data ? node.data.akiDepartmentName : ''}
            </span>
          );
        } else {
          node.title = (
            <span>
              <FolderOutlined style={{marginRight: 6}} />
              {'data' in node && node.data && 'akiCategoryName' in node.data ? node.data.akiCategoryName : ''}
            </span>
          );
        }
        if (node.children) {
          node.children = node.children.map(wrapTitle);
        }
        return node;
      };
      const cleanupEmptyParents = (data: CustomTreeDataNode[]): CustomTreeDataNode[] => {
        return data.map((node) => {
          if (node.children && node.children.length === 0) {
            return {...node, children: undefined, isLeaf: true};
          }
          if (node.children) {
            return {...node, children: cleanupEmptyParents(node.children)};
          }
          return node;
        });
      };
      if (!info.dropToGap) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj!);
          item.isLeaf = false;
        });
      } else {
        let ar: CustomTreeDataNode[] = [];
        let i: number = -1;
        loop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      const updatedData = cleanupEmptyParents(data).map(wrapTitle);
      setTreeData(updatedData);
    },
    [treeData]
  );

  const treeProps = useMemo<TreeProps>(
    () => ({
      showIcon: true,
      draggable: true,
      blockNode: true,
      showLine: {showLeafIcon: false},
      loadData: onLoadData,
      onDrop,
      treeData,
      expandedKeys,
      onExpand: setExpandedKeys,
      selectedKeys,
      onSelect,
      height: 800,
      virtual: true,
    }),
    [onLoadData, onDrop, treeData, expandedKeys, selectedKeys, onSelect]
  );

  useEffect(() => {
    const savedDeptId = sessionStorage.getItem('selectedDepartmentId');
    const savedCatId = sessionStorage.getItem('selectedCategoryId');
    if (savedDeptId) setExpandedKeys([`dept-${savedDeptId}`]);
    if (savedCatId) setSelectedKeys([`cat-${savedCatId}`]);
  }, []);

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }
  return <Tree {...treeProps} />;
};

export default TreeView;
