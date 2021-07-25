import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';
import { Router } from '@angular/router';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  userDetails = JSON.parse(localStorage.user);
  unseenNotifications: boolean = false;
  notifications: any[] = [];
  notificationsLoading : boolean = false;

  constructor(private notificationsService: NotificationsService,public dataService:DataService, private router: Router) { }

  ngOnInit(): void {
    this.notificationsLoading=true;
    this.notificationsService.getNotifications(this.userDetails.id)
      .subscribe(notificationsList => {
        this.notifications = notificationsList;
        this.notificationsLoading = false;
        this.checkIfUnseenNotifications();
      });
  }

  checkIfUnseenNotifications(){
    this.unseenNotifications = this.notifications.findIndex((n:any)=>n.viewed==false)!=-1;
    this.dataService.setUnseenNotifications(this.unseenNotifications);
  }

  openNotification(adId: number, notificationId: number) {
    this.notificationsService.notificationViewed(notificationId)
      .subscribe(
        (res) => {
          const notification = this.notifications.find(n => n.notificationId == notificationId);
          notification.viewed = true;
          this.checkIfUnseenNotifications();
        }
      );
    this.router.navigateByUrl('ads/' + adId);
    this.dataService.hideNotifications();
  }

}


