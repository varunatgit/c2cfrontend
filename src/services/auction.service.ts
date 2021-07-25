import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  private readonly url = "http://localhost:8080";

  constructor(private httpClient:HttpClient) {

  }

  reconductAuction(adId:any):Observable<any>{
    return this.httpClient.get(this.url+"/ads/"+adId+"/reauction");
  }

  bid(bidAdId:any,bidBuyerId:any,bidPrice:any):Observable<any>{
    return this.httpClient.post(this.url+"/bid",{bidAdId:bidAdId,bidBuyerId:bidBuyerId,bidPrice:bidPrice});
  }
}
