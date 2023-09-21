import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private bddUrl = 'http://localhost:3000'
  currentUser!:User;
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<{ access_token: string, user_id: number }>(this.bddUrl + '/auth/login', { username, password })
      .pipe(
        tap(response => {
          // console.log(response)
          localStorage.setItem('access_token', response.access_token);
          if (response.user_id && Number.isFinite(response.user_id)) {
            localStorage.setItem('user_id', `${response.user_id}`);
            console.log('Id utilisateur stocké:', localStorage.getItem('user_id'))
            console.log(typeof response.user_id)
          } else {
            console.error('user_id is either missing or invalid in the response.');
          }
        })
      );
  }


  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');

    if (userId !== null) {
      const parsedId = parseInt(userId, 10);

      if (!isNaN(parsedId)) {
        return parsedId;
      } else {
        console.error('Stored user_id is not a valid number:', userId);
      }
    } else {
      console.error('No user_id found in local storage.');
    }

    return null;
  }

  // getUserById(id: number): Observable<User> {
  //   return this.http.get<User>(`http://localhost:3000/users/${id}`);
  // }





}
