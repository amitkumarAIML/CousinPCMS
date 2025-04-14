import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NavItem} from '../../../shared/models/generalModel';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'cousins-header',
  imports: [NzDropDownModule, NzMenuModule, RouterLink, TranslateModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}
  navItems: NavItem[] = [
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'Departments',
      path: '/departments',
    },
    {
      label: 'Category',
      path: '/category',
    },
    {
      label: 'Products',
      path: '/products',
    },
    {
      label: 'SKUs',
      path: '/skus',
    },
    {
      label: 'Attributes',
      path: '/attributes',
    },
  ];

  isActive(navItem: NavItem | {label: string; path: string}): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith(navItem.path);
  }
}
