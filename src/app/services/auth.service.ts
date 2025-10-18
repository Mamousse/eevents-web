import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // À modifier selon votre backend
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
    //   .pipe(
    //     tap(response => {
    //       localStorage.setItem('currentUser', JSON.stringify(response.user));
    //       localStorage.setItem('token', response.token);
    //       this.currentUserSubject.next(response.user);
    //     })
    //   );

    // Simulation pour la démo (à remplacer par l'API réelle)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        username: 'admin',
        email: 'admin@events.com',
        role: 'admin',
        createdAt: new Date()
      };
      const response: AuthResponse = {
        token: 'fake-jwt-token-' + Date.now(),
        user
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(user);
      return of(response);
    }
    throw new Error('Identifiants invalides');
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  // Obtenir le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
