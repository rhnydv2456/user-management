import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private timerToken: any;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getToken() {
    console.log(this.token)
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStateListener() {
    return this.authStatusListener.asObservable();
  }
  // createUser(email: string, password: string) {
  //   const authData: AuthData = {
  //     email: email,
  //     password: password
  //   };
  //   this.httpClient.post('http://localhost:3000/api/auth/signup', authData)
  //     .subscribe(result => {
  //       console.log(result);
  //     });
  // }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn = authInformation.expiretionDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }
  setAuthTimer(duration: number) {
    this.timerToken = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  login(user: { email: string, password: string }) {

    this.httpClient.post<{ token: string, expiresIn: number }>('http://localhost:5000/api/auth', user)
      .subscribe(result => {
        console.log(result)
        this.token = result.token;
        if (result.token) {
          const expiresInDuration = result.expiresIn;
          this.setAuthTimer(expiresInDuration);
          const date = new Date();
          const expirationDate = new Date(date.getTime() + expiresInDuration * 3600)
          this.saveAuthData(this.token, expirationDate);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
        console.log(result);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    clearTimeout(this.timerToken);
    this.clearAuthData();
  }

  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expiretionDate: new Date(expirationDate)
    }
  }
}
