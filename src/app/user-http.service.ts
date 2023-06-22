import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";


interface TokenData {
  username:string,
  mail:string,
  role:string,
  id:string
  assignedTables:number[]
}

interface ReceivedToken {
  token: string
}


export interface User { 
  _id: string,
  password:string,
  mail:string,
  username:string,
  role:string,
  assignedTables:number[]
};

@Injectable()
export class UserHttpService {

  private token: string = '';
  private assignedTables: number[] = [];
  public url = 'http://192.168.1.201:8080';

  constructor( private http: HttpClient ) {
    console.log('User service instantiated');
    
    const loadedtoken = localStorage.getItem('postmessages_token');
    if ( !loadedtoken || loadedtoken.length < 1 ) {
      console.log("No token found in local storage");
      this.token = ""
    } else {
      this.token = loadedtoken as string;
      console.log("JWT loaded from local storage.")
    }
  }

  login( username: string, password: string, remember: boolean ): Observable<any> {

    console.log('Login: ' + username + ' ' + password );
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( username + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get( this.url + '/login',  options, ).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data));
        this.token = (data as ReceivedToken).token;
        this.assignedTables = (jwt_decode(this.token) as TokenData).assignedTables;
        if ( remember ) {
          localStorage.setItem('postmessages_token', this.token as string);
          this.update_assigned_tables()
        }
      }));
  }

  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('postmessages_token', this.token);
  }

  register( user:Partial<User> ): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    };

    return this.http.post( this.url + '/users', user, options ).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    );

  }

  get_waiters() : Observable<User[]> {
    return this.http.get<User[]>( this.url + '/waiters',this.create_options()).pipe(
        catchError( this.handleError )
      );
  }

  get_token() {
    return this.token;
  }

  get_role() {
    return (jwt_decode(this.token) as TokenData).role;
  }


  get_username() {
    return (jwt_decode(this.token) as TokenData).username;
  }

  get_tables() {
    return this.assignedTables;
  }

  get_mail() {
    return (jwt_decode(this.token) as TokenData).mail;
  }

  get_id() {
    return (jwt_decode(this.token) as TokenData).id;
  }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };

  }

  public add_assigned_tables(tableNumber: number){
    this.assignedTables.push(tableNumber)
  }

  public update_assigned_tables()
  {
    if(!this.is_waiter()) return;
    this.http.get<User[]>( this.url + '/waiters/'+(jwt_decode(this.token) as TokenData).id, this.create_options()).pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    ).subscribe( {
      next: ( m) => {
        this.assignedTables = m[0].assignedTables;
        console.log(this.assignedTables)
    },
    error: (error) => {
      console.log(error);
    }});
    return
  }

  is_table_assigned_to_user(table: number): boolean {

    return this.assignedTables.includes(table)
  }

  public remove_assigned_table(waiterId: string, table: number){
    console.log('/waiters/'+waiterId+"/tables/"+table)
    return this.http.delete<{}>( this.url + '/waiters/'+waiterId+"/tables/"+table,this.create_options()).pipe(
      catchError( this.handleError )
    );
  }
 

  set_table_assignament (table: number) : Observable<{}> {
    return this.http.put<{}>( this.url + '/waiters/'+this.get_id()+"/tables/"+table,{},this.create_options()).pipe(
        catchError( this.handleError )
      );
  }

  get_table_assignament(table: number) : Observable<User[]> {
    return this.http.get<User[]>( this.url + '/waiters',this.create_options({table: table})).pipe(
        catchError( this.handleError )
      );
  }

  is_waiter(): boolean {
    const role = (jwt_decode(this.token) as TokenData).role;
    if ( role === 'WAITER' )
      return true;
    return false;
  }

  is_cook(): boolean {
    const role = (jwt_decode(this.token) as TokenData).role;
    if ( role === 'COOK' )
      return true;
    return false;
  }

  is_cashier(): boolean {
    const role = (jwt_decode(this.token) as TokenData).role;
    if ( role === 'CASHIER' )
      return true;
    return false;
  }

  is_bartender(): boolean {
    const role = (jwt_decode(this.token) as TokenData).role;
    if ( role === 'BARTENDER' )
      return true;
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }
    return throwError(() => new Error('Something bad happened; please try again later.') );
  }
}
