import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl: string = 'http://localhost:5000/api/bb/cart/';

  constructor(private http: HttpClient) { }

  getAllCartProducts(id : string) {
    return this.http.get(this.baseUrl + `get/${id}`);
  }

  addProductToCart(id: string, customerid: any) {
    return this.http.post(this.baseUrl + `add/${id}`, customerid);
  }

  deleteProductOfCart(id: string) {
    return this.http.delete(this.baseUrl + `delete/${id}`);
  }

  deleteAllProducts() {
    return this.http.delete(this.baseUrl + 'delete-all');
  }
}
