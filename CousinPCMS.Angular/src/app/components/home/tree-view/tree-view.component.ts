import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FlatNode, TreeNode } from '../../../shared/models/treeModel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { treeData } from './tree-sample';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { HomeService } from '../home.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Department, DepartmentResponse } from '../../../shared/models/departmentModel';
import { DataService } from '../../../shared/services/data.service';
import { DepartmentService } from '../../departments/department.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CategoryAttributeComponent } from '../category-attribute/category-attribute.component';

@Component({
  selector: 'cousins-tree-view',
  imports: [NzTreeModule, NzIconModule, NzSpinModule, NzModalModule, CategoryAttributeComponent],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.css',
})
export class TreeViewComponent implements OnInit, AfterViewInit {

  // Maintain original nodes for nz-tree
  nodes: any[] = [];
  departments: any[] = [];
  categories: any[] = [];
  loading: boolean = false;
  selectedValue: any[] = [];
  defaultExpandedKeys: any[] = [];
  displayText: string = 'No Data Found';
  categoryAttriisVisible: boolean = false;

  categoryData: any = {};

  @Output() categorySelected = new EventEmitter<string>();

  constructor(private homeService: HomeService, private cdRef: ChangeDetectorRef, private dataService: DataService, private departmentService: DepartmentService) {
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  getSampleData(): TreeNode[] {
    return treeData;
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  ngAfterViewInit(): void {
    // No need to call expandAll() as we've already set expanded: true in our tree data
  }

  // New method to handle drag and drop events
  async nzEvent(event: any): Promise<void> {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;

      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadCategoriesForDepartments(node).then(data => {
          if (data && data.length > 0) {
            node.addChildren(data);
          } else {
            console.warn('No child data found for this node.');
          }
        }).catch(error => {
          console.error('Error loading child nodes:', error);
        });
      }
    }


    if (event.eventName === 'drop') {

      // Extract properties safely
      const dragNode = event.dragNode;
      const targetNode = event.node;
      const pos = event.pos ?? 0; // Default to 0 (inside) if undefined

      if (!dragNode || !targetNode) {
        console.warn('Drag or drop node missing!');
        return;
      }


      // Prevent self-drop
      if (dragNode.key === targetNode.key) {
        console.warn('Cannot drop a node onto itself');
        return;
      }

    }

  }

  // Get All Department 
  loadDepartments(): void {
    this.loading = true;
    this.homeService.getDepartments().subscribe({
      next: (departments: DepartmentResponse) => {
        // this.departments = departments;
        if (departments.isSuccess) {
          if (departments.value && departments.value.length > 0) {
            this.departments = departments.value.filter((res: Department) => res.akiDepartmentIsActive);
            const treeData = this.departments.map((dept: any) => ({
              title: dept.akiDepartmentName.toUpperCase(),
              key: dept.akiDepartmentID,
              parentId: null,
              level: 0, // Add level tracking
              isDepartment: true, // First parent gets 'partition' icon
              isLeaf: false,
              children: [],

            }));
            this.nodes = treeData;

            const departmentIdStr = sessionStorage.getItem('departmentId');
            const departmentId: number | undefined = departmentIdStr ? +departmentIdStr : undefined;
            const categoryIdStr = sessionStorage.getItem('categoryId');
            const categoryId: string | undefined = categoryIdStr ? categoryIdStr : undefined;
            if (departmentId) {
              const findParent = this.nodes.find(child => child.key === departmentId);
              if (categoryId) {
                this.loadCategoriesForDepartments(findParent).then(data => {
                  if (data && data.length > 0) {
                    findParent.children = data;
                    findParent.isExpanded = true;
                    this.nodes = [...this.nodes];
                    this.selectedValue = [categoryId];
                    const path = this.getNodePath(this.nodes, categoryId);
                    if (path) {
                      this.defaultExpandedKeys = path;  // Set all parents to expand
                    }
                    this.categorySelected.emit(categoryId);
                  } else {
                    console.warn('No child data found for this node.');
                  }
                })
              } else {
                this.selectedValue = [departmentId];
              }
              this.cdRef.detectChanges();
            }
          } else {
            this.displayText = 'No Data Found';
          }
        } else {
          this.displayText = 'Failed to load Department';
        }

        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.dataService.ShowNotification('error', '', "Something went wrong");
      }
    });
  }

  getNodePath(nodes: TreeNode[], targetKey: string | number, path: (string | number)[] = []): (string | number)[] | null {
    for (const node of nodes) {
      const currentPath = [...path, node.key];
      if (node.key === targetKey) {
        return path; // only parents, not the target itself
      }
      if (node.children) {
        const result = this.getNodePath(node.children, targetKey, currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  // Get All Category By department id 
  async loadCategoriesForDepartments(node: TreeNode): Promise<TreeNode[]> {
    return new Promise((resolve) => {
      // this.loading = true;
      this.homeService.getCategoriesByDepartment(node.key).subscribe({
        next: (categories) => {
          this.categories = categories.filter((res: any) => res.akiCategoryIsActive);
          // this.categories = categories;
          if (this.categories && this.categories.length > 0) {
            const treeData = this.buildCategoryTree(this.categories);
            resolve(treeData);
          } else {
            resolve([]); // No children
          }
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', "Something went wrong");
          this.loading = false;
          resolve([]); // Handle error gracefully
        }
      });
    });
  }

  buildCategoryTree(categories: any[]): TreeNode[] {
    const categoryMap = new Map<string, TreeNode>();
    const tree: TreeNode[] = [];

    // 🔹 Normalize IDs to strings & Add all categories to map first
    categories.forEach((category, index) => {
      const categoryID = String(category.akiCategoryID); // Convert to string
      categoryMap.set(categoryID, {
        parentId: String(category.akiCategoryParentID),
        title: category.akiCategoryName,
        key: categoryID,
        isLeaf: true, // Assume leaf initially
        children: [], // Ensure children exist
        level: index, // Add level tracking
        isLast: false, // Default value
      });
    });

    // 🔹 Attach child nodes to their parent
    categories.forEach(category => {
      const categoryID = String(category.akiCategoryID); // Normalize to string
      const parentID = String(category.akiCategoryParentID); // Normalize to string
      const node = categoryMap.get(categoryID);
      if (!node) return;

      if (category.akiCategoryParentID && category.akiCategoryParentID > 0) {
        // Find the parent node
        const parentNode = categoryMap.get(parentID);

        if (parentNode) {
          parentNode.children = parentNode.children || []; // Ensure array exists
          parentNode.children.push(node);
          parentNode.isLeaf = false; // Mark parent as non-leaf
        }
      } else {
        // If no parent, it's a top-level category
        tree.push(node);
      }
    });
    // Mark the last nodes recursively
    this.markLastNodes(tree);

    return tree;
  }

  selectCategory(event: any) {
    if (event.level === 0) {
      const dep = this.departments.filter(a => a.akiDepartmentID == event.origin.key);
      sessionStorage.setItem('departmentId', dep[0].akiDepartmentID);
      sessionStorage.removeItem('categoryId');
      sessionStorage.removeItem('productId');
      sessionStorage.removeItem('itemNumber');
    } else {
      const cat = this.categories.filter((r) => r.akiCategoryID == event.origin.key);
      if (cat.length > 0) {
        const dep = this.departments.filter(a => a.akiDepartmentID == cat[0].akiDepartment);
        sessionStorage.setItem('departmentId', dep[0].akiDepartmentID);
        sessionStorage.setItem('categoryId', cat[0].akiCategoryID);

        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
      }

    }
    this.categorySelected.emit(event.origin.key); // Emit selected category

  }

  // Helper method to get the icon type based on node properties
  getIconType(node: TreeNode): string {
    if (node.isDepartment) {
      return 'partition';
    } else if (node.isLeaf || !node.children || node.children.length === 0) {
      return this.isSelected(node) ? 'folder-open' : 'folder';
    } else {
      return this.isExpanded(node) ? 'folder-open' : 'folder';
    }
  }

  // Helper methods to match original functionality
  isSelected(node: TreeNode): boolean {
    // Implementation will depend on how you manage selection in the new tree
    // This is a placeholder
    return false;
  }

  isExpanded(node: TreeNode): boolean {
    return !!node.expanded;
  }


  // Remove node from its previous parent
  removeNodeFromParent(nodeKey: string, nodes: TreeNode[]): boolean {
    for (const node of nodes) {
      if (node.children) {
        const index = node.children.findIndex(child => child.key === nodeKey);
        if (index !== -1) {
          node.children.splice(index, 1);
          return true;
        }
        // Recursively check in child nodes
        if (this.removeNodeFromParent(nodeKey, node.children)) {
          return true;
        }
      }
    }
    return false;
  }

  // Find parent node of a given key
  findParentNode(nodeKey: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.children) {
        if (node.children.some(child => child.key === nodeKey)) {
          return node;
        }
        const found = this.findParentNode(nodeKey, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  markLastNodes(nodes: TreeNode[]): TreeNode[] {
    nodes.forEach((node, index1, arr1) => {
      if (node.children && node.children.length) {
        node.children.forEach((child, index, arr) => {
          child.isLast = index === arr.length - 1;
        });
        // Recursively mark last nodes for the children
        this.markLastNodes(node.children || []);
      } else {
        node.isLast = index1 === arr1.length - 1;
      }
    });
    return nodes;
  }

  onRightClick(event: MouseEvent, node: any): void {
    if (node.level === 0) return;
    this.categoryAttriisVisible = true;
    this.categoryData = node;

  }
  handleOk(): void {
    this.categoryAttriisVisible = false;
  }
  handleCancel(): void {
    this.categoryAttriisVisible = false;
  }
}
