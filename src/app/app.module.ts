import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WODListComponent } from './WOD-list/wod-list.component';
import { WODAddComponent } from './WOD-add/wod-add.component';
import { WODService } from './wod.service';
import { WODUpdateComponent } from './WOD-update/wod-update.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    WODListComponent,
    WODAddComponent,
    WODUpdateComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [WODService],
  bootstrap: [AppComponent]
})
export class AppModule { }
