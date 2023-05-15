import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router,private userService: UserService) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('RoleGuard canActivate method called.');
      const currentUser = this.userService.currentUser;
      if (currentUser && currentUser.isAdmin) {
        console.log('User is admin. Access allowed.');
        return true;
      } else {
        console.log('User is not admin. Access denied.');
        this.router.navigate(['/']);
        return false;
      }
    }
  }
