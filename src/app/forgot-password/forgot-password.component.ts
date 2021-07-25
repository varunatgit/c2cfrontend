import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm !: FormGroup;
  newPasswordForm !: FormGroup;
  otpGenerated : boolean = false;
  otpGenLoading : boolean = false;
  signedIn : boolean = false;
  errorInOtpGen : boolean = false;
  errorInOtpValidation : boolean = false;
  form1data : any;
  form2data : any;


  fieldTextType: boolean = false;
  constructor(private authService: AuthService,private router:Router, private formBuilder: FormBuilder) {
    this.buildEmailForm(new User({}));
  }

  ngOnInit(): void {
  }

  buildEmailForm(user:User){
    this.emailForm = new FormGroup({
      email : new FormControl(user.emailId,[Validators.required,Validators.email]),
      password : new FormControl(null),
      otp : new FormControl(null)
    })
  }

  buildEditProfileForm(user: User, emailId:string) {
    this.newPasswordForm = this.formBuilder.group({
      email : new FormControl(emailId,[Validators.required,Validators.email]),
      password : new FormControl(user.password,[Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      confirmPassword : new FormControl(user.password),
      otp : new FormControl(null, [Validators.required,Validators.maxLength(4)])
    }
    ,{
      validator: this.authService.MustMatch('password','confirmPassword')
    }
    )
  }

  onSubmitEmailForm() {
    console.log("otp gen");
    this.otpGenLoading = true;
    this.authService.generateOTP(this.emailForm.value)
    .subscribe(
      (data:any) => {
        this.otpGenLoading = false;
        console.log(data);
        this.form1data = data;
        if(data===null){
          this.errorInOtpGen=true;
        }
        if(data.response==true) {
          this.otpGenerated= true;
          this.buildEditProfileForm(new User({}),this.emailForm.get('email')?.value );
        }
      },
      (error)=> {
        this.errorInOtpGen=true;
      }
    )
  }

  onSubmitNewPasswordForm() {
    console.log("otp check");
    console.log(this.newPasswordForm.value);
    this.authService.validateOTP(this.newPasswordForm.value)
    .subscribe(
      (data:any) => {
        console.log(data);
        this.form2data = data;
        if(data===null){
          this.errorInOtpValidation=true;
        }
      },
      (error)=> {
        this.errorInOtpValidation=true;
      }
    )
  }

}
