import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models/message';
import { ShortMessage } from '../models/short-message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket: any;

  constructor() { 
    this.socket = io('ws://localhost:3000/')
  }


  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: unknown) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  sendMessage(message: ShortMessage) {
    this.socket.emit('sendMessage', message);
  }//////////////

  getMessages() {
    return new Observable<Message>((observer) => {
      this.socket.on('newMessage', (message: Message) => {
        observer.next(message);
      });
    });
  }///////////////

}
