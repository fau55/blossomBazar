import { Component } from '@angular/core';
import { ProductService } from '../../../../Service/product.service';
import { Product } from '../../../../Models/product';
import Swal from 'sweetalert2';
//?firebase
import { UploadWidgetConfig, UploadWidgetOnUpdateEvent } from "@bytescale/upload-widget";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";
//?firebase end

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  allProductArray!: Product[]
  addProduct: Product = new Product
  viewProduct: Product = new Product
  editProductObject: Product = new Product


  //?firebase 
  uploadImageURL: string = '';
  showPreviewImage: boolean = false;
  fileName: string = 'Image';
  friendpic: any;
  //?firebase end

  constructor(private productService: ProductService,
    public storage: Storage,
  ) { }

  ngOnInit() {
    this.getAllProducts()
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.allProductArray = res.allProduct;
    })
  }


  //?firebase
  // image upload code, configuration and logic..
  // for more configurations visit : https://www.bytescale.com/docs/upload-widget/angular#configuration
  options: UploadWidgetConfig = {
    apiKey: "free", // Get API key: https://www.bytescale.com/get-started
    maxFileCount: 1,
    multi: false,
    mimeTypes: ["image/jpeg", "image/png"],
    showFinishButton: false,
    showRemoveButton: true,
    styles: {
      colors: {
        "active": "#e597eb",
        "error": "#808080 ",
        "primary": "#db0d63",
        "shade100": "#db0d63",
        "shade200": "#f53b88",
        "shade300": "#db0d63",
        "shade400": "#f53b88",
        "shade500": "#d3d3d3",
        "shade600": "#f53b88",
        "shade700": "#f0f0f0",
        "shade800": "#f8f8f8",
        "shade900": "#fff"
      }
    }
  };

  // ye method image upload karte hi execute honga.. aur hame image url milenga.. bytescale pe upload hongi ye image sabse pehle..
  onUpdate = ({ uploadedFiles, pendingFiles, failedFiles }: UploadWidgetOnUpdateEvent) => {
    if (uploadedFiles && uploadedFiles.length != 0) {
      this.fileName = uploadedFiles[0].originalFile.file.name;
    }
    const uploadedFileUrls = uploadedFiles.map(x => x.fileUrl).join("\n");
    this.uploadImageURL = uploadedFileUrls;
    if (this.uploadImageURL != '') {
      this.showPreviewImage = true;
      this.height = "150px";
    }
    else {
      this.showPreviewImage = false;
      this.uploadImageURL = '';
      this.height = "302px"
    }
  };
  width = "600px";
  height = "302px";
  //?firebase

  //?onclick of save saving to firebase

  // onSave() {

  // }

  uploadToFireBase(imageFile: any) {
    if (imageFile != '' && imageFile != null && imageFile.length != 0) {
      // uploading to firebase...
      const storageRef = ref(this.storage, `images/consultant/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case 'paused':

              break;
            case 'running':

              break;
          }

        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          //comment
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('path of image: ', downloadURL);
            let newProduct = {
              productName: this.addProduct.productName,
              productDescription: this.addProduct.productDescription,
              productImage: downloadURL,
              productPrice: this.addProduct.productPrice,
              productQuantity: this.addProduct.productQuantity
            }

            this.productService.addNewProduct(newProduct).subscribe(() => {
              this.getAllProducts()
              
              this.addProduct.productName = '';
              this.addProduct.productDescription = '';
              this.addProduct.productPrice = 0;
              this.addProduct.productQuantity = 0;

              Swal.fire({
                title: 'Product',
                icon: "success"
              })
            })

          });
        })
    }
  }

  convertUrlToFile(url: string) {
    fetch(url)
      .then(async response => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        const file = new File([blob], this.fileName, { type: 'image/png' })
        // access file here
        this.uploadToFireBase(file);
      })
  }
  //?firebase end

  addProducts() {
    this.convertUrlToFile(this.uploadImageURL);
  }

  deleteProduct(id: string) {

    Swal.fire({
      title: "Sure You Wnat To Delete This Product?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe((res: any) => {
          this.getAllProducts()
          Swal.fire("Deleted!", "", "success")
        })
      } else if (result.isDenied) {
        Swal.fire("product is not deleted", "", "info");
      }
    });
  }

  viewDetails(index: number) {
    this.viewProduct.productName = this.allProductArray[index].productName;
    this.viewProduct.productDescription = this.allProductArray[index].productDescription;
    this.viewProduct.productImage = this.allProductArray[index].productImage;
    this.viewProduct.productPrice = this.allProductArray[index].productPrice;
    this.viewProduct.productQuantity = this.allProductArray[index].productQuantity;
  }


  editProductModal(index: number) {
    this.editProductObject.productName = this.allProductArray[index].productName
    this.editProductObject.productDescription = this.allProductArray[index].productDescription
    this.editProductObject.productPrice = this.allProductArray[index].productPrice
    this.editProductObject.productQuantity = this.allProductArray[index].productQuantity
    this.editProductObject.productImage = this.allProductArray[index].productImage
    this.editProductObject._id = this.allProductArray[index]._id
  }

  editProductApi() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let newProductToEdit = {
          productName: this.editProductObject.productName,
          productDescription: this.editProductObject.productDescription,
          productPrice: this.editProductObject.productPrice,
          productQuantity: this.editProductObject.productQuantity,
        }
        this.productService.EditProduct(this.editProductObject._id, newProductToEdit).subscribe(() => {
          this.getAllProducts()
          Swal.fire("Saved!", "", "success");
        })

      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


}


