import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface AuthData {
  email: string;
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = new BehaviorSubject(false);
  isLogin = new BehaviorSubject(true);
  userEmail? = new BehaviorSubject('');

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    const userEmail = this.getUserEmail();

    if (!token) return;

    this.isAuthenticated.next(true);

    if (userEmail) {
      this.userEmail?.next(userEmail);
      return;
    }

    this.http
      .get<{ email: string }>(`${environment.apiBaseUrl}/users`, {
        headers: {
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
      })
      .pipe(catchError(this.handleError))
      .subscribe(({ email }) => {
        this.userEmail?.next(email);
        this.setUserEmail(email);
      });
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error('An client side error occured: ', error.error);
    else
      console.error(
        `Server returned code: ${error.status}, body was: `,
        error.error
      );
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthData>(`${environment.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(catchError(this.handleError))
      .subscribe(({ email, access_token, token_type }) =>
        this.loginUser(email, access_token, token_type)
      );
  }

  register(email: string, password: string, passwordRepeat: string) {
    return this.http
      .post<AuthData>(`${environment.apiBaseUrl}/auth/register`, {
        email,
        password,
        passwordRepeat,
      })
      .pipe(catchError(this.handleError))
      .subscribe(({ email, access_token, token_type }) =>
        this.loginUser(email, access_token, token_type)
      );
  }

  logout() {
    this.userEmail?.next('');
    this.isAuthenticated.next(false);
    window.localStorage.removeItem('user_email');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('token_type');
    this.navigateToLogin();
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private loginUser(email: string, access_token: string, token_type: string) {
    this.userEmail?.next(email);
    this.isAuthenticated.next(true);
    window.localStorage.setItem('user_email', email);
    window.localStorage.setItem('access_token', access_token);
    window.localStorage.setItem('token_type', token_type);
    this.navigateToTasks();
  }

  private getUserEmail() {
    return window.localStorage.getItem('user_email');
  }

  private setUserEmail(email: string) {
    window.localStorage.setItem('user_email', email);
  }

  private getToken() {
    const accessToken = window.localStorage.getItem('access_token');
    const tokenType = window.localStorage.getItem('token_type');

    if (accessToken && tokenType)
      return {
        accessToken,
        tokenType,
      };
    return undefined;
  }
}
