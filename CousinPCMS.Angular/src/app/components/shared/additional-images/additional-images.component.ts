import { CommonModule, Location } from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'cousins-additional-images',
  imports: [FormsModule, NzInputModule, NzButtonModule, NzFormModule,NzUploadModule, NzIconModule, CommonModule],
  templateUrl: './additional-images.component.html',
  styleUrl: './additional-images.component.css',
})
export class AdditionalImagesComponent {

  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error'
    }
  ];

  showForm = false;
  imageUrl: string | ArrayBuffer | null = null;
  loading = false;
  avatarUrl?: string;

  constructor(private fb: FormBuilder,private location: Location) {
  }

  cancel() {
    this.showForm = false;
  }

  back() {
    this.location.back();
  }

  // beforeUpload = (file: NzUploadChangeParam): boolean => {
  //   // prevent automatic upload — handle manually
  //   console.log('Selected file:', file);
  //   return false;
  // };

  // handleChange(event: NzUploadChangeParam): void {
  //   const file = event.file;
  //   if (file.status === 'done') {
  //     console.log('Upload complete:', file.response);
  //   }
  // }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUrl = file.name;
    }
  }

  save() {
      this.showForm = false;
  }

  onAdd() {
    this.showForm = true;
  }

  deleteImage() {
  }

  uploadFile() {

  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file as unknown as File); // force cast for FileReader
    return false; // prevent auto upload
  };
  
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'removed') {
      this.imageUrl = null;
    }
  }
  

}
