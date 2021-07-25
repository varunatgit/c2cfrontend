import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  
  visible: boolean;
  isMenuVisible:boolean;

  constructor() { this.visible = false; this.isMenuVisible = false}


  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

  hideMenu(){
    this.isMenuVisible = false;
  }

  showMenu(){
    this.isMenuVisible = true;
  }
  
  toogleMenu(){
    this.isMenuVisible = !this.isMenuVisible;
  }
}
