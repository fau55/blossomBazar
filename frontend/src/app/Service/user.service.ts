import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = 'http://localhost:5000/api/bb/user/';

  constructor(private http: HttpClient) { }

  registerAsSeller(user: any) {
    return this.http.post(this.baseUrl + 'register/seller', user);
  }

  registerAsBuyer(user: any) {
    return this.http.post(this.baseUrl + 'register/buyer', user);
  }

  loginUser(user: any) {
    return this.http.post('http://localhost:5000/api/user/login', user);
  }

  getAllUsers() {
    return this.http.get(this.baseUrl + 'get/all');
  }

  uploadProfilePic(id: string, profilePhoto: any) {
    return this.http.post(`http://localhost:5000/api/bb/upload/profilePic/${id}`, profilePhoto);
  }

  getProfilePhoto(id: string) {
    return this.http.get(`http://localhost:5000/api/bb/get/profilePic/${id}`);
  }

  editUser(id: string, user: any) {
    return this.http.post(`http://localhost:5000/api/bb/edit/user/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`http://localhost:5000/api/bb/delete/user/${id}`);
  }

  toSendVerificationOTP(email: any){
    return this.http.post('http://localhost:5000/api/bb/email/otp', email)
  }
}
