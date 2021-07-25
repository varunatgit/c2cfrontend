import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly url = "http://localhost:8080/category";

  constructor(private httpClient:HttpClient) { }

  getCategories():Observable<any>{
    return this.httpClient.get(this.url);
  }
}
