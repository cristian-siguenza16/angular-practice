import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Person } from './pages/person/person';
import { Home } from './pages/home/home';
import { FormPerson } from './pages/form-person/form-person';

export const routes: Routes = [
  { path: '', component:Home },
  { path: 'login', component:Login },
  { path: 'person/create', component:FormPerson },
  { path: 'person/:id', component:Person },
  { path: 'person/edit/:id', component:FormPerson },
  { path: '**', redirectTo: '' },
];
