import { Component } from '@angular/core';
import { User } from '../../../../Models/user';
import { UserService } from '../../../../Service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  AllUserArray: User[] = []

  userEdit: User = new User
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUsers()
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((res: any) => {
      this.AllUserArray = res.allUser
    })
  }
  editUser(index: number) {
    this.userEdit.firstName = this.AllUserArray[index].firstName;
    this.userEdit.lastName = this.AllUserArray[index].lastName;
    this.userEdit.email = this.AllUserArray[index].email;
    this.userEdit.phone = this.AllUserArray[index].phone;
    this.userEdit.password = this.AllUserArray[index].password;
    this.userEdit.profilePhoto = this.AllUserArray[index].profilePhoto;
    this.userEdit.address = this.AllUserArray[index].address;
    this.userEdit._id = this.AllUserArray[index]._id;
    this.userEdit.role = this.AllUserArray[index].role;

  }

  confirmUserEdit() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let userToEdit =
        {
          firstName: this.userEdit.firstName,
          lastName: this.userEdit.lastName,
          phone: this.userEdit.phone,
          address: this.userEdit.address,
          password: this.userEdit.password
        }
        this.userService.editUser(this.userEdit._id, userToEdit).subscribe(() => {
          this.getAllUsers()
        })
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  deleteUser(id: string) {
    Swal.fire({
      title: "Are You Sure You Want To delete the User?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          this.getAllUsers()
          Swal.fire("User Deleted Successfully!!", "", "success");
        })
      } else if (result.isDenied) {
        Swal.fire("User Is Not deleted", "", "info");
      }
    });


  }
  onSave() {

  }

}
