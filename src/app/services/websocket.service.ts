import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
//import { Socket, io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  private currentChannel: string | null = null;


  constructor(private socket: Socket) {
    //this.socket = io('ws://localhost:3000/')
  }


  listen(eventName: string) {
    console.log("Listen");
    return this.socket.fromEvent(eventName);
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        console.log("-------", data);
        
        subscriber.next(data);
      
      })
    })
  }
  
// .pipe(take(1));
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }


  connectToChannel(channelName: string) {
    if (this.currentChannel) {
      this.emit('leaveRoom', this.currentChannel);
    }

    this.currentChannel = channelName;
    this.emit('joinRoom', this.currentChannel);
  }

  disconnectFromChannel() {
    if (this.currentChannel) {
      this.emit('leaveRoom', this.currentChannel);
      this.currentChannel = null;
    }
  }

}
