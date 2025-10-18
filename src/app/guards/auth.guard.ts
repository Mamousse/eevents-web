import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // Vérifier si la route nécessite le rôle admin
      if (route.data['role'] && route.data['role'] === 'admin') {
        if (currentUser.role === 'admin') {
          return true;
        }
        // Non autorisé, redirection vers la page d'accueil
        this.router.navigate(['/']);
        return false;
      }

      // Utilisateur connecté, accès autorisé
      return true;
    }

    // Non connecté, redirection vers la page de connexion
    this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
