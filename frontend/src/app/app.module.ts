import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicComponent } from './public/public.component';
import { AdminComponent } from './admin/admin.component';
import { PublicModule } from './public/public.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    AdminComponent,

  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    PublicModule,
    FormsModule,
    AdminModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
