import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchKeyword:BehaviorSubject<any> = new BehaviorSubject("");

  constructor() {
    
  }

  setKeyword(keyword:string){
    this.searchKeyword.next(keyword);
  }

  getKeyword(){
    return this.searchKeyword.value;
  }

}
