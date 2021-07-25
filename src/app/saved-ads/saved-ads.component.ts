import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { DataService } from 'src/services/data.service';
import { UserService } from 'src/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saved-ads',
  templateUrl: './saved-ads.component.html',
  styleUrls: ['./saved-ads.component.scss']
})
export class SavedAdsComponent implements OnInit {

  savedAds:Ad[]=[];
  user!:User;
  isLoading:boolean = true;

  constructor(private dataService:DataService,private router:Router,private adService:AdService,private userService:UserService) {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  unsaveAd(adId:any,event:any){
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to unsave this ad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adService.unsaveAdForUser(adId,this.user.id).subscribe((res)=>{
          this.savedAds = this.savedAds.filter(ad=>ad.adId!=adId);
          Swal.fire(
            'Unsaved!',
            'Your ad has been unsaved.',
            'success'
          )
        },
        (err)=>{
          Swal.fire(
            'Error occured!',
            'could not unsave ad',
            'error'
          )
          console.log(err);
        });
      }
    })
  }

  ngOnInit(): void {
    this.userService.getSavedAdsByUserId(this.user.id).subscribe((savedAds)=>{
      this.savedAds = savedAds;
      this.isLoading = false;
    });
  }
}
