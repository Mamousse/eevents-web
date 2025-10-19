import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, TimeoutError } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

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
  // Configuration automatique selon l'environnement
  // Pour basculer entre local et Railway, modifiez le fichier src/environments/environment.ts
  private baseurl = environment.apiUrl;

  private apiUrl = this.baseurl + '/auth';
  private usersApiUrl = this.baseurl + '/users';
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
        timeout(15000), // Timeout de 15 secondes
        catchError((error: HttpErrorResponse | TimeoutError) => {
          let errorMessage = 'Une erreur est survenue lors de l\'inscription';

          if (error instanceof TimeoutError) {
            errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion ou réessayez plus tard.';
          } else if (error.status === 0) {
            errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
          } else if (error.error?.error?.message) {
            errorMessage = error.error.error.message;
          }

          console.error('Erreur d\'inscription:', error);
          return throwError(() => ({ error: { error: { message: errorMessage } } }));
        })
      );
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log("login oiviosvffs ", this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials))
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        timeout(15000), // Timeout de 15 secondes
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError((error: HttpErrorResponse | TimeoutError) => {
          let errorMessage = 'Une erreur est survenue lors de la connexion';

          if (error instanceof TimeoutError) {
            errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion ou réessayez plus tard.';
          } else if (error.status === 0) {
            errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
          } else if (error.status === 401) {
            errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
          } else if (error.error?.error?.message) {
            errorMessage = error.error.error.message;
          }

          console.error('Erreur de connexion:', error);
          return throwError(() => ({ error: { error: { message: errorMessage } } }));
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
