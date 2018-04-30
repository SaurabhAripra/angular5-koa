import {Injectable} from '@angular/core';

@Injectable()
export class LoginService {

  constructor() {
  }

  authenticate(email: String, password: String): boolean {
    console.log('email is ', email);
    console.log('password is ', password);
    return true;
  }
}
