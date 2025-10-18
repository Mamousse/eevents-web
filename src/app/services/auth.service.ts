import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

export interface RegisterRequest {
  prenom: string;
  nom: string;
  telephone: string;
  username: string;
  password: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'eevents-api-production.up.railway.app/auth'
  //'http://localhost:3000/auth';
  private usersApiUrl = 'eevents-api-production.up.railway.app/users';
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

  // Inscription
  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Créer un admin (première fois seulement)
  createAdmin(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create-admin`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
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

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiUrl);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersApiUrl}/${id}`);
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, userData: Partial<User>): Observable<void> {
    return this.http.patch<void>(`${this.usersApiUrl}/${id}`, userData);
  }

  // Mettre à jour le rôle d'un utilisateur
  updateUserRole(id: string, role: string): Observable<void> {
    return this.http.patch<void>(`${this.usersApiUrl}/${id}/role`, { role });
  }

  // Changer le mot de passe
  changePassword(id: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.usersApiUrl}/${id}/password`, {
      currentPassword,
      newPassword
    });
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.usersApiUrl}/${id}`);
  }
}
