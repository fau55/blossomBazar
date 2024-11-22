import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = 'http://localhost:5000/api/bb/product/'


  constructor(private http : HttpClient) { }

  getAllProducts(){
    return this.http.get(this.baseUrl+'get-all')
  }

  addNewProduct(product: any){
    return this.http.post(this.baseUrl+'add', product)
  }

  deleteProduct(id: string){
    return this.http.delete(this.baseUrl+`delete/${id}`)
  }

  EditProduct(id: string, product: any){
    return this.http.post(this.baseUrl+`edit/${id}`, product)
  }
}
