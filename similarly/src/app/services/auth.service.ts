import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/User';
import {BehaviorSubject, catchError, first, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/auth';

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'} ),
  };

  constructor(private http: HttpClient) { }

  /*login(email: Pick<User, 'email'>, password: Pick<User, 'password'>): Observable<{
    token: string; userId: Pick<User, 'id'>
  }>{
    return this.http
      .post(`${this.authUrl}/login`, { email, password }, this.httpOptions)
      .pipe(first(), tap((tokenObject: { token: string; userId: Pick<User, 'id'>}) => {
        this.userId = tokenObject.userId;
        localStorage.setItem('token', tokenObject.token);
        this.isUserLoggedIn$.next(true);
      }), catchError(this.errorHandlerService.handleError<{
        token: string; userId: Pick<User, 'id'>
      }>('login')));
  }*/
}
