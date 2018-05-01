import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginData} from './login-data';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  authenticate(email: String, password: String): Observable<LoginData> {
    console.log('email is ', email);
    console.log('password is ', password);
    console.log('Calling post /api/login');
    return this.http.post<LoginData>('/api/login', new LoginData(email, password)).pipe(
      catchError(this.handleError('login', new LoginData('', '')))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
