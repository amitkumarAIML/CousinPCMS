import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DataService } from '../../../shared/services/data.service';
import { ProductsService } from '../../product/products.service';
import { Country } from '../../../shared/models/countryOriginModel';
import { CommodityCode } from '../../../shared/models/commodityCodeModel';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { layoutSkus } from '../../../shared/models/layoutTemplateModel';
import { SkusService } from '../skus.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CompetitorItem } from '../../../shared/models/competitorModel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ItemModel, ItemModelResponse } from '../../../shared/models/itemModel';
import { Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { ApiResponse } from '../../../shared/models/generalModel';
import { AttributeModel } from '../../../shared/models/attributeModel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AttributesValuesComponent } from '../../attributes/attributes-values/attributes-values.component';

@Component({
  selector: 'cousins-sku-details',
  imports: [ FormsModule,
             ReactiveFormsModule,
             NzInputModule,
             NzFormModule,
             NzSelectModule,
             NzCheckboxModule,
             NzButtonModule,
             NzIconModule,
             NzUploadModule,
             NzModalModule,
             AttributesValuesComponent
  ],
  templateUrl: './sku-details.component.html',
  styleUrl: './sku-details.component.css'
})
export class SkuDetailsComponent {

   skuForm!: FormGroup;
   countries : Country[]= [];
   layoutOptions: layoutSkus[] = [];
   commodityCode: CommodityCode[] = [];
   competitors: CompetitorItem[] = [];
   priceGroupItem: ItemModel[] = [];
   priceBreaks: ItemModel[] = [];
   pricingFormulas: ItemModel[] = [];
   selectedFileName: string = '';
   imagePreview: string | ArrayBuffer | null = null;
   savedAttributes: any[] = [];

  @Input() skuData!: any;
  addNewAttributeValueModal: boolean = false;
  attributeName: string = '';
  isLoadingAttributeNames: boolean = false;

  chartLimit = {
    akiitemid: 31,
    akiManufacturerRef: 50,
    akiSKUDescription: 2000,
    skuName: 100,
    akiImageURL: 255
  }

  constructor(private fb: FormBuilder, private skusService: SkusService, private dataService: DataService,private router: Router) {
      this.skuForm = this.fb.group({
          akiProductID: [{ value: '' , disabled: true}],
          akiCategoryID: [{ value: '' , disabled: true}],
          akiSKUID: [{ value: '' , disabled: true}],
          skuName: ['',[ Validators.required ]],
          akiSKUDescription: [''],
          akiManufacturerRef: [''],
          akiitemid: [''],
          akiListOrder: [''],
          akiObsolete: [false],
          akiWebActive: [false],
          akiCurrentlyPartRestricted: [false],
          akiImageURL: [''],
          akiCommodityCode: [''],
          akiCountryOfOrigin: [''],
          akiSKUIsActive: [false],
          akiGuidePriceTBC: [10],
          akiGuideWeightTBC: [0],
          akiAlternativeTitle: [''],
          akiLayoutTemplate: [''],
          akiCompetitors: [''],
          akiPriceBreak: [''],
          akiPriceGroup: [''],
          akiPricingFormula: [''],

      });
  }

  ngOnInit() {
    this.getLayoutTemplate();
    this.getCommodityCodes();
    this.getCountryOrigin();
    this.getCompetitorDetails();
    this.getPriceGroupDetails();
    this.getPriceBreaksDetails();
    this.getPricingFormulasDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skuData']) {
      if (this.skuData) {
          this.skuForm.patchValue(this.skuData);
          this.getSkuAttributesBycategoryId();
      }
    }
  }

  getFormData() {
    return this.skuForm.getRawValue();
  }

  getCountryOrigin(){
    this.dataService.getCountryOrigin().subscribe({
      next:(response: Country[])=> {
          this.countries = response;
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');  
      },
    })
  }
    
  getCommodityCodes(){
    this.dataService.getCommodityCodes().subscribe({
      next:(response: CommodityCode[])=> {
          this.commodityCode = response;
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    })
  }
  
  getLayoutTemplate() {
    this.skusService.getLayoutTemplateList().subscribe({
      next: (reponse: layoutSkus[]) => {
        this.layoutOptions = reponse;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      }
    });
  } 

  getCompetitorDetails() {
    this.skusService.getCompetitorDetails().subscribe({
      next: (reponse: CompetitorItem[]) => {
        this.competitors = reponse;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      }
    });
  } 

  getPriceGroupDetails() {
    this.skusService.getPriceGroupDetails().subscribe({
      next: (reponse: ItemModelResponse) => {
        if (reponse.isSuccess) {
            this.priceGroupItem = reponse.value;
        } else {
          this.dataService.ShowNotification('error', '',  reponse.exceptionInformation);
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      }
    });
  }

  getPriceBreaksDetails() {
    this.skusService.getPriceBreaksDetails().subscribe({
      next: (reponse: ItemModelResponse) => {
        if (reponse.isSuccess) {
            this.priceBreaks = reponse.value;
        } else {
          this.dataService.ShowNotification('error', '',  reponse.exceptionInformation);
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      }
    });
  }

  getPricingFormulasDetails() {
    this.skusService.getPricingFormulasDetails().subscribe({
      next: (reponse: ItemModelResponse) => {
        if (reponse.isSuccess) {
            this.pricingFormulas = reponse.value;
        } else {
          this.dataService.ShowNotification('error', '',  reponse.exceptionInformation);
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      }
    });
  }
  
  onFileSelected(event: NzUploadChangeParam) {
    const file = event.file?.originFileObj;
       if (file) {
        this.selectedFileName = file.name;
        // Show Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
      };
      this.skuForm.get('akiImageURL')?.setValue( this.selectedFileName); // Set it immediately
  
      reader.readAsDataURL(file);

      if (event.file.status === 'uploading') {
        this.dataService.ShowNotification('success','', 'file uploaded successfully');
      }      
   }
  }

  goToLinkMaintenance(): void {
    if (!this.skuForm.getRawValue().akiSKUID) return;
    this.router.navigate(['/skus/link-maintenance']);
  }

  goToAdditionalImage(): void {
    if (!this.skuForm.getRawValue().akiSKUID) return;
    this.router.navigate(['/skus/additional-images']);
  }

  getSkuAttributesBycategoryId() {
    this.isLoadingAttributeNames = true;
    this.skusService.getSkuAttributesBycategoryId(this.getFormData().akiCategoryID).subscribe({
      next: (reponse: ApiResponse<AttributeModel[]>) => {
        if (reponse.isSuccess) {
          if (reponse && reponse.value.length > 0) {
            this.savedAttributes = reponse.value;
          }
        } else {
          this.dataService.ShowNotification('error', '',  reponse.exceptionInformation);
        }
        this.isLoadingAttributeNames = false;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
        this.isLoadingAttributeNames = false;
      }
    });
  }

  showAddAttributesModal(attr: any) {
    this.attributeName = attr.attributeName
    this.addNewAttributeValueModal = true;
  }

  handleCancel() {
    this.addNewAttributeValueModal = false;
  }
  
  goToUploadForm() {
    const attributeNames: any = this.savedAttributes.map(item => item.attributeName);
    console.log('att ',attributeNames)
    sessionStorage.setItem('attributeNames', JSON.stringify(attributeNames));
    this.router.navigate(['/skus/attribute-multi-upload']);
  }
  

}
