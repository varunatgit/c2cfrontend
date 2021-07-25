import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private readonly url = "http://localhost:8080";

  constructor(private httpClient:HttpClient) { }

  rateSeller(adId:any,sellerId:any,rating:any):Observable<any>{
    return this.httpClient.post(this.url + "/users/rating", {adId:adId,userId: sellerId, ratings: rating });
  }

}
