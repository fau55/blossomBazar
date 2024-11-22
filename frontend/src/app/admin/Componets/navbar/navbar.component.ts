import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
//?firebase
import { UploadWidgetConfig, UploadWidgetOnUpdateEvent } from "@bytescale/upload-widget";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";
//?firebase end
import { UserService } from '../../../Service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userName: string = 'Farah';
  greeting: string = '';
  profilePic = '';

   //?firebase 
   uploadImageURL: string = '';
   showPreviewImage: boolean = false;
   fileName: string = 'Image';
   friendpic: any;
   //?firebase end

  constructor(private router: Router,
    public storage: Storage,
    public userService : UserService
  ) { }
  ngOnInit() {
    // getting profile pic
    this.getProfilePic()
    this.setGreeting()
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

  // method to get profile pic
  getProfilePic(){
    this.userService.getProfilePhoto(sessionStorage.getItem('userId')!).subscribe((res:any)=>{
      this.profilePic = res.profilePic;
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

  logout() {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Logout",
      denyButtonText: `Don't Logout`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        sessionStorage.clear();
        this.router.navigate(['/home'])
        Swal.fire("Logout Successful!!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Not Logout!", "", "info");
      }
    });   

  }
}
