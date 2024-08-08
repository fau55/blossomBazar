import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contatctUsFormControl: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    subject: new FormControl("", Validators.required),
    message: new FormControl("", Validators.required),
  })

  sendEmail(){
    if(this.contatctUsFormControl.valid){
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Email Send Successfully!!",
        showConfirmButton: false,
        timer: 3500
      });
      }
      else{
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please Fill All the Fields",
        showConfirmButton: false,
        timer: 2500
      });

    }

  }
}
