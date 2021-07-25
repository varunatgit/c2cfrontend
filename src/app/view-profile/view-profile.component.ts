import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { DataService } from 'src/services/data.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  userDetails!: User;
  id!: string;
  contactTabOpened: boolean = true;
  userAds!: any;

  constructor(private router: Router,private activatedRoute:ActivatedRoute, private userService : UserService,
              private adService : AdService, private dataService : DataService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id') as string;
      this.userService.getUserById(this.id)
      .subscribe(
        data => {
          this.userDetails = data;
          console.log(this.userDetails);
        }
      );
      this.adService.getAdsBySellerId(this.id)
      .subscribe(
        data => {
          this.userAds = data;
          console.log(this.userAds);
        }
      )
    });
   }

  ngOnInit(): void {

  }

  setAdCard(ad:Ad){
    this.dataService.setAd(ad);
    return true;
  }



}
