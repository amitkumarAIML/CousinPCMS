import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewEncapsulation} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {FlatNode, TreeNode} from '../../../shared/models/treeModel';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SelectionModel} from '@angular/cdk/collections';
import {treeData} from './tree-sample';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {HomeService} from '../home.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {Department, DepartmentResponse} from '../../../shared/models/departmentModel';
import {DataService} from '../../../shared/services/data.service';
import {DepartmentService} from '../../departments/department.service';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {CategoryAttributeComponent} from '../category-attribute/category-attribute.component';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'cousins-tree-view',
  imports: [NzTreeModule, NzIconModule, NzSpinModule, NzModalModule, CategoryAttributeComponent, NzToolTipModule, CommonModule],
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

  constructor(private homeService: HomeService, private cdRef: ChangeDetectorRef, private dataService: DataService, private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngAfterViewInit(): void {
    // No need to call expandAll() as we've already set expanded: true in our tree data
  }

  // New method to handle drag and drop events
  async nzEvent(event: any): Promise<void> {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      console.log('Node expanded:', event, node);
      if (node.level === 0 && node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadCategoriesForDepartments(node)
          .then((data) => {
            if (data && data.length > 0) {
              node.addChildren(data);
              this.cdRef.detectChanges();
            } else {
              console.warn('No child data found for this node.');
            }
          })
          .catch((error) => {
            console.error('Error loading child nodes:', error);
          });
      } else {
        node.isLoading = false;
      }
    }

    if (event.eventName === 'drop') {
      const dragNode = event.dragNode;
      const dropNode = event.node;
      const dropPosition = event.dropPosition ?? 0;

      if (!dragNode || !dropNode) return;

      // 🔸 Remove node from original parent
      const dragParent = dragNode.parentNode;
      if (dragParent) {
        dragParent.children = dragParent.children?.filter((child: any) => child.key !== dragNode.key);
      } else {
        this.nodes = this.nodes.filter((node) => node.key !== dragNode.key);
      }

      if (dropPosition === 0) {
        // dropNode.children = dropNode.children || [];
        console.log('Drop Position:', dragNode);
        if (dropNode.children.length === 0) {
          dropNode.children.push(dragNode);
        } else {
          dropNode.addChildren([dragNode]);
        }
      
          

        dropNode.isLeaf = false;
        dropNode.isExpanded = false;
        if (dropNode.origin) {
          dropNode.origin.isLeaf = false;
          dropNode.origin.isExpanded = true;
      }
      
        dragNode.parentId = dropNode.key;
        const newLevel = dropNode.level + 1;
        this.updateLevelRecursively(dragNode, newLevel);

        console.log('New Level:',dragNode, dropNode,this.nodes);
        this.cdRef.markForCheck();
      } else {
        // 🔸 Drop *before or after* dropNode (as sibling)
        this.insertNodeAtSibling(this.nodes, dropNode.key, dragNode, dropPosition);
      }

      this.cdRef.detectChanges();
    }
  }

  updateLevelRecursively(node: TreeNode, level: number): void {
    node.level = level;
    
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this.updateLevelRecursively(child, level + 1);
      }
    }
  }

  insertNodeAtSibling(nodes: TreeNode[], referenceKey: string | number, newNode: TreeNode, position: number): boolean {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.key === referenceKey) {
        const insertIndex = position < 0 ? i : i + 1;
        nodes.splice(insertIndex, 0, newNode);
        return true;
      }
      if (node.children?.length) {
        if (this.insertNodeAtSibling(node.children, referenceKey, newNode, position)) {
          return true;
        }
      }
    }
    return false;
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
            const treeData: TreeNode[] = this.departments.map((dept: any) => ({
              title: dept.akiDepartmentName.toUpperCase(),
              key: dept.akiDepartmentID,
              parentId: dept.akiDepartmentID,
              level: 0, // Add level tracking
              isDepartment: true, // First parent gets 'partition' icon
              isLeaf: false,
              children: [],
              isExpanded: false, // Expand all departments by default
            }));
            this.nodes = treeData;

            const departmentIdStr = sessionStorage.getItem('departmentId');
            const departmentId: number | undefined = departmentIdStr ? +departmentIdStr : undefined;
            const categoryIdStr = sessionStorage.getItem('categoryId');
            const categoryId: string | undefined = categoryIdStr ? categoryIdStr : undefined;
            if (departmentId) {
              const findParent = this.nodes.find((child) => child.key === departmentId);
              if (categoryId) {
                this.loadCategoriesForDepartments(findParent).then((data) => {
                  if (data && data.length > 0) {
                    findParent.children = data;
                    findParent.isExpanded = true;
                    this.nodes = [...this.nodes];
                    this.selectedValue = [categoryId];
                    const path = this.getNodePath(this.nodes, categoryId);
                    if (path) {
                      this.defaultExpandedKeys = path; // Set all parents to expand
                    }
                    this.categorySelected.emit(categoryId);
                  } else {
                    console.warn('No child data found for this node.');
                  }
                });
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
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
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
          this.categories = categories && categories.filter((res: any) => res.akiCategoryIsActive);
          // this.categories = categories;
          if (this.categories && this.categories.length > 0) {
            const treeData = this.buildCategoryTree(this.categories, node);
            resolve(treeData);
          } else {
            resolve([]); // No children
          }
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
          this.loading = false;
          resolve([]); // Handle error gracefully
        },
      });
    });
  }

  buildCategoryTree(categories: any[], node: TreeNode): TreeNode[] {
    const categoryMap = new Map<string, TreeNode>();
    const tree: TreeNode[] = [];

    // 🔹 Normalize IDs to strings & Add all categories to map first
    categories.forEach((category, index) => {
      const categoryID = String(category.akiCategoryID); // Convert to string
      categoryMap.set(categoryID, {
        parentId: String(category.akiCategoryParentID),
        title: category.akiCategoryName,
        key: categoryID,
        isLeaf: true,
        children: [],
        isLast: false,
      });
    });

    // 🔹 Attach child nodes to their parent
    categories.forEach((category) => {
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
        tree.push(node);
      }
    });
    return tree;
  }

  selectCategory(event: any) {
    if (event.level === 0) {
      const dep = this.departments.filter((a) => a.akiDepartmentID == event.origin.key);
      sessionStorage.setItem('departmentId', dep[0].akiDepartmentID);
      sessionStorage.removeItem('categoryId');
      sessionStorage.removeItem('productId');
      sessionStorage.removeItem('itemNumber');
    } else {
      const cat = this.categories.filter((r) => r.akiCategoryID == event.origin.key);
      if (cat.length > 0) {
        const dep = this.departments.filter((a) => a.akiDepartmentID == cat[0].akiDepartment);
        sessionStorage.setItem('departmentId', dep[0].akiDepartmentID);
        sessionStorage.setItem('categoryId', cat[0].akiCategoryID);

        sessionStorage.removeItem('productId');
        sessionStorage.removeItem('itemNumber');
        this.categoryData = dep[0].akiCategoryID;
      }
    }
    this.categorySelected.emit(event.origin.key); // Emit selected category
  }

  onRightClick(event: MouseEvent, node: any): void {
    if (node.level === 0) return;
    this.loading = true;
    this.homeService.getDistinctAttributeSetsByCategoryId(node.key).subscribe({
      next: (response: any) => {
        if (response.value === null) {
          this.categoryAttriisVisible = true;
          this.categoryData = node;
        } else {
          this.dataService.ShowNotification('warning', '', `Attribute Set For ${node.origin.title} is already added.`);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error in API calls', error);
        this.loading = false;
      },
    });
  }
  handleOk(): void {
    this.categoryAttriisVisible = false;
  }
  handleCancel(): void {
    this.categoryAttriisVisible = false;
  }
}
