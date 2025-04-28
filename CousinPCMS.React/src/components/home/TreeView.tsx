import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Tree, Spin, message} from 'antd';
import {FolderOpenOutlined, FolderOutlined, PartitionOutlined} from '@ant-design/icons';
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

interface TreeViewProps {
  onCategorySelected: (categoryId: number | undefined) => void;
}

const getNodeTitleText = (node: CustomTreeDataNode): string => {
  if (React.isValidElement(node.title) && typeof node.title.props === 'object' && node.title.props !== null && 'children' in node.title.props) {
    const children = React.Children.toArray((node.title.props as {children?: React.ReactNode}).children);
    if (children.length > 1 && typeof children[1] === 'string') {
      return children[1];
    }
  }
  if (node.data) {
    return node.dataType === 'department' ? (node.data as Department).akiDepartmentName ?? `Dept ${node.id}` : (node.data as CategoryModel).akiCategoryName ?? `Cat ${node.id}`;
  }
  return `Node ${node.key}`;
};

const buildCategoryTree = (categories: CategoryModel[], selectedKeys: React.Key[]): CustomTreeDataNode[] => {
  const categoryMap: Record<string, CustomTreeDataNode> = {};
  const rootCategories: CustomTreeDataNode[] = [];

  categories.forEach((cat) => {
    const key = `cat-${cat.akiCategoryID}`;
    const isSelected = selectedKeys.includes(key);
    const node: CustomTreeDataNode = {
      key: key,
      title: (
        <span>
          {isSelected ? <FolderOpenOutlined style={{marginRight: 6}} /> : <FolderOutlined style={{marginRight: 6}} />}
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
        parentNode.title = (
          <span>
            <FolderOutlined style={{marginRight: 6}} />
            {getNodeTitleText(parentNode)}
          </span>
        );
      } else {
        rootCategories.push(node);
      }
    }
  });

  return rootCategories;
};
const TreeView: React.FC<TreeViewProps> = ({onCategorySelected}) => {
  const [treeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const findDepartmentIdForCategoryKey = useCallback((key: React.Key, nodes: CustomTreeDataNode[], parentDeptId?: string | number): string | number | undefined => {
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
  }, []);

  const onSelect = useCallback(
    (selectedKeysValue: React.Key[], info: {node: EventDataNode<DataNode>}) => {
      setSelectedKeys(selectedKeysValue);

      const node = info.node as unknown as CustomTreeDataNode;
      if (node.dataType === 'category') {
        sessionStorage.setItem('CategoryId', String(node.id));
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
        onCategorySelected(node.id as number);
        const deptId = findDepartmentIdForCategoryKey(node.key, treeData);
        if (deptId !== undefined) {
          sessionStorage.setItem('departmentId', String(deptId));
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
          if (path) setExpandedKeys((prev) => [...prev, ...path.slice(0, -1)]);
        }
      } else if (node.dataType === 'department') {
        sessionStorage.setItem('departmentId', String(node.id));
        sessionStorage.removeItem('CategoryId');
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
        onCategorySelected(undefined);
      }
    },
    [treeData, findDepartmentIdForCategoryKey, onCategorySelected]
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
          message.error('Failed to load departments.');
        }
      } catch (err) {
        setError('An error occurred while fetching departments.');
        message.error('An error occurred while fetching departments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const updateTreeData = useCallback((list: CustomTreeDataNode[], key: React.Key, children: CustomTreeDataNode[]): CustomTreeDataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        const titleText = getNodeTitleText(node);
        const icon = node.dataType === 'category' ? <FolderOutlined style={{marginRight: 6}} /> : <PartitionOutlined style={{marginRight: 6}} />;
        return {
          ...node,
          title: (
            <span>
              {icon}
              {titleText}
            </span>
          ),
          children: children.length > 0 ? children : undefined,
          isLeaf: children.length === 0,
        };
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
          let categoryNodes: CustomTreeDataNode[] = [];
          if (response?.isSuccess && Array.isArray(response.value)) {
            categoryNodes = buildCategoryTree(response.value, selectedKeys);
          } else {
            message.error(`Failed to load categories for department ${getNodeTitleText(customNode)}.`);
          }
          setTreeData((current) => updateTreeData(current, key, categoryNodes));
        })
        .catch(() => {
          message.error(`Error loading categories for department ${getNodeTitleText(customNode)}.`);
          setTreeData((current) => updateTreeData(current, key, []));
        });
    },
    [updateTreeData, selectedKeys]
  );

  const onDrop: TreeProps['onDrop'] = useCallback(
    (info: Parameters<NonNullable<TreeProps['onDrop']>>[0]) => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const data: CustomTreeDataNode[] = JSON.parse(JSON.stringify(treeData));

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

      if (!dragObj) {
        console.error('Dragged object not found');
        return;
      }

      const resetTitle = (node: CustomTreeDataNode): CustomTreeDataNode => {
        const titleText = getNodeTitleText(node);
        let icon = null;
        if (node.dataType === 'department') {
          icon = <PartitionOutlined style={{marginRight: 6}} />;
        } else if (node.dataType === 'category') {
          icon = <FolderOutlined style={{marginRight: 6}} />;
        }
        node.title = (
          <span>
            {icon}
            {titleText}
          </span>
        );
        if (node.children) {
          node.children = node.children.map(resetTitle);
        }
        return node;
      };
      dragObj = resetTitle(dragObj);

      if (!info.dropToGap) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj!);
          item.isLeaf = false;
          item = resetTitle(item);
        });
      } else {
        // Drop between nodes
        let ar: CustomTreeDataNode[] = [];
        let i: number = -1;
        let targetNodeParentChildren: CustomTreeDataNode[] | null = null;

        // Find drop target node's location
        const findDropLocation = (nodes: CustomTreeDataNode[], key: React.Key): boolean => {
          for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].key === key) {
              ar = nodes;
              i = index;
              targetNodeParentChildren = nodes;
              return true;
            }
            if (nodes[index].children) {
              if (findDropLocation(nodes[index].children!, key)) {
                targetNodeParentChildren = nodes[index].children!;
                return true;
              }
            }
          }
          return false;
        };
        findDropLocation(data, dropKey);

        if (i !== -1) {
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
          } else {
            ar.splice(i + 1, 0, dragObj);
          }
        } else {
          console.error('Drop target key not found in loop');
          data.push(dragObj);
        }
      }

      const cleanupEmptyParents = (nodes: CustomTreeDataNode[]): CustomTreeDataNode[] => {
        return nodes
          .map((node) => {
            if (node.children) {
              node.children = cleanupEmptyParents(node.children);
              if (node.children.length === 0) {
                const titleText = getNodeTitleText(node);
                const icon = node.dataType === 'category' ? <FolderOutlined style={{marginRight: 6}} /> : <PartitionOutlined style={{marginRight: 6}} />;
                return {
                  ...node,
                  title: (
                    <span>
                      {icon}
                      {titleText}
                    </span>
                  ),
                  children: undefined,
                  isLeaf: true,
                };
              }
            }
            return node;
          })
          .filter((node) => node !== undefined);
      };

      const updatedData = cleanupEmptyParents(data);
      setTreeData(updatedData);
    },
    [treeData]
  );

  const displayTreeData = useMemo(() => {
    const mapNodesWithIcons = (nodes: CustomTreeDataNode[]): CustomTreeDataNode[] => {
      return nodes.map((node) => {
        let icon = null;
        const titleText = getNodeTitleText(node);

        if (node.dataType === 'department') {
          icon = <PartitionOutlined style={{marginRight: 6}} />;
        } else if (node.dataType === 'category') {
          const isSelected = selectedKeys.includes(node.key);
          icon = isSelected ? <FolderOpenOutlined style={{marginRight: 6}} /> : <FolderOutlined style={{marginRight: 6}} />;
        }

        const newTitle = (
          <span>
            {icon}
            {titleText}
          </span>
        );

        return {
          ...node,
          title: newTitle,
          children: node.children ? mapNodesWithIcons(node.children) : undefined,
        };
      });
    };
    return mapNodesWithIcons(treeData);
  }, [treeData, selectedKeys]);

  useEffect(() => {
    if (loading || treeData.length === 0) return;

    const savedDeptId = sessionStorage.getItem('departmentId');
    const savedCatId = sessionStorage.getItem('CategoryId');
    let initialSelectedKey: React.Key | null = null;
    let keysToExpand: React.Key[] = [];

    const findNodeAndPath = (key: React.Key, nodes: CustomTreeDataNode[], path: React.Key[] = []): {node: CustomTreeDataNode; path: React.Key[]} | null => {
      for (const n of nodes) {
        const currentPath = [...path, n.key];
        if (n.key === key) return {node: n, path: currentPath};
        if (n.children) {
          const result = findNodeAndPath(key, n.children, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    if (savedCatId) {
      const catKey = `cat-${savedCatId}`;
      const result = findNodeAndPath(catKey, treeData);
      if (result) {
        initialSelectedKey = catKey;
        keysToExpand = result.path.slice(0, -1);
        const deptId = findDepartmentIdForCategoryKey(catKey, treeData);
        if (deptId) {
          keysToExpand.unshift(`dept-${deptId}`);
        }
        // Call onCategorySelected if category is found in tree
        onCategorySelected(Number(savedCatId));
      } else if (savedDeptId) {
        const deptKey = `dept-${savedDeptId}`;
        const deptResult = findNodeAndPath(deptKey, treeData);
        if (deptResult) {
          initialSelectedKey = null;
          keysToExpand = [deptKey];
        }
      }
    } else if (savedDeptId) {
      const deptKey = `dept-${savedDeptId}`;
      const deptResult = findNodeAndPath(deptKey, treeData);
      if (deptResult) {
        initialSelectedKey = deptKey;
        keysToExpand = [deptKey];
      }
    }

    if (initialSelectedKey) {
      setSelectedKeys([initialSelectedKey]);
    }
    if (keysToExpand.length > 0) {
      setExpandedKeys((prev) => Array.from(new Set([...prev, ...keysToExpand])));
    }
  }, [loading, treeData, findDepartmentIdForCategoryKey, onCategorySelected]);

  const treeProps = useMemo<TreeProps>(
    () => ({
      showIcon: true,
      icon: null,
      draggable: (node) => (node as CustomTreeDataNode).dataType !== 'department',
      blockNode: true,
      showLine: {showLeafIcon: false},
      loadData: onLoadData,
      onDrop,
      treeData: displayTreeData,
      expandedKeys,
      onExpand: setExpandedKeys,
      selectedKeys,
      onSelect,
      height: 800,
      virtual: true,
    }),
    [displayTreeData, onLoadData, onDrop, expandedKeys, selectedKeys, onSelect]
  );

  if (loading && treeData.length === 0) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div style={{color: 'red', padding: 10}}>Error: {error}</div>;
  }

  return <Tree {...treeProps} />;
};

export default TreeView;
