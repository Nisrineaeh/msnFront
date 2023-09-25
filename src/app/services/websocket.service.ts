import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Message } from '../models/message';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
 private socket: Socket;


  constructor() { 
    this.socket = io('ws://localhost:3000/')  
  }


  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }

  getMessages() {
    return new Observable<Message>((observer) => {
      this.socket.on('newMessage', (message: Message) => {
        observer.next(message);
      });

    });
  }

  receiveMessage(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('messageToClient', (message: Message) => {
        observer.next(message);
      });
    });
  }

}
