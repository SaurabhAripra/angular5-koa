import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';
import {LoginData} from '../login-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  model = new LoginData('', '');
  submitted = false

  ngOnInit() {

  }

  onSubmit() {
    console.log('LoginComponent-> on submit called');
    this.submitted = true;

  }

  get diagnostic() { return JSON.stringify(this.model); }

}
