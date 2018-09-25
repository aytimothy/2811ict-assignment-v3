import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_username: any;
  login_password: any;
  login_remember: any;

  register_username: any;
  register_password: any;
  register_password2: any;
  register_agree: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const dom = document.getElementById('login-dialog-alert');
    dom.classList.add('hidden');
    dom.innerHTML = 'This dialog should not be visible.';
  }

  show(dialog) {
    if (dialog === 'login') {
      document.getElementById('register-panel').classList.add('hidden');
      document.getElementById('overlay').classList.add('hidden');
      document.getElementById('login-dialog-alert').classList.add('hidden');
      this.login_username = '';
      this.login_password = '';
      this.login_remember = false;

    }
    if (dialog === 'register') {
      document.getElementById('register-panel').classList.remove('hidden');
      document.getElementById('overlay').classList.remove('hidden');
      document.getElementById('register-dialog-alert').classList.add('hidden');
      this.register_username = '';
      this.register_password = '';
      this.register_password2 = '';
      this.register_agree = false;
    }
  }

  login() {
    const dom = document.getElementById('login-dialog-alert');
    const request = this.http.post('http://localhost:3000/get_user', { username: this.login_username }, httpHeader);
    if (this.login_username === '' || this.login_password === '' || this.login_username == null || this.login_password == null || this.login_username === undefined || this.login_password === undefined) {
      dom.classList.remove('hidden');
      dom.innerHTML = 'Please enter a username and password.';
      return;
    }

    request.subscribe((data: any) => {
      if (data.length === 0) {
        dom.classList.remove('hidden');
        dom.innerHTML = 'Please register first.';
        return;
      }

      if (data[0].password !== this.login_password) {
        dom.classList.remove('hidden');
        dom.innerHTML = 'Incorrect password. Please try again.';
        return;
      }

      window.localStorage.setItem('username', data[0].username)
      this.router.navigateByUrl('/chat');
    });
  }

  register() {
    const dom = document.getElementById('register-dialog-alert');
    if (this.register_username == null || this.register_password == null || this.register_password2 == null || this.register_username === undefined || this.register_password === undefined || this.register_password2 === undefined || this.register_username === '' || this.register_password === '' || this.register_password2 === '') {
      dom.classList.remove('hidden');
      dom.innerHTML = 'Please fill in the form below.';
      return;
    }

    if (this.register_agree === false) {
      dom.classList.remove('hidden');
      dom.innerHTML = 'Please agree to nothing.';
      return;
    }

    const checkRequest = this.http.post('http://localhost:3000/get_user', { username: this.register_username }, httpHeader);
    checkRequest.subscribe((data: any) => {
      if (data.length > 0) {
        dom.classList.remove('hidden');
        dom.innerHTML = 'User already exists.';
        return;
      }

      const request = this.http.post('http://localhost:3000/add_user', { username: this.register_username, password: this.register_password, avatar: '' }, httpHeader);
      request.subscribe((data: any) => {
        if (data === false) {
          dom.classList.remove('hidden');
          dom.innerHTML = 'Serer Error: Cannot create user.';
          return;
        }

        dom.classList.remove('hidden');
        dom.innerHTML = 'User successfully created. You may now login.';
      });
    });
  }
}

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
