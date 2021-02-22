import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WODListComponent } from './WOD-list/wod-list.component';
import { WODAddComponent } from './WOD-add/wod-add.component';
import { WODUpdateComponent } from './WOD-update/wod-update.component';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';

const routes: Routes = [
  { path: 'wods', component: WODListComponent },
  { path: 'add', component: WODAddComponent },
  { path: 'update', component: WODUpdateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
