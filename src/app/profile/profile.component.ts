import { Component, OnInit } from '@angular/core';
import { UserHttpService, User } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: User = {_id : "", username : "", password : "", assignedTables: [],  mail : "", role : ""}; // Tipo dati dell'utente da definire

  constructor(private us: UserHttpService,  private router: Router) {}

  ngOnInit() {
    this.getUserInfo();
  }

  private getUserInfo() {

    this.user.username = this.us.get_username();
    this.user.mail = this.us.get_mail();
    this.user.role = this.us.get_role();
    if(this.us.is_waiter())
      this.user.assignedTables = this.us.get_tables()
    else
      this.user.assignedTables = []

  }
  goBack() {
    if(this.us.is_cashier())
    this.router.navigate(['/cashier-page']);
    if(this.us.is_waiter())
      this.router.navigate(['/waiter-page']);
    if(this.us.is_cook())
      this.router.navigate(['/cook-page']);
    if(this.us.is_bartender())
      this.router.navigate(['/bartender-page']);
  }
  logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}