import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { MOCK_USERS } from '../mock/users.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly STORAGE_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'authToken';
  private readonly API_URL = 'https://web-finalproject-ub2x.onrender.com';

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.checkStoredUser();
  }

  // Check if user is stored in localStorage
  private checkStoredUser(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  // Login with email and password
  login(credentials: LoginCredentials): Observable<User> {
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, requestBody)
      .pipe(
        map((response: AuthResponse) => {
          // Token'ı sakla
          localStorage.setItem(this.TOKEN_KEY, response.token);
          
          // User bilgilerini normalize et
          const user: User = {
            ...response.user,
            firstName: response.user.name?.split(' ')[0] || '',
            lastName: response.user.name?.split(' ').slice(1).join(' ') || '',
            photoUrl: response.user.photo_url,
            registrationDate: new Date().toISOString().split('T')[0],
            isActive: true
          };
          
          this.setCurrentUser(user);
          return user;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          let errorMessage = 'Giriş sırasında bir hata oluştu';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Geçersiz email veya şifre';
          } else if (error.status === 400) {
            errorMessage = 'Geçersiz giriş bilgileri';
          } else if (error.status === 404) {
            errorMessage = 'Kullanıcı bulunamadı';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Google login simulation
  loginWithGoogle(): Observable<User> {
    const googleUser = MOCK_USERS.find(u => u.id === 'google-user-1');
    
    if (googleUser) {
      const userWithoutPassword = { ...googleUser, password: '' };
      this.setCurrentUser(userWithoutPassword);
      return of(userWithoutPassword).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Google login failed')).pipe(delay(1000));
    }
  }

  // Register new user
  register(userData: RegisterData): Observable<User> {
    // API için request body hazırla
    const requestBody = {
      email: userData.email,
      password: userData.password,
      name: userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}` 
        : userData.name || '',
      country: userData.country,
      city: userData.city,
      photo_url: userData.photoUrl || userData.photo_url || ''
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, requestBody)
      .pipe(
        map((response: AuthResponse) => {
          // Token'ı sakla
          localStorage.setItem(this.TOKEN_KEY, response.token);
          
          // User bilgilerini normalize et
          const user: User = {
            ...response.user,
            firstName: response.user.name?.split(' ')[0] || '',
            lastName: response.user.name?.split(' ').slice(1).join(' ') || '',
            photoUrl: response.user.photo_url,
            registrationDate: new Date().toISOString().split('T')[0],
            isActive: true
          };
          
          this.setCurrentUser(user);
          return user;
        }),
        catchError((error) => {
          console.error('Register error:', error);
          let errorMessage = 'Kayıt sırasında bir hata oluştu';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Geçersiz kullanıcı bilgileri';
          } else if (error.status === 409) {
            errorMessage = 'Bu email adresi zaten kullanımda';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Set current user and store in localStorage
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove token
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Validate password requirements
  private validatePassword(password: string): boolean {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return minLength && hasNumber && hasSpecialChar;
  }

  // Get user by ID
  getUserById(id: string): Observable<User | undefined> {
    const user = MOCK_USERS.find(u => u.id === id);
    return of(user).pipe(delay(300));
  }

  // Update user profile
  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış'));
    }

    // Find and update user in mock data
    const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      const updatedUser = { ...MOCK_USERS[userIndex], ...userData };
      MOCK_USERS[userIndex] = updatedUser;
      
      const userWithoutPassword = { ...updatedUser, password: '' };
      this.setCurrentUser(userWithoutPassword);
      
      return of(userWithoutPassword).pipe(delay(500));
    }

    return throwError(() => new Error('Kullanıcı bulunamadı'));
  }
}
