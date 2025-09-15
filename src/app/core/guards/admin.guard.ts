import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserStateService } from '@core/state/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private userStateService = inject(UserStateService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.userStateService.$isLoggedIn()) {
      return true;
    }

    // Redirect to login and include intended URL
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
