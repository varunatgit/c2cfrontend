import { Component, OnInit } from '@angular/core';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { DataService } from 'src/services/data.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.component.html',
  styleUrls: ['./ad-card.component.scss']
})
export class AdCardComponent implements OnInit {

  ad!:Ad;
  savedAds:Ad[]=[];
  user!:User;
  isSaveLoaded:boolean = false;

  isLoggedIn:boolean;
  timeRemaining!: number;
  isAuction!:boolean;

  constructor(private dataService:DataService,private userService:UserService,private adService:AdService) {
    this.isLoggedIn = localStorage.getItem('user')!=null;
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
    this.isAuction = false;
  }

  saveAd(ad:any){
    this.adService.saveAdForUser(ad.adId,this.user.id).subscribe((flag)=>{
      if(flag){
        this.savedAds.push(ad);
        this.updateLocally();
      }else{
        alert("ad could not be saved");
      } 
    });
  }

  unSaveAd(adId:any){
    this.adService.unsaveAdForUser(adId,this.user.id).subscribe((flag)=>{
      if(flag){
        this.savedAds = this.savedAds.filter(adItem=>adItem.adId!=adId);
        this.updateLocally();
      }else{
        alert("ad could not be unsaved");
      }
    });
  }

  isAdSaved(adId:any){
    return this.savedAds.findIndex(ad=>ad.adId==adId)!=-1;
  }

  updateLocally(){
    localStorage.setItem('savedAds',JSON.stringify(this.savedAds));
  }
  
  ngOnInit(): void {
    this.ad = this.dataService.getAd();
    this.isAuction = this.ad.adType == 3;
    this.timeRemaining = (new Date(this.ad.auctionDeadline).getTime()-new Date().getTime())/1000;
    if(this.isLoggedIn){
      if(localStorage.getItem('savedAds')!=null){
        this.savedAds = JSON.parse(localStorage.getItem('savedAds')!);
        this.isSaveLoaded = true;
        return;
      }
      this.userService.getSavedAdsByUserId(this.user.id).subscribe((savedAds)=>{
        this.savedAds = savedAds
        this.isSaveLoaded = true;
        this.updateLocally();
      });
    }
  }
}
