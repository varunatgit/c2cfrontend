import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ad } from 'src/models/Ad';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private readonly url = "http://localhost:8080/ads";

  constructor(private httpClient:HttpClient) {

  }

  getAds():Observable<any>{
    return this.httpClient.get(this.url);
  }

  getAdById(id:String):Observable<any>{
    return this.httpClient.get(this.url+"/"+id);
  }

  getAdsBySellerId(sellerId:string):Observable<any>{
    return this.httpClient.get(this.url+"/seller/"+sellerId);
  }

  saveAdForUser(adId:any,userId:any):Observable<any>{
    return this.httpClient.post(this.url+'/save',{adId:adId,userId:userId});
  }

  unsaveAdForUser(adId:any,userId:any):Observable<any>{
    return this.httpClient.post(this.url+"/unsave",{adId:adId,userId:userId});
  }

  postAd(ad:Ad):Observable<any>{
    return this.httpClient.post("http://localhost:8080/insertAd",ad);
  }

  markAdSold(adId:any):Observable<any>{
    return this.httpClient.patch(this.url+"/"+adId+"/marked-sold",{});
  }

  markAdUnSold(adId:any):Observable<any>{
    return this.httpClient.patch(this.url+"/"+adId+"/marked-unsold",{});
  }

  updateAd(ad:Ad,adId:any): Observable<any> {
    return this.httpClient.patch(this.url+'/'+adId+'/edit',ad);
  }

  deleteAd(adId:any):Observable<any>{
    return this.httpClient.delete(this.url+"/"+adId+"/delete");
  }

  postAdView(id:string){
    return this.httpClient.get(this.url+"/"+id+"/update-view");
  }
}
