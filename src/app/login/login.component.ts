import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public errmessage : string | null = null;
  constructor( private us: UserHttpService, private router: Router  ) { }

  ngOnInit() {
  }

  login(username: string, password: string, remember: boolean) {
    this.us.login(username, password, remember).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        console.log('User service token: ' + this.us.get_token());
        this.errmessage = null;
        if(this.us.is_cashier())
        this.router.navigate(['/cashier-page']);
        if(this.us.is_waiter())
          this.router.navigate(['/waiter-page']);
        if(this.us.is_cook())
          this.router.navigate(['/cook-page']);
        if(this.us.is_bartender())
          this.router.navigate(['/bartender-page']);
      },
      error: (err) => {
        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = "Username or password is incorrect";
      }
    });

  }

}
