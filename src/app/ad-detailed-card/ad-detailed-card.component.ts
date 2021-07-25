import { Component, OnInit } from '@angular/core';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-ad-detailed-card',
  templateUrl: './ad-detailed-card.component.html',
  styleUrls: ['./ad-detailed-card.component.scss']
})
export class AdDetailedCardComponent implements OnInit {

  ad!:Ad;
  user!:User;

  constructor(private dataService:DataService,private adService:AdService) {
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
  }

  unsaveAd(adId:any){
    this.adService.unsaveAdForUser(adId,this.user.id).subscribe((res)=>{
      alert(res);
    });
  }

  deleteAd(adId:any){
    this.adService.deleteAd(adId).subscribe((res)=>{
      alert("ad deleted!");
    },
    (err)=>{
      alert("could not delete ad!");
      console.log(err);
    })
  }

  ngOnInit(): void {
    this.ad = this.dataService.getAd();
  }

}
