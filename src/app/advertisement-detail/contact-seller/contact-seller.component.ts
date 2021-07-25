import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/User';

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.scss']
})
export class ContactSellerComponent implements OnInit {

  @Input()
  seller!:User;
  constructor() { }

  ngOnInit(): void {
  }

}
