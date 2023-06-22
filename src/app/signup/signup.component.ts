import { Component } from '@angular/core';
import { UserHttpService, User } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  public errmessage: string | null = null;
  public user: Partial<User> = { mail: '', password: '', username: '', role: '', assignedTables : []};
  public passConfirmation : string = ""

  constructor( public us: UserHttpService, public router: Router ) { }

  signup() {

    this.user.role = this.user.role?.toUpperCase()
    if(this.user.password != this.passConfirmation){
      this.errmessage = "Passwords don't match"
      return
    }

    this.us.register( this.user ).subscribe( {
      next: (d) => {
      console.log('Registration ok: ' + JSON.stringify(d) );
      this.errmessage = null;
      this.router.navigate(['/login']);
     },
     error: (err) => {
      console.log(' error: ' + JSON.stringify(err.error.errormessage) );
      this.errmessage = "Data format wrong";
    }});

  }

}
