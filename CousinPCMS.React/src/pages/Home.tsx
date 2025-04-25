import React, {useState, useEffect, useCallback} from 'react';
import {Tree, Spin, Modal} from 'antd';
import {PartitionOutlined, FolderOutlined, FolderOpenOutlined} from '@ant-design/icons';
import type {TreeProps} from 'antd/es/tree';
import type {DataNode, EventDataNode} from 'antd/es/tree';

// --- Import Services and Types ---
import * as homeService from '../services/HomeService';
import {showNotification} from '../services/DataService';
import type {Department, DepartmentResponse} from '../models/departmentModel';
import type {CategoryModel} from '../models/categoryModel';

// --- Define Tree Node Structure (matching Ant Design + custom flags) ---
interface AppTreeNode extends DataNode {
  key: string | number;
  title: React.ReactNode;
  children?: AppTreeNode[];
  isLeaf?: boolean;
  isDepartment?: boolean;
  level?: number;
  originData?: Department | CategoryModel;
}

// --- Component Props ---
interface TreeViewProps {
  // Example prop: initial selection persistence or control
  // initialSelectedKey?: string | number | null;
  onCategorySelected?: (key: string | number, nodeData: AppTreeNode) => void; // Pass selected key and node data
}

const Home: React.FC<TreeViewProps> = ({onCategorySelected}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<AppTreeNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalContextData, setModalContextData] = useState<{categoryId: string | number; categoryName: React.ReactNode} | null>(null);

  // --- Utility: Build Category Subtree ---
  const buildCategoryTree = useCallback((categories: CategoryModel[]): AppTreeNode[] => {
    const categoryMap = new Map<string, AppTreeNode>();
    // First pass: create all nodes
    for (const category of categories) {
      const categoryID = String(category.akiCategoryID);
      categoryMap.set(categoryID, {
        title: category.akiCategoryName,
        key: categoryID,
        isLeaf: true,
        children: [],
        level: 1,
        isDepartment: false,
        originData: category,
      });
    }
    // Second pass: link children to parents
    const tree: AppTreeNode[] = [];
    for (const category of categories) {
      const categoryID = String(category.akiCategoryID);
      const parentID = category.akiCategoryParentID ? String(category.akiCategoryParentID) : null;
      const node = categoryMap.get(categoryID);
      if (!node) continue;
      if (parentID && parentID !== '0' && categoryMap.has(parentID)) {
        const parentNode = categoryMap.get(parentID)!;
        parentNode.children!.push(node);
        parentNode.isLeaf = false;
      } else {
        tree.push(node);
      }
    }
    // Assign levels recursively
    const assignLevels = (nodes: AppTreeNode[], currentLevel: number) => {
      for (const n of nodes) {
        n.level = currentLevel;
        if (n.children && n.children.length > 0) {
          assignLevels(n.children, currentLevel + 1);
        }
      }
    };
    assignLevels(tree, 1);
    return tree;
  }, []);

  // --- Data Fetching ---
  const loadCategories = useCallback(
    async (node: AppTreeNode): Promise<AppTreeNode[] | null> => {
      if (!node.isDepartment || !node.key) return null;
      try {
        const categoriesResponse = await homeService.getCategoriesByDepartment(String(node.key));
        const activeCategories = categoriesResponse.value?.filter((cat: CategoryModel) => cat.akiCategoryIsActive) || [];
        if (activeCategories.length > 0) {
          // Only update tree if children actually changed
          setTreeData((origin) =>
            origin.map((n) => {
              if (n.key === node.key) {
                const newChildren = buildCategoryTree(activeCategories);
                // Only update if children are different
                if (JSON.stringify(n.children) !== JSON.stringify(newChildren)) {
                  return {...n, children: newChildren};
                }
              }
              return n;
            })
          );
          return buildCategoryTree(activeCategories);
        } else {
          setTreeData((origin) => origin.map((n) => (n.key === node.key ? {...n, isLeaf: true, children: []} : n)));
          return [];
        }
      } catch (error) {
        console.error(`Error loading categories for department ${node.key}:`, error);
        showNotification('error', `Failed to load categories for ${node.title}.`);
        setTreeData((origin) => origin.map((n) => (n.key === node.key ? {...n, isLeaf: true} : n)));
        return null;
      }
    },
    [buildCategoryTree]
  ); // Include dependencies

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response: DepartmentResponse = await homeService.getDepartments();
      if (response.isSuccess && response.value) {
        const activeDepartments = response.value.filter((dept: Department) => dept.akiDepartmentIsActive);
        const deptNodes: AppTreeNode[] = activeDepartments.map((dept: Department) => ({
          title: dept.akiDepartmentName.toUpperCase(),
          key: dept.akiDepartmentID,
          isLeaf: false,
          children: [],
          isDepartment: true,
          level: 0,
          originData: dept,
        }));
        setTreeData(deptNodes);
        // --- Handle Initial Expansion/Selection ---
        const initialDeptIdStr = sessionStorage.getItem('departmentId');
        const initialCatIdStr = sessionStorage.getItem('categoryId');
        if (initialDeptIdStr) {
          const initialDeptId = Number(initialDeptIdStr);
          setExpandedKeys((prev) => Array.from(new Set([...prev, initialDeptId])) as (string | number)[]);
          if (initialCatIdStr) {
            const deptNode = deptNodes.find((n) => n.key === initialDeptId);
            if (deptNode) {
              await loadCategories(deptNode);
              setSelectedKeys([initialCatIdStr]);
            }
          } else {
            setSelectedKeys([initialDeptId]);
          }
        }
      } else {
        showNotification('info', response.exceptionInformation || 'No active departments found.');
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      showNotification('error', 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  }, [loadCategories]); // Empty dependency array - load once

  // --- Antd Tree Props Callbacks ---

  // Async loading handler
  const handleLoadData = (node: EventDataNode<AppTreeNode>): Promise<void> => {
    return new Promise((resolve) => {
      // Check if children are already loaded or if it's not expandable
      if ((node.children && node.children.length > 0) || node.isLeaf) {
        resolve();
        return;
      }
      // Load categories
      loadCategories(node).then(() => resolve());
    });
  };

  // Selection handler
  const handleSelect: TreeProps['onSelect'] = (keys, info) => {
    if (keys.length > 0) {
      const selectedNode = info.node as AppTreeNode; // Cast to our type
      setSelectedKeys(keys as (string | number)[]);

      const key = selectedNode.key;
      const isDepartment = selectedNode.isDepartment;
      const level = selectedNode.level ?? -1; // Get level

      if (isDepartment || level === 0) {
        sessionStorage.setItem('departmentId', String(key));
        sessionStorage.removeItem('categoryId');
        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
        sessionStorage.removeItem('skuId');
        console.log('Department Selected:', key);
      } else {
        // It's a category
        const categoryOriginData = selectedNode.originData as CategoryModel;
        if (categoryOriginData?.akiDepartment) {
          sessionStorage.setItem('departmentId', String(categoryOriginData.akiDepartment));
          sessionStorage.setItem('categoryId', String(key));
          sessionStorage.removeItem('productId');
          sessionStorage.removeItem('itemNumber');
          sessionStorage.removeItem('skuId');
          console.log('Category Selected:', key, 'in Dept:', categoryOriginData.akiDepartment);
        } else {
          console.warn("Category selected, but couldn't determine parent department ID.");
        }
      }

      // Emit event
      if (onCategorySelected) {
        onCategorySelected(key, selectedNode);
      }
    } else {
      // Deselection
      setSelectedKeys([]);
      // Optionally clear session storage on deselect?
    }
  };

  // Expansion handler
  const handleExpand: TreeProps['onExpand'] = (keys) => {
    setExpandedKeys(keys as (string | number)[]);
  };

  // Drag and Drop handler (Basic structure, needs API calls)
  const handleDrop: TreeProps['onDrop'] = (info) => {
    console.log('Drop Info:', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // -1 = before, 0 = inside, 1 = after

    // Prevent dropping onto itself
    if (dropKey === dragKey) {
      console.warn('Cannot drop onto self.');
      return;
    }

    // **TODO:** Implement logic to update tree structure based on dropPosition
    // **TODO:** Determine if the drop is valid (e.g., category into department, category onto category)
    // **TODO:** Make API calls to persist the change on the backend

    // Example structure (needs refinement based on actual requirements and API calls):
    const data = [...treeData];

    // Find dragObject
    let dragObj: AppTreeNode | undefined;
    // Helper to find and remove node
    const findAndRemove = (key: React.Key, nodeList: AppTreeNode[]): boolean => {
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].key === key) {
          dragObj = nodeList.splice(i, 1)[0]; // Remove and store
          return true;
        }
        if (nodeList[i].children) {
          if (findAndRemove(key, nodeList[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };

    findAndRemove(dragKey, data);

    if (!dragObj) {
      console.error('Dragged object not found!');
      return; // Should not happen if keys are correct
    }

    // Helper to find node by key
    const findNode = (key: React.Key, nodeList: AppTreeNode[]): AppTreeNode | null => {
      for (const node of nodeList) {
        if (node.key === key) return node;
        if (node.children) {
          const found = findNode(key, node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const dropNode = findNode(dropKey, data);
    if (!dropNode) {
      console.error('Drop target node not found!');
      // Potentially put dragObj back? Or handle error state.
      return;
    }

    // **Placeholder Logic - Needs validation and API Calls**
    if (!info.dropToGap) {
      // Drop inside
      dropNode.children = dropNode.children || [];
      // Add dragObject to the beginning of children
      dropNode.children.unshift(dragObj);
      dropNode.isLeaf = false; // Ensure parent is not marked as leaf
      setTreeData(data);
      // **API CALL:** Update parent of dragObj to dropKey
      console.log(`API: Move ${dragKey} inside ${dropKey}`);
    } else {
      // Drop between nodes
      // Find parent of dropNode and insert dragObj at correct position
      // This requires finding the parent array and index 'i'
      // **API CALL:** Update parent and potentially list order of dragObj
      console.log(`API: Move ${dragKey} ${dropPosition === -1 ? 'before' : 'after'} ${dropKey}`);
      // **Update state 'data' based on insertion logic**
      setTreeData(data); // Update state after modifying 'data' array
    }
  };

  // Right-click handler
  const handleContextMenu = async (event: React.MouseEvent, node: EventDataNode<AppTreeNode>) => {
    event.preventDefault();
    const nodeData = node as AppTreeNode;

    if (nodeData.isDepartment || nodeData.level === 0) {
      console.log('Right-click on department ignored for attribute sets.');
      return; // Ignore right-clicks on departments
    }

    setLoading(true); // Show loading indicator
    try {
      // Fetch existing attribute sets for the category key
      const response = await homeService.getDistinctAttributeSetsByCategoryId(String(nodeData.key));

      if (response.value === null) {
        // No existing set found, prepare data for modal
        setModalContextData({
          categoryId: nodeData.key,
          categoryName: nodeData.title,
        });
        setIsModalVisible(true);
      } else {
        // Attribute set already exists
        showNotification('warning', `Attribute Set for '${nodeData.title}' already exists.`);
      }
    } catch (error) {
      console.error('Error checking attribute sets:', error);
      showNotification('error', 'Could not check for existing attribute sets.');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Callbacks ---
  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalContextData(null);
  };

  // --- Custom Node Renderer ---
  const titleRender = (node: AppTreeNode): React.ReactNode => {
    let icon: React.ReactNode;
    const isExpanded = expandedKeys.includes(node.key);
    const isSelected = selectedKeys.includes(node.key); // Check if node is selected

    if (node.isDepartment) {
      icon = <PartitionOutlined />;
    } else if (node.isLeaf) {
      // Use selected state for folder icon
      icon = isSelected ? <FolderOpenOutlined /> : <FolderOutlined />;
    } else {
      // Non-leaf category, use expanded state
      icon = isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />;
    }

    return (
      <span className="custom-node flex items-center" onContextMenu={(e) => handleContextMenu(e, node as EventDataNode<AppTreeNode>)}>
        <span className="node-icon mr-1">{icon}</span>
        <span className="node-name">{node.title}</span>
      </span>
    );
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin spinning={loading}>
      {treeData.length > 0 ? (
        <Tree
          showLine={{showLeafIcon: false}} // Hide default leaf icon if using custom
          showIcon={false} // Disable default icons if using titleRender entirely
          blockNode
          draggable
          loadData={handleLoadData} // Use for async loading
          treeData={treeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          onExpand={handleExpand}
          onDrop={handleDrop}
          titleRender={titleRender} // Use custom renderer
          className="h-[calc(100vh-200px)] overflow-auto" // Example height and scroll
        />
      ) : (
        !loading && <div className="empty-message h-48 flex items-center justify-center text-gray-500">No Data Found</div>
      )}

      {/* Modal for Category Attributes */}
      <Modal title="Attribute Set Management" visible={isModalVisible} onCancel={handleModalClose} footer={null} destroyOnClose width={1100}>
        {modalContextData && (
          // <CategoryAttributeManager
          //   categoryData={modalContextData}
          //   onAttributesChanged={handleAttributesChanged}
          // />
          <div style={{color: 'red'}}>CategoryAttributeManager component missing</div>
        )}
      </Modal>
    </Spin>
  );
};

export default Home;
