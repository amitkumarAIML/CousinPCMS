import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AttributeModel } from '../../../shared/models/attributeModel';
import { HomeService } from '../home.service';
import { error } from 'jquery';
import { DataService } from '../../../shared/services/data.service';
import { CategoryService } from '../../category/category.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subscription } from 'rxjs/internal/Subscription';
import { NzListModule } from 'ng-zorro-antd/list';
@Component({
  selector: 'cousins-category-attribute',
  imports: [NzButtonModule,NzInputModule,NzFormModule,ReactiveFormsModule,FormsModule,CommonModule,
    NzTableModule,
    NzCheckboxModule,
    NzSpinModule,
    NzIconModule,
    NzListModule
  ],
  templateUrl: './category-attribute.component.html',
  styleUrl: './category-attribute.component.css'
})
export class CategoryAttributeComponent implements OnInit {
  private categorySubscription!: Subscription;
  categoryAttriForm:FormGroup;
  addAttributeSetsForm:FormGroup;
  attributeList:AttributeModel[]=[];
  isAttributeloading:boolean=false;
  isloading:boolean=false;
  categoryDetails: any;
  categoryAttriIsVisible:boolean=false;

  @Input() categoryData: any = {};

  attributes = [
    { attributeName: 'Strap Colour', attributeRequired: true, notImportant: false, listPosition: 0 },
  ];
  constructor(private fb:FormBuilder,
    private homeService:HomeService,
    private dataService:DataService,
  ){
    this.categoryAttriForm=this.fb.group({
      akiCategoryName:[],
      akiCategoryID:[]
    })
    this.addAttributeSetsForm=this.fb.group({
      attributeSetName:[],
      attributeName:[''],
      attributeRequired: [true],
      notImportant:[true],
      listPosition: [0],
    })
  }
  ngOnChanges(changes: SimpleChanges) {
      if (changes['categoryData'] && this.categoryData) {
          this.categoryAttriForm.get('akiCategoryName')?.setValue(this.categoryData.origin.title);
          this.categoryAttriForm.get('akiCategoryID')?.setValue(this.categoryData.origin.key);
      }
    }
    
  ngOnInit(): void {
    this.getAllAttributes();
    this.attributes;
  }

  // get All Attributes data
  getAllAttributes(){
    this.isAttributeloading=true;
    this.homeService.getAllAttributes().subscribe({
      next:(response:any)=> {
        if(response.isSuccess){
          this.attributeList=response.value;
          this.isAttributeloading=false;      
          console.log('this.attributeList',this.attributeList);
              
        }else{
          this.dataService.ShowNotification('error','','Failed To Load Data')
          this.isAttributeloading=false;
        }       
        this.isAttributeloading=false;
      }
    })
  }

  addAttributeData(data: any) {
    const alreadyExists = this.attributes.some(attr => attr.attributeName === data.attributeName);
    if (!alreadyExists) {
      this.attributes.push({
        attributeName: data.attributeName,
        attributeRequired: false,
        notImportant: false,
        listPosition: this.attributes.length // or set manually
      });
    }
    console.log('data',  this.attributes);
    
  }
  deleteAttribute(item: any) {
    this.attributes = this.attributes.filter(attr => attr !== item);
  }
  
  saveAttribute(): void {
    this.categoryAttriIsVisible = false;

  }
  btnCancel(): void {
    this.categoryAttriIsVisible = false;
  }
}
