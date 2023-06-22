import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UserHttpService } from './user-http.service';
import { Drink } from './Drink';


@Injectable()
export class DrinkHttpService {

  private drinks = [];

  constructor( private http: HttpClient, private us: UserHttpService ) {
    console.log('Drink service instantiated');
    console.log('User service token: ' + us.get_token() );
   }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }

    return throwError(() => new Error('Something bad happened; please try again later.') );
  }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };

  }

  get_drinks(params = {}): Observable<Drink[]> {
    return this.http.get<Drink[]>( this.us.url + '/drinks', this.create_options(params) ).pipe(
        tap( (data) => console.log(JSON.stringify(data))) ,
        catchError( this.handleError )
      );
  }

  post_drink( m: Drink ): Observable<Drink> {
    console.log('Posting ' + JSON.stringify(m) );
    return this.http.post<Drink>( this.us.url + '/drinks', m,  this.create_options() ).pipe(
      catchError(this.handleError)
    );
  }

  delete_drink( m: Drink ): Observable<Drink> {
    console.log('Deliting ' + JSON.stringify(m) );
    return this.http.delete<Drink>( this.us.url + '/drinks/'+m._id, this.create_options() ).pipe(
      catchError(this.handleError)
    );
  }

  serve_drink( m: Drink ) {

  }

}

