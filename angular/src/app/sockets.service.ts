import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketsService {
  private url = 'http://localhost:3000';
  private socket = null;

  constructor() {
  }

  sendMessage(event, message) {
    if (this.socket == null) {
      this.socket = io(this.url);
    }

    // console.log(this.socket);
    this.socket.emit(event, message);
  }

  getMessages(event) {
    if (this.socket == null) {
      this.socket = io(this.url);
    }

    const observable = new Observable(observer => {
      this.socket.on(event, (data) => {
        this.socket.connect();
        console.log('Received message from Websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    // We return our observable
    return observable;
  }
}
