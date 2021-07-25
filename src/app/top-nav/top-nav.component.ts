import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { User } from 'src/models/User';
import { AdService } from 'src/services/ad.service';
import { ChatService } from 'src/services/chat.service';
import { DataService } from 'src/services/data.service';
import { NotificationsService } from 'src/services/notifications.service';
import { SearchService } from 'src/services/search.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  searchKeyword!:string;
  ads!:Ad[];
  user!:User;
  isSearchInputVisible!:boolean;
  isLoggedIn!:boolean;
  isMenuOpen!:boolean;
  isNotificationsOpen!:boolean;
  unseenNotifications!: boolean;
  unseenChatCount:number = 0;
  chatCount:number = 0;
  unseenChats:any[] = [];
  subscription!:Subscription;

  constructor(private adService:AdService,private chatService:ChatService,public dataService:DataService,private notificationService:NotificationsService,private searchService:SearchService,private router:Router,private eRef: ElementRef) {
    this.isLoggedIn = localStorage.getItem('user')!=null;
    this.isMenuOpen = false;
    this.isNotificationsOpen = false;
    this.user = JSON.parse(localStorage.getItem('user')!) as User;
    this.unseenNotifications = false;
  }

  search(){
    if(this.searchKeyword==""){
      return;
    }
    const index = this.ads.findIndex(
      ad => ad.productName.toLowerCase().includes(this.searchKeyword)
    );
    if(index!=-1){
      this.router.navigateByUrl('/ads');
    }
  }

  onLogOutClick(){
    localStorage.clear();
  }

  onCreateAdClick(){
    if(this.isLoggedIn){
      this.router.navigateByUrl('/create-ad');
    }else{
      this.router.navigateByUrl('/sign-in');
    }
  }

  updateKeyword(){
    this.searchService.setKeyword(this.searchKeyword);
    this.search();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: { target: any; }) {
    if(this.eRef.nativeElement.contains(event.target)) {
      //clicked inside top nav
    } else {
      //clicked outside top nav
      this.closePopUps();
    }
  }

  closePopUps(){
    this.isMenuOpen = false;
    this.isNotificationsOpen = false;
  }

  showNotification(notification:any){
    if(!notification.img){
      notification.img = "../../assets/sample-profile-pic.jpg";
    }
    const notification1 = new Notification("New notification from C2C", {
        body: notification.title,
        icon: notification.img
    });
    notification1.addEventListener("click",()=>{
      this.router.navigateByUrl('/ads/'+notification.adId);
    })
  }

  sendNotification(notification:any){
    if(Notification.permission === "granted"){      
      this.showNotification(notification);
    }else if (Notification.permission != "denied"){
      Notification.requestPermission().then(permission => {
          if(permission === "granted"){  
            this.showNotification(notification);
          }  
      });
    }
  }
 
  ngOnInit(): void {
    this.adService.getAds().subscribe((list : Ad[])=>{
      this.ads = list;
    });

    this.chatService.getChatsByUserId(this.user.id+'').subscribe((chatIdList:any[])=>{
      this.unseenChatCount = 0;

      chatIdList.forEach((item)=>{
        this.chatService.getChatById(item.chatId).subscribe((chat)=>{
          if(chat.seenBy.findIndex((id:any)=>id==this.user.id)==-1){
            this.unseenChats.push(chat);
          }else if(this.unseenChats.findIndex(c=>c.chatId==chat.chatId)!=-1){
            this.unseenChats = this.unseenChats.filter(c=>c.chatId!=chat.chatId);
          }
        })
      })
    })

    this.notificationService.getNotifications(this.user.id)
    .subscribe(notificationsList => {
      this.unseenNotifications = notificationsList.findIndex((n:any)=>!n.viewed)!=-1;
      this.dataService.setUnseenNotifications(this.unseenNotifications);
    });

    this.subscription = this.notificationService.getFireStoreNotifications(this.user.id).subscribe((notifications:any[])=>{
      //this.unseenNotifications = notifications.findIndex((n:any)=>!n.viewed)!=-1;
      notifications.forEach(notification=>{
        if(!notification.isDisplayed){
          this.sendNotification(notification);
          this.notificationService.markNotificationAsDisplayed(notification);
        }
      });
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
