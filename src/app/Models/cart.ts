export class Cart {
    _id! : string; 
    productId! : string;
    productDetail! : ProductDetails

}

export class ProductDetails{
    productName! : string;
    productImage! : string;
    productPrice! : number;
    productQuantity! : number;
}