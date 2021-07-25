import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http: HttpClient;

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
   }

   signIn(data: any): Observable<any> {
    return this.http.post("http://localhost:8080/login",data);
   }

   signUp(data: any): Observable<any> {
    return this.http.post("http://localhost:8080/signup",data);
   }

   generateOTP(data: any): Observable<any> {
    return this.http.post("http://localhost:8080/users/otp",data);
   }

   validateOTP(data:any): Observable<any> {
     return this.http.patch("http://localhost:8080/users/reset-password",data);
   }

   getSignUpOTP(data:any): Observable<any> {
     return this.http.post("http://localhost:8080/users/signup/otp",data);
   }

   MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return null;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
          return ({mustMatch: true})
      } else {
          return null;
      }
    }
  }

}
