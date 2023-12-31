import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private lastMessageId = 0;
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  sendMessage(content: string, senderId:number, receiverId: number) {
    const headers = this.getHeaders();
    const body = { content, senderId ,receiverId };
    return this.http.post<Message>(`${this.BASE_URL}/messages`, body, { headers });
  }

  getMessagesBetweenUsers(user1Id: number, user2Id: number) {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.BASE_URL}/messages/conversation/${user1Id}/${user2Id}`, {headers});
  }

  getUserChats(senderId: number, receiverId: number): Observable<Message[]> {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.BASE_URL}/messages/conversation/${senderId}/${receiverId}`, { headers }).pipe(
      tap((messages: Message[]) => {
        this.lastMessageId = messages[messages.length - 1].id
        console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', this.lastMessageId);

      })
    );
  }


}
