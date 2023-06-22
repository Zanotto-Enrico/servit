import { Injectable } from '@angular/core';
import { Order } from './Order';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UserHttpService } from './user-http.service';


@Injectable()
export class OrderHttpService {

  private orders = [];

  constructor( private http: HttpClient, private us: UserHttpService ) {
    console.log('Order service instantiated');
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

  get_orders(params = {}): Observable<Order[]> {
    return this.http.get<Order[]>( this.us.url + '/orders', this.create_options(params) ).pipe(
        tap( (data) => console.log(JSON.stringify(data))) ,
        catchError( this.handleError )
      );
  }

  post_order( m: Partial<Order> ): Observable<Order> {
    console.log('Posting ' + JSON.stringify(m) );
    return this.http.post<Order>( this.us.url + '/orders', m,  this.create_options() ).pipe(
      catchError(this.handleError)
    );
  }

  delete_order( m: Order ): Observable<Order> {
    console.log('Deliting ' + JSON.stringify(m) );
    return this.http.delete<Order>( this.us.url + '/orders/'+m._id, this.create_options() ).pipe(
      catchError(this.handleError)
    );
  }

  update_order_status( m: Order ): Observable<Order> {
    console.log('Updating status of ' + JSON.stringify(m) );
    return this.http.put<Order>( this.us.url + '/orders/'+m._id+"/status", {status: m.status} , this.create_options() ).pipe(
      catchError(this.handleError)
    );
  }

  set_dishes_ready( m: Order ): Observable<Order> {
    if(m.status === "PREPARING")
      m.status = "DISHES-READY";
    if(m.status === "DRINKS-READY" || m.drinks.length == 0)
      m.status = "READY";
    return this.update_order_status(m)
  }

  set_drinks_ready( m: Order ): Observable<Order> {
    if(m.status === "PREPARING" || m.status === "IN-QUEUE")
      m.status = "DRINKS-READY";
    if(m.status === "DISHES-READY" || m.dishes.length == 0)
      m.status = "READY";
    return this.update_order_status(m)
  }


}

