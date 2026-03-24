import { Routes } from '@angular/router';
import { ShoeListComponent } from '../components/shoe-list/shoe-list.component';
import { ShoeFormComponent } from '../components/shoe-form/shoe-form.component';
import { ShoeDeleteComponent } from '../components/shoe-delete/shoe-delete.component';

export const routes: Routes = [
  { path: '', component: ShoeListComponent },
  { path: 'add', component: ShoeFormComponent },
  { path: 'edit/:id', component: ShoeFormComponent },
  { path: 'delete/:id', component: ShoeDeleteComponent },
  { path: '**', redirectTo: '' }
];
