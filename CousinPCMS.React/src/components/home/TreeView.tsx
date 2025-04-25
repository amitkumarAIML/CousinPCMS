import React from 'react';
import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { PartitionOutlined, LoadingOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import * as departmentservice from '../../services/DepartmentService'; // Fixed path
import * as homeservice from '../../services/HomeService'; // For category fetching

// --- Interfaces (adjust based on your actual service response types) ---

interface Department {
    akiDepartmentID: number;
    akiDepartmentName: string;
    // Add other relevant department properties if needed
}

interface Category {
    akiCategoryID: string; // It's a string in the example response
    akiCategoryName: string;
    akiCategoryParentID: string; // Also string
    akiDepartment: string; // Department ID as string
    // Add other relevant category properties if needed
}

// Interface for our TreeDataNode, adding custom data
interface CustomTreeDataNode extends TreeDataNode {
    dataType: 'department' | 'category';
    id: number | string; // Store original ID
    parentId?: string | number; // Store parent ID for categories
    data?: Department | Category; // Optional: store the full original object
    children?: CustomTreeDataNode[]; // Type children explicitly
}

// --- Helper Function to Build Category Tree ---

const buildCategoryTree = (categories: Category[]): CustomTreeDataNode[] => {
    const categoryMap: { [key: string]: CustomTreeDataNode } = {};
    const rootCategories: CustomTreeDataNode[] = [];

    // 1. Create nodes and map them by ID
    categories.forEach(cat => {
        const node: CustomTreeDataNode = {
            key: `cat-${cat.akiCategoryID}`, // Unique key prefix for categories
            title: cat.akiCategoryName,
            id: cat.akiCategoryID,
            parentId: cat.akiCategoryParentID,
            dataType: 'category',
            isLeaf: true, // Assume leaf initially
            data: cat,
        };
        categoryMap[cat.akiCategoryID] = node;
    });

    // 2. Build the hierarchy
    categories.forEach(cat => {
        const node = categoryMap[cat.akiCategoryID];
        // Check if it's a root category within the department's context
        if (cat.akiCategoryParentID === '0' || !categoryMap[cat.akiCategoryParentID]) {
            rootCategories.push(node);
        } else {
            const parentNode = categoryMap[cat.akiCategoryParentID];
            if (parentNode) {
                parentNode.isLeaf = false; // Mark parent as not a leaf
                parentNode.children = parentNode.children || [];
                parentNode.children.push(node);
                // Optional: Sort children by list order if available
                // parentNode.children.sort((a, b) => /* compare logic based on akiCategoryListOrder */);
            } else {
                // Handle cases where parent might not be in the fetched list (shouldn't happen with GetAllCategoryBYDeptId)
                console.warn(`Parent category ${cat.akiCategoryParentID} not found for category ${cat.akiCategoryID}`);
                rootCategories.push(node); // Add as root if parent is missing
            }
        }
    });

    // Optional: Sort root categories by list order if available
    // rootCategories.sort((a, b) => /* compare logic based on akiCategoryListOrder */);

    return rootCategories;
};


// --- TreeView Component ---

const TreeView: React.FC = () => {
    const [treeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Initial loading state
    const [error, setError] = useState<string | null>(null);

    // Fetch initial Departments
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await departmentservice.getDepartments();
                if (response && response.isSuccess && Array.isArray(response.value)) {
                    const deptNodes: CustomTreeDataNode[] = response.value.map((dept: Department) => ({
                        key: `dept-${dept.akiDepartmentID}`,
                        title: dept.akiDepartmentName,
                        id: dept.akiDepartmentID,
                        dataType: 'department',
                        icon: <PartitionOutlined />,
                        isLeaf: false,
                        data: dept,
                    }));
                    setTreeData(deptNodes);
                } else {
                    console.error("Failed to fetch departments or invalid format:", response);
                    setError("Failed to load departments.");
                }
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("An error occurred while loading departments.");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to update the tree data state immutably
    const updateTreeData = (list: CustomTreeDataNode[], key: React.Key, children: CustomTreeDataNode[]): CustomTreeDataNode[] => {
        return list.map(node => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }
            return node;
        });
    };

    // Load Categories when expanding a Department node
    const onLoadData = (treeNode: CustomTreeDataNode): Promise<void> => {
        return new Promise((resolve) => {
            const { key, children, dataType, id } = treeNode;
            if (children || dataType !== 'department') {
                resolve();
                return;
            }
            homeservice.getCategoriesByDepartment(String(id))
                .then(response => {
                    if (response && response.isSuccess && Array.isArray(response.value)) {
                        const categoryNodes = buildCategoryTree(response.value);
                        setTreeData(currentTreeData => updateTreeData(currentTreeData, key, categoryNodes));
                    } else {
                        setTreeData(currentTreeData => updateTreeData(currentTreeData, key, []));
                    }
                })
                .catch(() => {
                    setTreeData(currentTreeData => updateTreeData(currentTreeData, key, []));
                })
                .finally(() => {
                    resolve();
                });
        });
    };

    // --- Drag and Drop Handlers (adapted from original) ---

    const onDragEnter: TreeProps['onDragEnter'] = (_info) => {
      console.log('Drag Enter', _info);
      
        // No-op
    };

    const onDrop: TreeProps['onDrop'] = (info) => {
        // console.log('onDrop', info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // -1 = before, 0 = inside, 1 = after

        // Helper function to find/modify nodes (same as original, but operates on CustomTreeDataNode)
        const loop = (
            data: CustomTreeDataNode[],
            key: React.Key,
            callback: (node: CustomTreeDataNode, i: number, data: CustomTreeDataNode[]) => void
        ): void => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                const children = data[i].children;
                if (children && Array.isArray(children) && children.length > 0) {
                    loop(children, key, callback);
                }
            }
        };

        // Create a deep copy to modify
        const data = JSON.parse(JSON.stringify(treeData)) as CustomTreeDataNode[];

        // Find dragObject
        let dragObj: CustomTreeDataNode | undefined;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1); // Remove from original position
            dragObj = item;
        });

        if (!dragObj) {
            console.error("Dragged node not found!");
            return; // Should not happen
        }

        if (!info.dropToGap) {
            // Drop on the content = make it a child
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert TreeNodes
                item.children.unshift(dragObj!); // Add to beginning of children
                item.isLeaf = false; // Ensure parent is not marked as leaf
            });
        } else {
             // Drop on the gap (before or after)
             let ar: CustomTreeDataNode[] = [];
             let i: number = -1; // Initialize with a value compiler understands
             loop(data, dropKey, (_item, index, arr) => {
                 ar = arr; // The array where the drop target is
                 i = index; // The index of the drop target in that array
             });

             if (dropPosition === -1) {
                 // Drop before node
                 ar.splice(i, 0, dragObj);
             } else {
                 // Drop after node
                 ar.splice(i + 1, 0, dragObj);
             }
        }

        // Update state with the modified structure
        setTreeData(data);

        // --- TODO: Persist the change ---
        // Here you would ideally make an API call to update the parent/order
        // of the dragged item (dragObj) based on its new location (info).
        // This depends heavily on your backend API design (e.g., an UpdateCategoryParent or UpdateDepartmentOrder endpoint).
        // Example:
        // if (dragObj.dataType === 'category' && info.dropToGap) {
        //    const newParentNode = findParentNode(data, dropKey); // You'd need a function to find the new parent
        //    const newParentId = newParentNode ? newParentNode.id : '0'; // Or appropriate root indicator
        //    const newOrder = calculateNewOrder(ar, dragObj.key); // Calculate based on siblings
        //    departmentservice.UpdateCategory({ id: dragObj.id, parentId: newParentId, order: newOrder });
        // } else if (dragObj.dataType === 'category' && !info.dropToGap) {
        //    const newParentId = info.node.id; // Dropped inside another node
        //    const newOrder = calculateNewOrder(info.node.children, dragObj.key);
        //    departmentservice.UpdateCategory({ id: dragObj.id, parentId: newParentId, order: newOrder });
        // } // etc.
         console.log("TODO: Persist drag/drop changes via API call", { dragObj, dropInfo: info });
    };

    // --- Render ---

    if (loading) {
        return <div><LoadingOutlined /> Loading Departments...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <Tree<CustomTreeDataNode>
            className="draggable-tree"
            draggable // Enable drag and drop
            blockNode // Make the whole node draggable
            showLine // Show connection lines
            loadData={onLoadData} // Function to load children data
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            treeData={treeData} // Use the state variable
            // defaultExpandedKeys can be set if needed, but onLoadData handles expansion loading
        />
    );
};

export default TreeView;