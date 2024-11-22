import { Component } from '@angular/core';
import { Product } from '../../../../Models/product';
import { ProductService } from '../../../../Service/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
greeting : string = ''
userName !: string
allProductArray!: Product[]

constructor(private productService: ProductService
) { }
ngOnInit(){
this.userName = sessionStorage.getItem('username')!
  this.setGreeting()
  this.getAllProducts()
}

getAllProducts() {
  this.productService.getAllProducts().subscribe((res: any) => {
    this.allProductArray = res.allProduct;
  })
}

private setGreeting() {
  const currentTime = new Date().getHours();

  if (currentTime < 12) {
      this.greeting = 'Good Morning';
  } else if (currentTime < 18) {
      this.greeting = 'Good Afternoon';
  } else {
      this.greeting = 'Good Evening';
    }
}
}
