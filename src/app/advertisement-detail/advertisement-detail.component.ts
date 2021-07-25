import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { AuctionService } from 'src/services/auction.service';
import { CategoryService } from 'src/services/category.service';
import { NotificationsService } from 'src/services/notifications.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent implements OnInit {

  adId!:string;
  ad!:Ad;
  seller!:User;
  category!:any;
  savedAds:Ad[]=[];
  user!:User;
  isLoggedIn: boolean;
  timeRemaining!:any;
  isAuction!:boolean;
  userBidPrice!:number;
  expectedBidPrice!:number;
  isDetailVisible!:boolean;
  isAuctionOver!:boolean;
  isBidClicked!:boolean;
  buyer!:User;
  contactSellerVisible!:boolean;
  bidInProcess!:boolean;
  bidDone!:boolean;
  isChatOpen!:boolean;

  constructor(private router: Router,private notificationService:NotificationsService,private adService:AdService,private userService:UserService,private categoryService:CategoryService,private auctionService:AuctionService,private activatedRoute:ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.adId = params.get('adId') as string; 
    });
    this.isLoggedIn = localStorage.getItem('user')!=null;
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
    this.isAuction = false;
    this.expectedBidPrice = 0;
    this.isDetailVisible = true;
    this.isAuctionOver = false;
    this.isBidClicked = false;
    this.contactSellerVisible = false;
    this.isChatOpen = false;

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  toogleSoldStatus(){
    if(!this.ad.sold){
      this.adService.markAdSold(this.ad.adId).subscribe((res)=>{
        this.ad.sold = true;
      },(error)=>{
        console.log(error);
      });
    }else{
      this.adService.markAdUnSold(this.ad.adId).subscribe((res)=>{
        this.ad.sold = false;
      },(error)=>{
        console.log(error);
      });
    }
  }

  saveAd(ad:any){
    this.adService.saveAdForUser(ad.adId,this.user.id).subscribe((flag)=>{
      if(flag){
        this.savedAds.push(ad);
      }else{
        alert("ad could not be saved");
      } 
    });
  }

  unSaveAd(adId:any){
    this.adService.unsaveAdForUser(adId,this.user.id).subscribe((flag)=>{
      if(flag){
        this.savedAds = this.savedAds.filter(adItem=>adItem.adId!=adId);
      }else{
        alert("ad could not be unsaved");
      }
    });
  }

  sendEmailNotifications(notification:any){
    this.notificationService.sendNotificationEmail(notification.notificationId).subscribe((res)=>{
      console.log(res);
    },(error)=>{
      console.log(error);
    });
  }

  addNotificationToFireStore(notification:any){
    notification.isDisplayed = false;
    this.notificationService.postNotificationToFireStore(notification);
  }

  bid(){
    this.isBidClicked = true;
    if(this.userBidPrice>=this.expectedBidPrice){
      this.bidInProcess = true;
      this.auctionService.bid(this.ad.adId,this.user.id,this.userBidPrice).subscribe((res)=>{
        this.ad.finalPrice  = this.userBidPrice;
        this.buyer  = this.user;
        this.bidInProcess = false;
        this.bidDone = true;
        this.sendEmailNotifications(res[0]);
        this.addNotificationToFireStore(res[0]);
        if(res.length==2){
          this.sendEmailNotifications(res[1]);
          this.addNotificationToFireStore(res[1]);
        }
      },(error)=>{
        console.log(error);
      })
    }
  }

  isAdSaved(adId:any){
    return this.savedAds.findIndex(ad=>ad.adId==adId)!=-1;
  }

  extractDetails(){
    this.isAuction = this.ad.adType == 3;
    if(!this.ad.bidDifference){
      this.expectedBidPrice = (this.ad.finalPrice*110)/100;
    }else{
      this.expectedBidPrice = this.ad.finalPrice+this.ad.bidDifference;
    }
    this.timeRemaining = (new Date(this.ad.auctionDeadline).getTime()-new Date().getTime())/1000;
    this.isAuctionOver = this.timeRemaining<=0;
  }

  ngOnInit(): void {
    this.adService.getAdById(this.adId).subscribe(adItem => {
      this.ad = adItem;
      this.extractDetails();
      this.categoryService.getCategories().subscribe((categories)=>{
         this.category =  categories.find((c:any)=>c.categoryId == this.ad.categoryId);
      })
      this.userService.getUserById(this.ad.sellerId).subscribe(userItem => this.seller = userItem);
      this.userService.getUserById(this.ad.buyerId).subscribe(userItem => this.buyer = userItem);
    });


    if(this.isLoggedIn){
      //increase view count for this ad
      this.adService.postAdView(this.adId).subscribe();

      //fetching all the saved ads for the user
      this.userService.getSavedAdsByUserId(this.user.id).subscribe((savedAds)=>{
        this.savedAds = savedAds;
        console.log(this.savedAds);
      },(error)=>{
        console.log(error);
      });
    }
  }

  visitProfile(){
    this.router.navigateByUrl("/profile/"+this.seller.id);
  }
}
