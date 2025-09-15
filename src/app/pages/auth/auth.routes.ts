import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page';
// Import other auth components as you add them
// import { RegisterPageComponent } from './register-page';
// import { ForgotPasswordComponent } from './forgot-password';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
  // Add more auth routes as needed:
  // {
  //     path: 'register',
  //     component: RegisterPageComponent
  // },
  // {
  //     path: 'forgot-password',
  //     component: ForgotPasswordComponent
  // }
];
