import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { CartComponent } from './Components/cart/cart.component';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public.component'
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// firebase start 
import { UploadWidgetModule } from "@bytescale/upload-widget-angular";
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from "../../../Enviroments/enviroments";
// firebase End
import { OurServicesComponent } from './Components/our-services/our-services.component';

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'cart', component: CartComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'our-service', component: OurServicesComponent },

    ]
  },
]


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CartComponent,
    AboutUsComponent,
    ContactUsComponent,
    RegistrationComponent,
    LoginComponent,
    OurServicesComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    // firebase
    UploadWidgetModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    //fireBase
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PublicModule { }
