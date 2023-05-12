import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isLogin: boolean = true;
  userEmail: string = '';

  private userSubscription?: Subscription;
  private isAuthenticatedSubscription?: Subscription;
  private isLoginSubscription?: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSubscription = this.authService.userEmail?.subscribe((email) => {
      this.userEmail = email;
    });

    this.isAuthenticatedSubscription =
      this.authService.isAuthenticated.subscribe(
        (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
      );

    this.isLoginSubscription = this.authService.isLogin.subscribe(
      (isLogin) => (this.isLogin = isLogin)
    );
  }

  navigateToRegister() {
    this.authService.isLogin.next(false);
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.authService.isLogin.next(true);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.isAuthenticatedSubscription?.unsubscribe;
    this.isLoginSubscription?.unsubscribe();
  }
}
