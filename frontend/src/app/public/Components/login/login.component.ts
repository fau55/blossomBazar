import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../Service/user.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  Login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.userService.loginUser(this.loginForm.value).subscribe((res: any) => {
        console.log(res);
        if (res.userExist == true && res.correctPassword == true) {

          if (res.userRole == "Seller") {
            // opening the admin site..
            sessionStorage.setItem('isLoggedIn', 'true')
            sessionStorage.setItem('userId', res.user_id)
            sessionStorage.setItem('username', res.user_name)
            this.router.navigate(['/admin']);

          }
          else {
            sessionStorage.setItem('isLoggedIn', 'true')
            sessionStorage.setItem('userId', res.user_id)
            sessionStorage.setItem('username', res.user_name)
            this.router.navigate(['/home']);
          }

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Login Successfully!!",
            showConfirmButton: false,
            timer: 3500
          });
        }
        else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Invalid Email Or Password",
            showConfirmButton: false,
            timer: 2500
          });

        }
      }, (error: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Login Error",
          showConfirmButton: false,
          timer: 2500
        });
      });
    }
    else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Form",
        showConfirmButton: false,
        timer: 2500
      });
    }
  }

}
