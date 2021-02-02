import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LevelsGuard implements CanActivate {
  constructor(
    private router: Router
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const lastWinLevel = parseInt(localStorage.getItem('lastWinLevel') as string, 10);
    const currentLevel =  parseInt(localStorage.getItem('currentLevel') as string, 10);
    const navigateLevel = parseInt(route.routeConfig?.path?.split('').reverse()[0] as string, 10);
    if (navigateLevel <= lastWinLevel + 1) {
      return true;
    }
    return this.router.navigate([`/level${currentLevel}`]);
  }
}
