import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  constructor(private us: UserHttpService, private router: Router) {}

  logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
  profile() {
    this.router.navigate(['/profile-page']);
  }
}
