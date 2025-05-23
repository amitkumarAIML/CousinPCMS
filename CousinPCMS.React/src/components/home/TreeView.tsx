import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Tree, Spin, Menu, Modal, Button} from 'antd';
import {EditOutlined, FolderOpenOutlined, FolderOutlined, PartitionOutlined, PlusOutlined} from '@ant-design/icons';
import type {TreeDataNode, TreeProps} from 'antd';
import type {EventDataNode, DataNode} from 'antd/es/tree';
import {Department} from '../../models/departmentModel';
import {CategoryModel, UpdateCategoryOrderRequest} from '../../models/categoryModel';
import {getDepartments} from '../../services/DepartmentService';
import {getCategoriesByDepartment, getDistinctAttributeSetsByCategoryId} from '../../services/HomeService';
import {useNavigate} from 'react-router';
import CategoryAttribute from './CategoryAttribute';
import {useNotification} from '../../hook/useNotification';
import {getSessionItem, setSessionItem} from '../../services/DataService';
import {useDroppable} from '@dnd-kit/core';
import {dragDropCategory} from '../../services/CategoryService';

interface CustomTreeDataNode extends TreeDataNode {
  dataType: 'department' | 'category';
  id: number | string;
  parentId?: string | number;
  data?: Department | CategoryModel;
  children?: CustomTreeDataNode[];
}

interface TreeViewProps {
  onCategorySelected: (categoryId: number | undefined) => void;
  onAttributeSetChange: () => void;
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

  // Ensure categories are sorted by list order before processing
  const sortedCategories = [...categories].sort((a, b) => (Number(a.akiCategoryListOrder) || 0) - (Number(b.akiCategoryListOrder) || 0));

  sortedCategories.forEach((cat) => {
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

  sortedCategories.forEach((cat) => {
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

// New component to wrap category titles to make them droppable
interface CategoryTitleWrapperProps {
  node: CustomTreeDataNode;
  children: React.ReactNode;
}
const CategoryTitleWrapper: React.FC<CategoryTitleWrapperProps> = ({node, children}) => {
  const {setNodeRef, isOver, active} = useDroppable({
    id: `droppable-category-${node.id}`, // Unique ID for the droppable area
    data: {
      type: 'category-target',
      categoryId: node.id, // The actual category ID
      nodeKey: node.key, // The tree node key, e.g., "cat-123"
      categoryName: node.dataType === 'category' && node.data ? (node.data as CategoryModel).akiCategoryName : `Category ${node.id}`,
    },
  });

  const highlight = isOver && active?.data.current?.type === 'product';

  return (
    <span
      ref={setNodeRef}
      style={{
        display: 'block',
        width: '100%',
        borderRadius: '3px',
        backgroundColor: highlight ? '#e6f7ff' : 'transparent',
        border: highlight ? '1px dashed #91d5ff' : '1px dashed transparent',
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
      }}
    >
      {children}
    </span>
  );
};

// Helper function defined outside the component
const findNodeByKey = (nodes: CustomTreeDataNode[], key: React.Key): CustomTreeDataNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

// Helper function defined outside the component
const findNodeAndParentDeptKeyInternal = (nodes: CustomTreeDataNode[], targetKey: React.Key, currentDeptKey: React.Key | null = null): {node: CustomTreeDataNode; deptKey: React.Key | null} | null => {
  for (const n of nodes) {
    let nextDeptKey = currentDeptKey;
    if (n.dataType === 'department') {
      nextDeptKey = n.key;
    }
    if (n.key === targetKey) {
      return {node: n, deptKey: nextDeptKey};
    }
    if (n.children) {
      const found = findNodeAndParentDeptKeyInternal(n.children, targetKey, nextDeptKey);
      if (found) return found;
    }
  }
  return null;
};

const TreeView: React.FC<TreeViewProps> = ({onCategorySelected, onAttributeSetChange}) => {
  const [treeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [categoryAttriisVisible, setCategoryAttriisVisible] = useState(false);
  const [categoryData, setCategoryData] = useState<CustomTreeDataNode | undefined>(undefined);
  const navigate = useNavigate();
  const notify = useNotification();
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: CustomTreeDataNode | null;
  }>({visible: false, x: 0, y: 0, node: null});

  useEffect(() => {
    const handleClick = () => setContextMenu((cm) => (cm.visible ? {...cm, visible: false} : cm));
    if (contextMenu.visible) {
      window.addEventListener('click', handleClick);
    }
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu.visible]);

  const onRightClick = useCallback((info: {event: React.MouseEvent; node: EventDataNode<DataNode>}) => {
    setContextMenu({
      visible: true,
      x: info.event.clientX,
      y: info.event.clientY,
      node: info.node as unknown as CustomTreeDataNode,
    });
    onSelect([info.node.key], info);
  }, []);

  const attributeSet = useCallback(
    async (node: CustomTreeDataNode) => {
      try {
        const response = await getDistinctAttributeSetsByCategoryId(String(node.id));
        if (response.value === null) {
          setCategoryAttriisVisible(true);
          setCategoryData(node);
        } else {
          notify.warning(`Attribute Set For ${getNodeTitleText(node)} is already added.`);
        }
      } catch (error) {
        console.error('Error in API call:', error);
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );

  const handleMenuClick = useCallback(
    (e: {key: string}) => {
      if (!contextMenu.node) return;
      if (e.key === 'add-department') {
        navigate('/departments/add');
      } else if (e.key === 'edit-department') {
        navigate('/departments/edit');
      } else if (e.key === 'add-category') {
        navigate('/category/add');
      } else if (e.key === 'edit-category') {
        navigate('/category/edit');
      } else if (e.key === 'add-sub-category') {
        navigate('/category/add');
      } else if (e.key === 'add-attribute-set') {
        attributeSet(contextMenu.node);
      }
      setContextMenu((cm) => ({...cm, visible: false}));
    },
    [contextMenu.node, navigate, attributeSet]
  );

  const getMenuItems = () => {
    if (!contextMenu.node) return [];
    if (contextMenu.node.dataType === 'department') {
      return [
        {key: 'add-department', icon: <PlusOutlined />, label: 'Add Department'},
        {key: 'edit-department', icon: <EditOutlined />, label: 'Edit Department'},
        {key: 'add-category', icon: <PlusOutlined />, label: 'Add Category'},
      ];
    } else if (contextMenu.node.dataType === 'category') {
      return [
        {key: 'edit-category', icon: <EditOutlined />, label: 'Edit Category'},
        {key: 'add-sub-category', icon: <PlusOutlined />, label: 'Add Sub Category'},
        {key: 'add-attribute-set', icon: <PlusOutlined />, label: 'Add Attribute Set'},
      ];
    }
    return [];
  };

  const handleAttributeModalCancel = () => {
    setCategoryAttriisVisible(false);
    onAttributeSetChange();
  };

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
        setSessionItem('departmentId', String((node.data as CategoryModel)?.akiDepartment ?? ''));
        setSessionItem('CategoryId', String(node.id));
        sessionStorage.removeItem('tempCategoryId');
        sessionStorage.removeItem('tempDepartmentId');
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('tempProductId');
        sessionStorage.removeItem('itemNumber');
        sessionStorage.removeItem('tempItemNumber');
        onCategorySelected(node.id as number);
        const deptId = findDepartmentIdForCategoryKey(node.key, treeData);
        if (deptId !== undefined) {
          setSessionItem('departmentId', String(deptId));
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
        sessionStorage.removeItem('tempCategoryId');
        sessionStorage.removeItem('CategoryId');
        sessionStorage.removeItem('tempDepartmentId');
        sessionStorage.removeItem('departmentId');
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('tempProductId');
        sessionStorage.removeItem('itemNumber');
        sessionStorage.removeItem('tempItemNumber');
        setSessionItem('departmentId', String(node.id));
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
          // const departments = response.value.filter((res: Department) => res.akiDepartmentIsActive).sort((a, b) => (Number(a.akiDepartmentListOrder) || 0) - (Number(b.akiDepartmentListOrder) || 0));
          const departments = response.value.sort((a, b) => (Number(a.akiDepartmentListOrder) || 0) - (Number(b.akiDepartmentListOrder) || 0));
          const deptNodes: CustomTreeDataNode[] = departments.map((dept: Department) => ({
            key: `dept-${dept.akiDepartmentID}`,
            title: (
              <span>
                <PartitionOutlined style={{marginRight: 6}} />
                {dept.akiDepartmentName.toUpperCase()}
              </span>
            ),
            id: dept.akiDepartmentID,
            dataType: 'department',
            isLeaf: false,
            data: dept,
          }));
          setTreeData(deptNodes);
          if (!getSessionItem('departmentId') && deptNodes.length > 0) {
            sessionStorage.removeItem('tempCategoryId');
            sessionStorage.removeItem('tempProductId');
            sessionStorage.removeItem('tempItemNumber');
            setSessionItem('tempDepartmentId', String(deptNodes[0].id));
            setExpandedKeys((prev) => Array.from(new Set([...prev, deptNodes[0].key])));
          } else {
            sessionStorage.removeItem('tempDepartmentId');
            sessionStorage.removeItem('tempCategoryId');
            sessionStorage.removeItem('tempProductId');
            sessionStorage.removeItem('tempItemNumber');
          }
        } else {
          setError('Failed to load departments.');
        }
      } catch (err) {
        setError('An error occurred while fetching departments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const updateDepartmentWithCategories = useCallback(
    (
      list: CustomTreeDataNode[], // The current segment of the tree being processed
      departmentKeyToUpdateChildren: React.Key, // The specific department whose children should be replaced
      newChildrenForSpecificDepartment: CustomTreeDataNode[] // The new children for that specific department
    ): CustomTreeDataNode[] => {
      return list.map((node) => {
        let newTitle = node.title;
        let newChildren = node.children;
        let newIsLeaf = node.isLeaf;

        // 1. Uppercase title for ALL department nodes encountered
        if (node.dataType === 'department') {
          const titleText = getNodeTitleText(node); // Get current text
          const icon = <PartitionOutlined style={{marginRight: 6}} />; // Department icon
          newTitle = (
            <span>
              {icon}
              {titleText.toUpperCase()} {/* UPPERCASE the text */}
            </span>
          );
        }

        // 2. Update children for the SPECIFIC department that was refreshed
        if (node.key === departmentKeyToUpdateChildren) {
          newChildren = newChildrenForSpecificDepartment.length > 0 ? newChildrenForSpecificDepartment : undefined;
          newIsLeaf = newChildrenForSpecificDepartment.length === 0;
        }

        // 3. Recursively process children for all nodes
        if (node.children) {
          const processedOriginalChildren = updateDepartmentWithCategories(
            node.children, // original children of current node
            departmentKeyToUpdateChildren,
            newChildrenForSpecificDepartment
          );
          if (node.key === departmentKeyToUpdateChildren) {
            newChildren = newChildrenForSpecificDepartment.length > 0 ? newChildrenForSpecificDepartment : undefined;
            newIsLeaf = newChildrenForSpecificDepartment.length === 0;
          } else {
            newChildren = processedOriginalChildren;
            if (newChildren) newIsLeaf = newChildren.length === 0;
          }
        }

        return {
          ...node,
          title: newTitle,
          children: newChildren,
          isLeaf: newIsLeaf,
        };
      });
    },
    []
  );

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
            // const categories = response.value.filter((res: CategoryModel) => res.akiCategoryIsActive)
            categoryNodes = buildCategoryTree(response.value, selectedKeys);
          } else {
            // notify.error(`Failed to load categories for department ${getNodeTitleText(customNode)}.`);
          }

          setTreeData((current) => updateDepartmentWithCategories(current, key, categoryNodes));
          if (getSessionItem('tempDepartmentId') && expandedKeys.length < 1 && categoryNodes.length > 0) {
            setSessionItem('tempCategoryId', String(categoryNodes[0].id));
            setSelectedKeys((prev) => [...prev, categoryNodes[0].key]);
            onCategorySelected(categoryNodes[0].id as number);
          } else {
            // sessionStorage.removeItem('tempCategoryId');
          }
        })
        .catch(() => {
          notify.error(`Error loading categories for department ${getNodeTitleText(customNode)}.`);
          setTreeData((current) => updateDepartmentWithCategories(current, key, []));
        });
    },
    [updateDepartmentWithCategories, selectedKeys, onCategorySelected, notify]
  );

  // Helper function to strip prefixes like "cat-" or "dep-"
  const stripIdPrefix = (key: React.Key | null): number | string | null => {
    if (key === null || key === undefined) {
      return null;
    }
    const keyStr = String(key);
    const lastHyphenIndex = keyStr.lastIndexOf('-');

    if (lastHyphenIndex !== -1 && lastHyphenIndex < keyStr.length - 1) {
      const idPart = keyStr.substring(lastHyphenIndex + 1);
      const numId = Number(idPart);
      if (!isNaN(numId) && String(numId) === idPart) {
        return numId;
      }
      return idPart;
    }

    const numKey = Number(keyStr);
    if (!isNaN(numKey) && String(numKey) === keyStr) {
      return numKey;
    }

    return keyStr;
  };

  const onDrop: TreeProps['onDrop'] = useCallback(
    async (info: Parameters<NonNullable<TreeProps['onDrop']>>[0]) => {
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
      const dropNodeContextInTree = findNodeByKey(treeData, dropKey);

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
          node.children = node.children.map((child) => resetTitle(child));
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
        let ar: CustomTreeDataNode[] = [];
        let i: number = -1;
        const findDropLocation = (nodes: CustomTreeDataNode[], key: React.Key): boolean => {
          for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].key === key) {
              ar = nodes;
              i = index;
              return true;
            }
            if (nodes[index].children) {
              if (findDropLocation(nodes[index].children!, key)) {
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
      const req: UpdateCategoryOrderRequest = {
        categoryid: stripIdPrefix(dragKey)?.toString(),
        abovecategoryid: '0',
        belowcategoryid: '0',
        parentid: '0',
        departmentid: '0',
      };

      let identifiedParentKey: React.Key | null = null;
      const findNodeAndSiblings = (nodesToSearch: CustomTreeDataNode[], key: React.Key, currentParentKey: React.Key | null = null): boolean => {
        for (let idx = 0; idx < nodesToSearch.length; idx++) {
          const currentNode = nodesToSearch[idx];
          if (currentNode.key === key) {
            identifiedParentKey = currentParentKey;
            if (idx > 0) {
              req.abovecategoryid = stripIdPrefix(nodesToSearch[idx - 1].key)?.toString();
            }
            if (idx < nodesToSearch.length - 1) {
              req.belowcategoryid = stripIdPrefix(nodesToSearch[idx + 1].key)?.toString();
            }
            return true;
          }
          if (currentNode.children) {
            if (findNodeAndSiblings(currentNode.children!, key, currentNode.key)) {
              return true;
            }
          }
        }
        return false;
      };

      findNodeAndSiblings(updatedData, dragKey);

      // Determine parentid and departmentid based on the identified parent
      if (identifiedParentKey) {
        const parentNode = findNodeByKey(updatedData, identifiedParentKey);
        if (parentNode) {
          if (parentNode.dataType === 'department') {
            // Parent is a department: category is top-level in this department
            req.parentid = '0'; // As per instruction
            const deptId = stripIdPrefix(parentNode.key)?.toString();
            if (deptId) req.departmentid = deptId; // Pass department ID
            // If deptId is undefined, req.departmentid remains '0' (safer default)
          } else if (parentNode.dataType === 'category') {
            // Parent is another category
            const parentCatId = stripIdPrefix(parentNode.key)?.toString();
            if (parentCatId) req.parentid = parentCatId; // Pass parent category ID
            // If parentCatId is undefined, req.parentid remains '0'
            req.departmentid = '0'; // Department ID is '0' as parent is a category
          } else {
            // Parent is of an unknown type or dataType is not set
            // Defaults (parentid='0', departmentid='0') will be used. Log a warning.
            console.warn(`Parent node (${parentNode.key}) has an unexpected dataType: '${parentNode.dataType}'. Using default parent/department IDs.`);
          }
        } else {
          // Should not happen if identifiedParentKey is valid and from updatedData
          console.error(`Could not find parent node object in updatedData for key: ${identifiedParentKey}. Using default parent/department IDs.`);
        }
      } else {
        console.warn(`Node (${dragKey}) is at the root of the data structure after move. Ensure parentid='0' and departmentid='0' is the correct representation for this state.`);
      }

      setLoading(true);
      try {
        const apiResponse = await dragDropCategory(req);
        if (apiResponse.isSuccess) {
          notify.success('Category order updated!');

          let departmentToRefreshId: string | number | undefined;
          let departmentToRefreshKey: React.Key | undefined;

          if (dropNodeContextInTree?.dataType === 'department') {
            departmentToRefreshId = dropNodeContextInTree.id;
            departmentToRefreshKey = dropNodeContextInTree.key;
          } else {
            const parentDeptInfo = dropNodeContextInTree ? findNodeAndParentDeptKeyInternal(treeData, dropNodeContextInTree.key) : null;
            if (parentDeptInfo && parentDeptInfo.deptKey) {
              departmentToRefreshKey = parentDeptInfo.deptKey;
              const deptNode = findNodeByKey(treeData, departmentToRefreshKey);
              if (deptNode) departmentToRefreshId = deptNode.id;
            }
          }

          if (departmentToRefreshId && departmentToRefreshKey) {
            const categoriesResponse = await getCategoriesByDepartment(String(departmentToRefreshId));
            if (categoriesResponse?.isSuccess && Array.isArray(categoriesResponse.value)) {
              const newCategoryNodes = buildCategoryTree(categoriesResponse.value, selectedKeys);
              setTreeData(updateDepartmentWithCategories(updatedData, departmentToRefreshKey, newCategoryNodes));
              if (!expandedKeys.includes(departmentToRefreshKey)) {
                setExpandedKeys((prev) => Array.from(new Set([...prev, departmentToRefreshKey!])));
              }
            } else {
              notify.error(`Failed to refresh categories for department.`);
            }
          } else {
            notify.error('Failed to update category order on the server.');
          }
        } else {
          notify.warning('Could not determine the department to refresh. Tree might be outdated.');
        }
      } catch (error: any) {
        console.error('API Error updating category order:', error);
        notify.error(error.message || 'An error occurred while updating order.');
      } finally {
        setLoading(false);
      }
    },
    [treeData, notify, selectedKeys, expandedKeys, updateDepartmentWithCategories]
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

        let finalTitle: React.ReactNode = newTitle;
        if (node.dataType === 'category') {
          // Wrap category title content with the droppable wrapper
          finalTitle = <CategoryTitleWrapper node={node}>{newTitle}</CategoryTitleWrapper>;
        }

        return {
          ...node,
          title: finalTitle,
          children: node.children ? mapNodesWithIcons(node.children) : undefined,
        };
      });
    };
    return mapNodesWithIcons(treeData);
  }, [treeData, selectedKeys]);

  useEffect(() => {
    if (loading || treeData.length === 0) return;

    const savedDeptId = getSessionItem('departmentId');
    const savedCatId = getSessionItem('CategoryId');
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

  const isNodeDescendant = (
    nodes: CustomTreeDataNode[], // The full tree data or relevant part
    parentKey: React.Key,
    childKey: React.Key
  ): boolean => {
    // Find the potential parent node in the provided 'nodes' array
    const parentNode = findNodeByKey(nodes, parentKey);

    // If the parent node doesn't exist or has no children, the childKey cannot be a descendant
    if (!parentNode || !parentNode.children || parentNode.children.length === 0) {
      return false;
    }

    // Recursive function to search within the children of the parentNode
    const findInChildren = (children: CustomTreeDataNode[], keyToFind: React.Key): boolean => {
      for (const child of children) {
        if (child.key === keyToFind) return true; // Found the childKey
        if (child.children && child.children.length > 0) {
          // If the current child has its own children, search recursively
          if (findInChildren(child.children, keyToFind)) return true;
        }
      }
      return false; // childKey not found in this branch
    };

    // Start the search from the direct children of the parentNode
    return findInChildren(parentNode.children, childKey);
  };

  const allowDropFunc = useCallback(
    (options: {
      dragNode: DataNode; // Accept generic DataNode
      dropNode: DataNode; // Accept generic DataNode
      dropPosition: -1 | 0 | 1;
    }): boolean => {
      // Type assertion/guard to use CustomTreeDataNode properties
      const dragItem = options.dragNode as CustomTreeDataNode;
      const dropItem = options.dropNode as CustomTreeDataNode;
      const {dropPosition} = options;

      // It's good practice to check if the assertion is valid,
      // especially if your tree could theoretically contain non-CustomTreeDataNode items.
      if (!dragItem.dataType || !dropItem.dataType) {
        // This might happen if a node doesn't have 'dataType',
        // though your setup implies all nodes will be CustomTreeDataNode.
        console.warn('AllowDrop: dragNode or dropNode is not a CustomTreeDataNode as expected.');
        return false;
      }

      if (dragItem.dataType !== 'category') {
        return false;
      }

      if (dragItem.key === dropItem.key) {
        return false;
      }

      // Pass treeData (which is CustomTreeDataNode[]) to isNodeDescendant
      if (isNodeDescendant(treeData, dragItem.key, dropItem.key)) {
        return false;
      }

      if (dropItem.dataType === 'department') {
        const allowed = dropPosition === 0;
        return allowed;
      }

      if (dropItem.dataType === 'category') {
        return true;
      }

      return false;
    },
    [treeData]
  );

  const treeProps = useMemo<TreeProps>(
    () => ({
      showIcon: true,
      icon: null,
      // draggable: (node) => (node as CustomTreeDataNode).dataType !== 'department',
      draggable: true,
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
      virtual: false,
      onRightClick,
      allowDrop: allowDropFunc,
    }),
    [displayTreeData, onLoadData, onDrop, expandedKeys, selectedKeys, onSelect, onRightClick, allowDropFunc]
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

  return (
    <div style={{position: 'relative'}}>
      <Spin tip="Updating data..." spinning={loading}>
        <div className="text-[11px] bg-light-border rounded-md p-2 text-primary-font">
          <span>Departments & Categories</span>
        </div>
        <Tree {...treeProps} />
        {displayTreeData && displayTreeData.length === 0 && <span className="flex items-center justify-center h-12 text-secondary-font text-[10px] text-center">{'No Data'}</span>}
        {contextMenu.visible && (
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 4,
              minWidth: 180,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Menu onClick={handleMenuClick} items={getMenuItems()} />
          </div>
        )}
      </Spin>
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Attribute Set Form</span>
            <Button type="default" onClick={handleAttributeModalCancel}>
              Close
            </Button>
          </div>
        }
        open={categoryAttriisVisible}
        onCancel={handleAttributeModalCancel}
        footer={null}
        width={1100}
        destroyOnClose
        closable={false}
      >
        {categoryData && <CategoryAttribute categoryData={categoryData} onDataChange={handleAttributeModalCancel} />}
      </Modal>
    </div>
  );
};

export default TreeView;
