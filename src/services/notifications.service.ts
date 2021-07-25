import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  http: HttpClient;
  private readonly url = "http://localhost:8080";

  usersCollection!:AngularFirestoreCollection<any>;

  constructor(httpClient: HttpClient,private afs: AngularFirestore) {
    this.http = httpClient;
    this.usersCollection = this.usersCollection = this.afs.collection<any>('users');
  }

  getNotifications(userId : any): Observable<any> {
    return this.http.get(this.url + "/notification/"+userId);
  }

  getFireStoreNotifications(userId:any):Observable<any>{
    return this.usersCollection.doc(userId+"").collection<any>('notifications').valueChanges();
  }

  markNotificationAsDisplayed(notification:any){
    return this.usersCollection.doc(notification.userId+"").collection<any>('notifications').doc(notification.notificationId+"").update({isDisplayed:true});
  }

  postNotificationToFireStore(notification:any){
    this.usersCollection.doc(notification.userId+"").collection<any>('notifications').doc(notification.notificationId+"").set(notification);
  }

  sendNotificationEmail(notificationId:any):Observable<any>{
    return this.http.get(this.url+"/notification/"+notificationId+"/mail");
  }

  notificationViewed(notificationId:number) {
    return this.http.get("http://localhost:8080/notification-view/"+ notificationId);
  }
}
