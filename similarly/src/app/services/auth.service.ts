import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/User';
import { BehaviorSubject, catchError, first, Observable, tap } from "rxjs";
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/users';

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, 'id'> | undefined

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'} ),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) { }

  signup(user: Omit<User, 'id'>): Observable<User>{
    return this.http.post<User>(`${this.authUrl}/signup`, user, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>('signup'))
    );
  }

  login(email: Pick<User, 'email'>, password: Pick<User, 'password'>): Observable<{
    token: string; userId: Pick<User, 'id'>
  }>{
    return this.http
      .post<any>(`${this.authUrl}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string; userId: Pick<User, 'id'> }) => {
          this.userId = tokenObject.userId;
          localStorage.setItem('token', tokenObject.token);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(['app-play'])
        }),
        catchError(this.errorHandlerService.handleError<{
          token: string; userId: Pick<User, 'id'>
        }>('login')));
  }
}
