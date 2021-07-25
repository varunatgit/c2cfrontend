import { Injectable } from '@angular/core';
import { Ad } from 'src/models/Ad';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  ad!:Ad;
  unseenNotifications!:boolean;
  isNotificationsVisible!:boolean;

  constructor() { 
    this.isNotificationsVisible = false;
  }

  setAd(ad:Ad){
    this.ad = ad;
  }
  
  getAd(){
    return this.ad;
  }

  showNotifications(){
    this.isNotificationsVisible = true;
  }

  hideNotifications(){
    this.isNotificationsVisible = false;
  }

  isUnseenNotifications(){
    return this.unseenNotifications;
  }
  
  setUnseenNotifications(status:boolean){
    this.unseenNotifications = status;
  }
}
