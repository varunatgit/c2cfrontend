import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm !: FormGroup;
  signedIn : boolean = false;
  errorInSignIn : boolean = false;

  user = new User({})

  fieldTextType: boolean = false;

  constructor(private authService: AuthService,private router:Router) {
    this.buildSignInForm(new User({}));
   }

  ngOnInit(): void {
    
  }

  buildSignInForm(user:User){
    this.signInForm = new FormGroup({
      emailId : new FormControl(user.emailId,[Validators.required,Validators.email]),
      password : new FormControl(user.password,Validators.required)
    })
  }

  onSubmit() {
    this.authService.signIn(this.signInForm.value)
    .subscribe(
      (data:any) => {
        console.log(data);
        this.user = data;
        if(data===null){
          this.errorInSignIn=true; 
        }else{
          localStorage.setItem("user",JSON.stringify(data));
          this.router.navigateByUrl('/homepage');
        }
      },
      (err) => { console.log(err);this.errorInSignIn = true },
      () => console.log('done loading user')
    )
    this.signedIn = true;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
