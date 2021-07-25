import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/models/User';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  userDetails = JSON.parse(localStorage.user);

  supportForm !: FormGroup;

  sendingMail:boolean = false;
  mailSent:boolean = false;

  constructor( private userService: UserService) {
    this.buildSupportForm(this.userDetails);
  }

  ngOnInit(): void {
  }

  buildSupportForm(user:User){
    this.supportForm = new FormGroup({
      emailId : new FormControl(user.emailId,[Validators.required,Validators.email]),
      message : new FormControl(null,[Validators.required, Validators.minLength(10)])
    })
  }

  onSubmit() {
    this.sendingMail = true;
    this.userService.sendMail(this.supportForm.value)
      .subscribe(
        res => {
          console.log(res);
          this.sendingMail = false;
          this.mailSent = true;
        }
      );
  }

}
