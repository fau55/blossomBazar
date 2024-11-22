import { Component } from '@angular/core';
import Swal from 'sweetalert2';
//?firebase
import { UploadWidgetConfig, UploadWidgetOnUpdateEvent } from "@bytescale/upload-widget";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";
//?firebase end
import { UserService } from '../../../Service/user.service';
import { Router } from '@angular/router';
import { Cart } from '../../../Models/cart';
import { CartService } from '../../../Service/cart.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isUserLoggedIn: boolean = false;
  userName: string = '';
  profilePic!: string;
  cartProductArray : Cart[] = []
  totalPrice! : number

  //?firebase 
  uploadImageURL: string = '';
  showPreviewImage: boolean = false;
  fileName: string = 'Image';
  friendpic: any;
  //?firebase end

  constructor(private router: Router,
    public storage: Storage,
    public userService : UserService,
    private cartService : CartService
  ) { }

  ngOnInit(): void {
    this.isUserLoggedIn = sessionStorage.getItem('isLoggedIn') == 'true' ? true : false;
    this.userName = sessionStorage.getItem('username')!;
      // getting profile pic
      if(this.isUserLoggedIn){
        this.getProfilePic()
        this.getAllProductsOfCart()
      }
  }
    // method to get profile pic
    getProfilePic(){
      this.userService.getProfilePhoto(sessionStorage.getItem('userId')!).subscribe((res:any)=>{
        this.profilePic = res.profilePic;
      })
    }



  ngDoCheck() {
    this.isUserLoggedIn = sessionStorage.getItem("isLoggedIn") == "true" ? true : false;
  }

  logout() {
    sessionStorage.clear();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Logout Successfully!!",
      showConfirmButton: false,
      timer: 1000
    });
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

  onSave() {
    // this.showLoader = true
    this.convertUrlToFile(this.uploadImageURL);
    Swal.fire({
      icon: "success",
      title: "Profile pic added to firebase",
      showConfirmButton : false,
      timer: 1000
    });
  }

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
          
            this.userService.uploadProfilePic(sessionStorage.getItem('userId')!,{profilePhoto: downloadURL}).subscribe(()=>{
              this.getProfilePic()
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

  getAllProductsOfCart() {
    this.cartService.getAllCartProducts(sessionStorage.getItem('userId')!).subscribe(
      (res: any) => {
        this.cartProductArray = res.cartProducts || [];
        this.totalPrice = this.cartProductArray.reduce((sum, element: any) => {
          return sum + (element.productDetail.productPrice || 0);
        }, 0);
      },
      (error) => {
        console.error('Error fetching cart products', error);
        // Handle the error as appropriate
      }
    );
  }

  removeProduct(id:string){
    Swal.fire({
      text: "Want to remove This Product To Cart!",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.cartService.deleteProductOfCart(id).subscribe(()=>{
          Swal.fire("Deleted!", "", "success");
          this.getAllProductsOfCart()
        })
      } else if (result.isDenied) {
        Swal.fire("Product is not Deleted!", "", "info");
      }
    });    
  }

  purchedAll(){
    Swal.fire({
      text: "want to buy all the Product!",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Buy Now?",
      denyButtonText: `Not Now`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.cartService.deleteAllProducts().subscribe(()=>{
          Swal.fire("Payment Successfull!!", "", "success");
          this.getAllProductsOfCart()
        })
      } else if (result.isDenied) {
        Swal.fire("Product is not purchased!", "", "info");
      }
    });
  }
}
