import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm !: FormGroup;
  otpForm !: FormGroup;

  otp !: number;

  isOtpGenerated : boolean = false;
  errorInOtpGen : boolean = false;
  otpLoading : boolean = false;

  user = new User({});

  constructor(private formBuiler : FormBuilder,private authService: AuthService,private router:Router) {
    this.buildSignUpForm(new User({}));
  }

  ngOnInit(): void {

  }

  buildSignUpForm(user:User){
    this.signUpForm = this.formBuiler.group({
      firstName : new FormControl(user.firstName,[Validators.required,Validators.maxLength(20)]),
      lastName : new FormControl(user.lastName,[Validators.required,Validators.maxLength(20)]),
      address : new FormControl(user.address,Validators.required),
      emailId : new FormControl(user.emailId,[Validators.required,Validators.email,Validators.pattern(/^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|googlemail|yahoo|gmx|ymail|outlook|bluewin|protonmail|t\-online|web\.|online\.|aol\.|live\.)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/)]),
      phone : new FormControl(user.phone,[Validators.required, Validators.maxLength(10)]),
      pinCode : new FormControl(user.pinCode, Validators.required),
      password : new FormControl(user.password,[Validators.required, Validators.minLength(8),
                    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      confirmPassword : new FormControl(null),
      checkBox : new FormControl(false, Validators.requiredTrue)
    }
    ,{
      validator: this.authService.MustMatch('password','confirmPassword')
    }
    )
  }

  buildOtpForm() {
    this.otpForm = this.formBuiler.group({
      otpGenerated : new FormControl(null,Validators.required)
    },{
      validator: this.otpMustMatch('otpGenerated')
    })
  }

  onOtpGen() {
    console.log(this.signUpForm.value);
    this.otpLoading = true;
    const data = {
                    "email": this.signUpForm.get('emailId')?.value
                 }
    console.log(data);
    this.authService.getSignUpOTP(data)
    .subscribe(
      (data)=> {
        if(data==null) {
          this.errorInOtpGen = true;
        }
        this.isOtpGenerated = true;
        this.buildOtpForm();
        console.log(data);
        this.otp = data.message;
        this.otpLoading = false;
      },
      (error)=> {
        this.errorInOtpGen = true;
      }
    );

  }

  onSubmit() {
    console.log(this.signUpForm.value);
    this.authService.signUp(this.signUpForm.value)
    .subscribe(
      (data:any) => { console.log(data);
        this.user = data;
        localStorage.setItem("user",JSON.stringify(data));
        this.router.navigateByUrl('/homepage');
      },
      (err) => console.log(err)
    )
  }

  otpMustMatch(otpGenerated:string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[otpGenerated];

    if(!this.otp) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== this.otp) {
        control.setErrors({ otpMustMatch: true });
        return ({otpMustMatch: true})
      }
    else {
      return null;
      }
    }
  }

}
