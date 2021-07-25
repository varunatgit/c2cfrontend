import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import axios from 'axios';
import { User } from 'src/models/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  imageSelected: boolean = false;
  changePassword: boolean = false;
  imageLoading: boolean = false;
  imageTouched: boolean = false;

  editProfileForm !: FormGroup;

  @ViewChild('myInput') myInputVariable: ElementRef | any;

  CLOUDINARY_URL = "	https://api.cloudinary.com/v1_1/hashedin/upload";
  CLOUDINARY_UPLOAD_PRESET = "cbtxrrbg";
  userDetails:User;

  url: string;

  constructor(private router:Router, private formBuilder : FormBuilder,private authService: AuthService, private userService: UserService) {
    this.userDetails = JSON.parse(localStorage.getItem('user')!) as User;
    this.buildEditProfileForm(this.userDetails);
    this.url=this.userDetails.picture;
  }

  ngOnInit(): void {
    if(this.userDetails.picture) {
      this.imageSelected = true;
    }
    console.log(this.userDetails);
  }

  buildEditProfileForm(user: User) {
    this.editProfileForm = this.formBuilder.group({
      id : new FormControl(user.id,Validators.required),
      emailId : new FormControl(user.emailId,Validators.required),
      firstName : new FormControl(user.firstName,[Validators.required,Validators.maxLength(20)]),
      lastName : new FormControl(user.lastName,[Validators.required,Validators.maxLength(20)]),
      address : new FormControl(user.address,Validators.required),
      phone : new FormControl(user.phone,[Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
      pinCode : new FormControl(user.pinCode, Validators.required),
      password : new FormControl(user.password,[Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      currentPassword : new FormControl(null),
      confirmPassword : new FormControl(user.password),
      picture : new FormControl(user.picture)
    }
    ,{
      validator: [this.authService.MustMatch('password','confirmPassword'),
                  this.checkPassword('currentPassword')]
    }
    )
  }

  onSubmit() {
    console.log(this.editProfileForm.value);
    this.userService.editProfile(this.editProfileForm.value).subscribe(
      (res)=>{
        console.log(res);
        localStorage.setItem("user",JSON.stringify(res));
        console.log(localStorage.getItem("user"));
        Swal.fire(
          'Updated!',
          'Your profile has been updated.',
          'success'
        )
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  onSelectFile(e:any) {
    var file = e.target.files[0];
    var formData = new FormData;
    formData.append('file',file);
    this.imageLoading = true;
    this.imageTouched = true;
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    axios({
      url: this.CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
      }).then((res) => {
        this.imageLoading = false;
        console.log(res);
        this.url = res.data.secure_url;
        this.editProfileForm.get('picture')?.setValue(this.url);
        this.imageSelected = true;
      }).catch(function(err) {
        console.log(err);
      });
  }

  removeImage() {
    this.imageTouched = true;
    this.url = "";
    this.editProfileForm.get('picture')?.setValue(null);
    this.imageSelected = false;
    this.myInputVariable.nativeElement.value = '';
  }

  changePasswordFunc() {
    this.changePassword = true;
    this.editProfileForm.get('password')?.setValue(null);
    this.editProfileForm.get('confirmPassword')?.setValue(null);
  }

  cancelFunc() {
    this.changePassword = false;
    this.buildEditProfileForm(this.userDetails);
    this.url = this.userDetails.picture;
    if(this.url) {
      this.imageSelected = true;
    }
    else {
      this.imageSelected = false;
    }
  }

  checkPassword(currentPassword:string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[currentPassword];

    if(!this.changePassword) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== this.userDetails.password) {
        control.setErrors({ mustBeSame: true });
        return ({mustBeSame: true})
      }
    else {
      return null;
      }
    }
  }

}
