import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, switchMap, tap, timer } from 'rxjs';
import { Message } from '../models/message';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  selectedUser = (localStorage.getItem('receiverId'));
  // currentUser = +(localStorage.getItem('user_id')!)
  currentUser = { id: this.authService.getUserId()! };


  private bddUrl = 'http://localhost:3000/messages'


  constructor(private http: HttpClient, private authService: AuthService, private messageService: MessageService) { }



  private lastMessageId = 0;
  private pollingInterval = 5000; // 5sec


  startPolling(currentUserId: number, receiverUserId: number) {
    return timer(0, this.pollingInterval).pipe(
      switchMap(() => this.getNewMessages()), // Recup du dernier message
      tap((messages: Message) => {
        // si nvo msg maj son id 
        if (messages) {
          this.lastMessageId = messages.id;
          // setInterval(this.startPolling, 5000)
        }
      })
    );

  }


  getNewMessages(): Observable<Message> {
    return this.http.get<Message>(`${this.bddUrl}/new/${this.lastMessageId}`, { headers: this.getHeaders() }
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }


  getUserChats(senderId: number, receiverId: number): Observable<Message[]> {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.bddUrl}/conversation/${senderId}/${receiverId}`, { headers }).pipe(
      tap((messages: Message[]) => {
        this.lastMessageId = messages[messages.length - 1].id
        console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',this.lastMessageId);

      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/users`);
  }

  //jai tout essayer pour la mise en page l'équipe vraiment désolé



}
