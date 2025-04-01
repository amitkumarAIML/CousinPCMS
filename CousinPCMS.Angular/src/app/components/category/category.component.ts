import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button'; // ✅ Import ng-zorro modules
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Subscription } from 'rxjs';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'cousins-category',
  imports: [ 
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule ,
    NzCardModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: FormGroup;
  private categorySubscription!: Subscription;
  categoryDetails: any;
  countries : any[]= []
  layoutOptions: any[] = [];
  returnOptions: any[] = [];

  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService) {
    this.categoryForm = this.fb.group({
      akiCategoryID: [{ value: '', disabled: true }],
      akiCategoryParentID: [{ value: '', disabled: true }],
      akiDepartment: [{ value: '', disabled: true }],
      akiCategoryName: ['', [Validators.required]],
      akiCategoryGuidePrice: [''],
      akiCategoryGuideWeight: [''],
      akiCategoryCommodityCode: [''],
      akiCategoryListOrder: [''],
      akiCategoryPromptUserIfPriceGroupIsBlank: [false],
      akiCategoryCountryOfOrigin: [''],
      akiCategoryWebActive: [false],
      akiCategoryPopular: [false],
      akiCategoryTickBoxNotInUse: [false],
      akiCategoryUseComplexSearch: [false],
      akiCategoryDescriptionText: [''],
      akiCategoryImageURL: [''],
      additionalImages: [''],
      akiCategoryDiscount: [''],
      urlLinks: [''],
      akiCategoryImageHeight: [''],
      akiCategoryImageWidth: [''],
      akiCategoryIncludeInSearchByManufacture: [false],
      akiCategoryLogInAndGreenTickOnly: [false],
      akiCategoryMinimumDigits: [''],
      akiCategoryReturnType: [''],
      akiCategoryPrintCatActive: [false],
      showCategoryText: [false],
      showCategoryImage: [false],
      layoutTemplate: [''],
      alternativeTitle: [''],
      akiCategoryShowPriceBreaks: [false],
      akiCategoryIndex1: [''],
      akiCategoryIndex2: [''],
      akiCategoryIndex3: [''],
      akiCategoryIndex4: [''],
      akiCategoryIndex5: ['']
    });
  }

  ngOnInit(): void {
    this.categorySubscription = this.homeService.selectedCategory$.subscribe(category => {
      if (category) {
        this.categoryDetails = category[0];
        this.categoryForm.patchValue(this.categoryDetails);
        console.log('Received Category:', category);
      }
    });
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
      console.log('Unsubscribed from selectedCategory$');
    }
  }
    
  submitForm(): void {
    console.log('Form Data:', this.categoryForm.value);
  }

   // Handle File Selection
   onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFileName = file.name;

      // Show Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
