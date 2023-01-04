import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Login, LoginResponse } from '../interface/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storage: Storage = sessionStorage;

  constructor() {}

  login(payload: Login): Observable<LoginResponse | null> {
    return new Observable<LoginResponse | null>(
      (observer: Observer<LoginResponse | null>) => {
        try {
          const { username, password } = payload;
          if (username === 'rafi' && password === '') {
            const loginResponse: LoginResponse = {
              username: username,
              accessToken: '123',
            };
            this.storage.setItem('token', JSON.stringify(loginResponse));
            observer.next(loginResponse);
          } else {
            observer.next(null);
          }
        } catch (error: any) {
          observer.error(error.message);
        }
      }
    );
  }
}
