import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/services/ad.service';
import { Router } from '@angular/router';
import { Ad } from 'src/models/Ad';
import { CategoryService } from 'src/services/category.service';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/User';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  ads!:Ad[];
  isLoggedIn!:boolean;
  
  trendingAds:Ad[] = [];
  recentlyAddedAds:Ad[] = [];
  donationAds:Ad[] = [];
  auctionAds:Ad[] = [];

  savedAds:Ad[] = [];

  categories:any = [];
  user!:User;

  constructor(private adService:AdService,private categoryService:CategoryService,private userService:UserService,private dataService:DataService,private router:Router) {  
    this.isLoggedIn = localStorage.getItem('user')!=null;
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
  }  

  setAdCard(ad:Ad){
    this.dataService.setAd(ad);
    return true;
  }

  isAuctionOver(ad:Ad){
    return new Date(ad.auctionDeadline)<new Date();
  }

  ngOnInit(): void {
    this.adService.getAds().subscribe((adList) => {
      this.ads = adList;
      this.ads = this.ads.filter(ad=>!ad.sold);
      this.trendingAds = this.ads.filter(ad=>ad.adType!=3);
      this.recentlyAddedAds = this.ads.filter(ad=>ad.adType!=3);
      this.donationAds = this.ads.filter(ad=>ad.adType!=3);
      this.auctionAds = this.ads.filter(ad=>ad.adType==3 && !this.isAuctionOver(ad));

      this.trendingAds.sort((x,y)=>y.views-x.views);
      this.auctionAds.sort((x,y)=>y.views-x.views);

      this.trendingAds = this.trendingAds.filter(ad=>ad.adType!=1);
      this.recentlyAddedAds.sort((x,y)=>new Date(y.adCreated).getTime()-new Date(x.adCreated).getTime());
      this.recentlyAddedAds = this.recentlyAddedAds.filter(ad=>ad.adType!=1);
      this.donationAds = this.donationAds.filter(ad=>ad.adType==1);
    },(error) =>{
      console.log(error);
    });

    this.categoryService.getCategories().subscribe(
    (categoryList)=>{
      this.categories = categoryList;
      this.categories = this.categories.sort((x:any,y:any)=>y.adCountInCategory-x.adCountInCategory);
      this.categories = this.categories.slice(0,5);
    },
    (error)=>{
      console.log(error);
    })
  }
}
