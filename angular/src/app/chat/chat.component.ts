import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UploadService} from '../upload.service';
import {SocketsService} from '../sockets.service';
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private sockets: SocketsService, private upload: UploadService) { }

  socketConnection;
  message_input: any;
  messages = [];
  new_avatar: any;
  new_password: any;
  new_password2: any;
  selectedFile = undefined;

  ngOnInit() {
    // Display logged in username.
    const usernameDOM = document.getElementById('username');
    const username = window.localStorage.getItem('username');
    usernameDOM.innerHTML = 'Logged in as <b>' + username + '</b>';

    // Load up past messages.
    const messageRequest = this.http.post('http://localhost:3000/get_messages', { limit: 10 }, httpHeader);
    messageRequest.subscribe((result: any) => {
      for (let i = result.length - 1; i >= 0 ; i--) { this.messages.push(result[i]); }
      this.refreshMessages();
    });
    document.getElementById('peoples').innerHTML = 'Not Implemented Yet!'
    this.sockets.sendMessage('connect', username);

    // Add the listener for sockets.
    this.connectSockets();
  }

  logout() {
    window.localStorage.removeItem('username');
    this.router.navigateByUrl('');
  }

  show_settings() {
    document.getElementById('overlay').classList.remove('hidden');
  }

  hide_settings() {
    document.getElementById('overlay').classList.add('hidden');
  }

  connectSockets () {
    this.socketConnection = this.sockets.getMessages('on_message').subscribe((message: any) => {
      const messageJSON = JSON.parse(message);
      this.addMessage(messageJSON);
    });
  }

  disconnectSockets () {
    this.socketConnection.unsubscribe();
  }

  send() {
    if (this.message_input === undefined || this.message_input == null || this.message_input === '') {
      return;
    }

    const username = window.localStorage.getItem('username');
    const message_stringified = JSON.stringify({ username: username, message: this.message_input });
    this.sockets.sendMessage('add_message', message_stringified);
  }

  refreshMessages() {
    /*
        <div class="card message-card">
          <div class="card-header">
            <img src="https://via.placeholder.com/512x512">
            Sender
          </div>
          <div class="card-body">
            Body
          </div>
        </div>
     */

    const dom = document.getElementById('messages');
    if (this.messages.length === 0) {
      dom.innerHTML = '<div class="alert-danger">There are no messages to display. Send the first!</div>';
      return;
    }

    dom.innerHTML = '';
    let content = '';
    for (let index = 0; index < this.messages.length; index++) {
      content += '<div class="card message-card"><div class="card-header"><img style="height: 64px" src="' + 'https://via.placeholder.com/256x256' + '">' + this.messages[index].username + '</div><div class="card-body">' + this.messages[index].message + '</div></div>';
    }
    dom.innerHTML = content;
  }

  addMessage(message) {
    const dom = document.getElementById('messages');
    if (this.messages.length === 0) {
      dom.innerHTML = '';
    }

    const userRequest = this.http.post('http://localhost:3000/get_user', { username: message.username }, httpHeader );
    userRequest.subscribe((result: any) => {
      console.log(result[0].avatar);
      if (result[0].avatar == null || result[0].avatar === '' || result[0].avatar === undefined) { result[0].avatar = 'https://via.placeholder.com/256x256'; }
      dom.innerHTML += '<div class="card message-card"><div class="card-header"><img style="height: 64px" src="' + result[0].avatar + '">' + message.username + '</div><div class="card-body">' + message.message + '</div></div>';
    });
    this.messages.push(message);
  }

  update_settings() {
    let avatar = '';
    const username = window.localStorage.getItem('username');
    const password = this.new_password;
    const request = this.http.post('http://localhost:3000/get_user', { username: username }, httpHeader);
    request.subscribe((result: any) => {
      if (this.selectedFile === undefined || this.selectedFile == null || this.selectedFile === '') {
        avatar = result.avatar;
        const updateRequest = this.http.post('http://localhost:3000/set_user', { username: username, password: password, avatar: avatar }, httpHeader);
        updateRequest.subscribe((result: any) => {
          console.log(result);
        });
        return;
      }

      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.upload.upload(fd).subscribe((res: any) => {
        avatar = res.url;
        const updateRequest = this.http.post('http://localhost:3000/set_user', { username: username, password: password, avatar: avatar }, httpHeader);
        updateRequest.subscribe((result: any) => {
          console.log(result);
        });
      });

    });
  }

  onFileSelect($event) {
    this.selectedFile = $event.target.files[0];
  }
}

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
