import { Routes } from '@angular/router';
import { ShoeListComponent } from '../components/shoe-list/shoe-list.component';
import { ShoeManageComponent } from '../components/shoe-manage/shoe-manage.component';
import { ShoeFormComponent } from '../components/shoe-form/shoe-form.component';
import { ShoeDeleteComponent } from '../components/shoe-delete/shoe-delete.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: ShoeListComponent, canActivate: [authGuard] },
  { path: 'manage', component: ShoeManageComponent, canActivate: [authGuard] },
  { path: 'add', component: ShoeFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: ShoeFormComponent, canActivate: [authGuard] },
  { path: 'delete/:id', component: ShoeDeleteComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
