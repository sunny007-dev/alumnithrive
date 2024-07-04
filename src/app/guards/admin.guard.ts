import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenInterceptor } from '../core/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  role;
  constructor(private authService: AuthService, private router: Router, private notify: TokenInterceptor) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let data: any = localStorage.getItem("token");
    const token = JSON.parse(data);
      this.role = this.authService.getUserRole();
console.log(typeof this.role, 'Role');
    
    if (token ) {
      if(this.role === "1") {
        return true;
      } else {
        this.notify.notificationService.warning("Unauthorized access! Please try with valid access");
        this.router.navigate(['/dashboard']);
        return false;
      }
    } else {
      location.assign('/auth/sign-in');
      return false;
    }
  }
}
