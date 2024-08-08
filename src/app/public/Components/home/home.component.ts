import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import * as AOS from 'aos';
import { Product } from '../../../Models/product';
import { ProductService } from '../../../Service/product.service';
import Swal from 'sweetalert2';
import { CartService } from '../../../Service/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isUserLoggedIn!: string 

  allProductsArray!: Product[]
  viewMore: Product = new Product

  constructor(private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
    }
    this.isUserLoggedIn = sessionStorage.getItem('userId')!
    this.getAllProducts()
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.allProductsArray = res.allProduct
    })
  }

  viewdDetails(product: Product) {
    this.viewMore._id = product._id;
    this.viewMore.productName = product.productName;
    this.viewMore.productPrice = product.productPrice;
    this.viewMore.productImage = product.productImage;
    this.viewMore.productQuantity = product.productQuantity;
    this.viewMore.productDescription = product.productDescription;

  }

  AddToCart(id: string) {
    let userLogin = sessionStorage.getItem('isLoggedIn')!
    if (!userLogin) {
      Swal.fire({
        text: 'Login Is Required To Add Product in Cart!',
        icon: 'warning'
      })
    }
    else {
      Swal.fire({
        text: "Want to Add This Product To Cart!",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Add",
        denyButtonText: `Don't Add`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let product = {
            customer_id: sessionStorage.getItem('userId')!
          }
          this.cartService.addProductToCart(id, product).subscribe(() => {
            Swal.fire("Added!", "", "success");
            window.location.reload()
          })
        } else if (result.isDenied) {
          Swal.fire("Product is not Added!", "", "info");
        }
      });
    }

  }

}
