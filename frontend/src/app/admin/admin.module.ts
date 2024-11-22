import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './Componets/navbar/dashboard/dashboard.component';
import { ProductsComponent } from './Componets/navbar/products/products.component';
import { UsersComponent } from './Componets/navbar/users/users.component';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms'; 
import { NavbarComponent } from './Componets/navbar/navbar.component';
// import { SidebarComponent } from './Componets/sidebar/sidebar.component';
// firebase start 
import { UploadWidgetModule } from "@bytescale/upload-widget-angular";
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideFirestore, getFirestore} from '@angular/fire/firestore';
import { provideStorage, getStorage } from  '@angular/fire/storage';
import { environment } from "../../../Enviroments/enviroments";
// firebase End

const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: '', redirectTo: 'navbar', pathMatch: 'full' },
      {
        path: 'navbar', component: NavbarComponent, children:
          [

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'user', component: UsersComponent },
            { path: 'products', component: ProductsComponent },



          ]
      },
    ]
  },
]
@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    UsersComponent,
    NavbarComponent

  ],
  imports: [
    FormsModule,
    // firebase
    UploadWidgetModule,
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=> getFirestore()),
    provideStorage(()=>getStorage()),
    //fireBase
    CommonModule,
    RouterModule.forChild(adminRoutes)
  ]
})
export class AdminModule { }
