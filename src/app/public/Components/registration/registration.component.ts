import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../Service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {


  activeTab: String = 'Buyer';
  otp!: number
  enteredOtp!: number

  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): { [key: string]: any } | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  SellerForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    phone: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    address: new FormControl("", Validators.required),
    confirmPassword: new FormControl("", Validators.required),
  }, { validators: this.passwordMatchValidator });

  BuyerForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    phone: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    address: new FormControl("", Validators.required),
    confirmPassword: new FormControl("", Validators.required),
  }, { validators: this.passwordMatchValidator });

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void { }

  navigateToLogin() {
    this.router.navigate(['login']);
  }


  verfication(emailId: any) {
    this.otp = this.generateOTP()
    console.log("email generated! Otp:" ,this.otp);
    let email = {
      otp: this.otp,
      email: emailId
    }
    this.userService.toSendVerificationOTP(email).subscribe(() => {
    })

  }
  SellerGetOTP() {
    console.log(this.SellerForm.value);
    if (!this.SellerForm.invalid) {
      this.verfication(this.SellerForm.get('email')?.value)
    }
    else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Form",
        showConfirmButton: false,
        timer: 1000
      });
    }
  }
  BuyerGetOTP() {
    console.log(this.BuyerForm.value);
    if (!this.BuyerForm.invalid) {
      this.verfication(this.BuyerForm.get('email')?.value)
    }
    else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Form",
        showConfirmButton: false,
        timer: 1000
      });
    }
  }
  RegisterAsSeller() {
    console.log(this.enteredOtp);
    if (this.otp == this.enteredOtp) {
      const register = {
        firstName: this.SellerForm.get('firstName')?.value,
        lastName: this.SellerForm.get('lastName')?.value,
        phone: this.SellerForm.get('phone')?.value,
        email: this.SellerForm.get('email')?.value,
        password: this.SellerForm.get('password')?.value,
        address: this.SellerForm.get('address')?.value,
      };
      this.userService.registerAsSeller(register).subscribe((res) => {
        console.log(res);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration Succesfull!!",
          showConfirmButton: false,
          timer: 1000
        });
        this.router.navigate(['login']);
      }, (error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Somthing Went Wrong",
          showConfirmButton: false,
          timer: 1000
        });
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Incorrect OTP",
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  RegisterAsBuyer() {
    console.log(this.enteredOtp);
    if (this.otp == this.enteredOtp) {
      const register = {
        firstName: this.BuyerForm.get('firstName')?.value,
        lastName: this.BuyerForm.get('lastName')?.value,
        phone: this.BuyerForm.get('phone')?.value,
        email: this.BuyerForm.get('email')?.value,
        password: this.BuyerForm.get('password')?.value,
        address: this.BuyerForm.get('address')?.value,
      };
      this.userService.registerAsBuyer(register).subscribe((response: any) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration Successfull!!",
          showConfirmButton: false,
          timer: 1000
        });
        this.router.navigate(['login']);
      }, (error: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Something Went Wrong",
          showConfirmButton: false,
          timer: 1000
        });
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Incorrect OTP",
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  generateOTP(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Usage example
  // const otp = generateOTP();
  // console.log(otp);
}
