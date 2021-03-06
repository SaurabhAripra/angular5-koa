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

  ngOnInit() {}

  onSubmit() {
    console.log('LoginComponent-> on submit called');
    this.loginService.authenticate(this.model.email, this.model.password).subscribe();
    this.submitted = true;
  }

}
