import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Ad } from '../../models/Ad';
import axios from 'axios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryService } from 'src/services/category.service';
import { AdService } from 'src/services/ad.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

enum adtypes {
  donate = 1,
  sell = 2,
  auction = 3,
  rent = 4
}

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.scss']
})
export class CreateAdComponent implements OnInit {

  @ViewChild('myInput1') myInputVariable1: ElementRef | any;
  @ViewChild('myInput2') myInputVariable2: ElementRef | any;
  @ViewChild('myInput3') myInputVariable3: ElementRef | any;


  createAdForm !: FormGroup;

  isUpdate : boolean = false;
  updateAdId !: string;
  updateAdDetails !: Ad;

  adTypes = adtypes;

  adType = adtypes.sell;

  imageSelected : boolean[] =[false,false,false,false];

  image1Touched = false;
  imageRemoved = false;
  imageLoading = false;

  url: string[] = [];

  public categories: any;

  CLOUDINARY_URL = "	https://api.cloudinary.com/v1_1/hashedin/upload";
  CLOUDINARY_UPLOAD_PRESET = "cbtxrrbg";
  userDetails = JSON.parse(localStorage.user);

  constructor(private formBuiler : FormBuilder,private router:Router,private categoryService:CategoryService,
    private adService:AdService, private activatedRoute : ActivatedRoute) {
    this.buildCreateAdForm(new Ad({
      adType:this.adTypes.sell,
      auctionDeadline:"2021-05-12T16:58:00",
      bidDifference:"1"
    }));
    console.log(this.createAdForm.value);
    this.activatedRoute.paramMap.subscribe(params => {
      if(params.has('adId')){
        this.isUpdate = true;
        this.updateAdId = params.get('adId') as string;
        this.adService.getAdById(this.updateAdId).subscribe(
          data => {
            this.updateAdDetails = data;
            console.log(this.updateAdDetails);
            this.url=['',this.updateAdDetails.img1Url,this.updateAdDetails.img2Url,this.updateAdDetails.img3Url];
            for(var i=1;i<4;i++) {
              if(this.url[i])
              {
                this.imageSelected[i]=true;
              }
            }
            if(this.updateAdDetails.adType!=adtypes.auction) {
              this.updateAdDetails.auctionDeadline="2021-05-12T16:58:00";
              this.updateAdDetails.bidDifference=1;
            }
            this.buildCreateAdForm(this.updateAdDetails);
            this.adType= this.updateAdDetails.adType;
          }
        )
      }
    });
   }

  ngOnInit(): void {
    console.log(this.userDetails);
    this.categoryService.getCategories().subscribe(categoryList => this.categories = categoryList);
    //this.createAdForm.get('adType')?.updateValueAndValidity();
  }

  buildCreateAdForm(ad:Ad) {
    this.createAdForm = new FormGroup({
      adType : new FormControl(ad.adType, Validators.required),
      adTitle : new FormControl(ad.adTitle,[Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      productName : new FormControl(ad.productName, [Validators.required]),
      brandName : new FormControl(ad.brandName, [Validators.required, Validators.maxLength(15)]),
      categoryId : new FormControl(ad.categoryId,Validators.required),
      description : new FormControl(ad.description, [Validators.required]),
      initialPrice : new FormControl(ad.initialPrice,Validators.required),
      bidDifference : new FormControl(ad.bidDifference, Validators.required),
      sellerId : new FormControl(this.userDetails.id,Validators.required),
      productAge : new FormControl(ad.productAge),
      auctionDeadline : new FormControl(ad.auctionDeadline,Validators.required),
      img1Url : new FormControl(ad.img1Url, Validators.required),
      img2Url : new FormControl(ad.img2Url),
      img3Url : new FormControl(ad.img3Url)
    })
  }

  onSubmit() {
    if(this.createAdForm.valid){
      console.log(this.createAdForm.value);
      if(!this.isUpdate) {
        this.adService.postAd(this.createAdForm.value).subscribe(
          (res)=>{
            console.log(res);
            Swal.fire(
              'Ad Posted!',
              'Your ad has been posted',
              'success'
            )
            this.router.navigateByUrl('ads/'+res.adId);
          },
          (err)=>{
            Swal.fire(
              'Error Occured!',
              'There is some error!',
              'error'
            )
            console.log(err);
          }
        );
      }
      else {
        this.adService.updateAd(this.createAdForm.value,this.updateAdDetails.adId).subscribe(
          (res)=>{
            console.log(res);
            Swal.fire(
              'Ad Updated!',
              'Your ad has been updated',
              'success'
            )
            this.router.navigateByUrl('ads/'+res.adId);
          }
        );
      }
    }
  }

  toggleAdType(type: number) {
    this.buildCreateAdForm(new Ad({adType:type}));
    for(var i=1;i<=3;i++) {
      this.removeImage(i);
    }
    this.adType = type;
    if(type!=this.adTypes.auction) {
      this.createAdForm.get('auctionDeadline')?.setValue("2021-05-12T16:58:00");
      this.createAdForm.get('bidDifference')?.setValue("1");
      if(type==this.adTypes.donate) {
        this.createAdForm.get('initialPrice')?.setValue(0);
      }
    }
  }

  onSelectFile(e:any, i: number) {
    this.imageLoading = true;
    var file = e.target.files[0];
    var formData = new FormData;
    formData.append('file',file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    axios({
      url: this.CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
      }).then((res) => {
        this.imageLoading = false;
        console.log(res);
        this.url[i] = res.data.secure_url;
        this.imageSelected[i] = true;
        if(i==1) {
          this.createAdForm.get('img1Url')?.setValue(this.url[i]);
          this.image1Touched = true;
        }
        else if(i==2) {
          this.createAdForm.get('img2Url')?.setValue(this.url[i]);
        }
        else {
          this.createAdForm.get('img3Url')?.setValue(this.url[i]);
        }
      }).catch(function(err) {
        console.log(err);
      });
  }

  removeImage(i:number) {
    this.url[i] = "";
    this.imageSelected[i] = false;
    if(i===1) {
      this.createAdForm.get('img1Url')?.setValue(null);
      this.imageRemoved = true;
      this.myInputVariable1.nativeElement.value = null;
    }
    else if(i===2) {
      this.createAdForm.get('img2Url')?.setValue(null);
      this.myInputVariable2.nativeElement.value = null;
    }
    else {
      this.createAdForm.get('img3Url')?.setValue(null);
      this.myInputVariable3.nativeElement.value = null;
    }
  }
}
