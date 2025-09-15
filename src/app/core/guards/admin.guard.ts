import {inject, Injectable} from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import {UserStateService} from '@core/state/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  userStateService = inject(UserStateService);
  router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.userStateService.$isLoggedIn()) {
      return true;
    }

    // Preferred: return a UrlTree to redirect
    return this.router.createUrlTree(['/admin/login']);
  }
}
