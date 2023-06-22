import { Component } from '@angular/core';
import { User } from '../user-http.service';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remove-waiter',
  templateUrl: './remove-waiter.component.html',
  styleUrls: ['./remove-waiter.component.css']
})
export class RemoveWaiterComponent {
  public selectedWaiter: User | null = null;
  public waiters: User[] = [];

  constructor(
    private us: UserHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getWaiters();
  }

  private getWaiters() {
    this.us.get_waiters().subscribe({
      next: (waiters) => {
        this.waiters = waiters;
      },
      error: (err) => {
        console.error('Failed to retrieve waiters:', err);
        this.logout();
      }
    });
  }

  public removeWaiter() {
    if (this.selectedWaiter) {
      const confirmation = confirm('Are you sure you want to remove this waiter?');
      if (confirmation) {/*
        this.us.removeWaiter(this.selectedWaiter._id).subscribe({
          next: () => {
            this.getWaiters();
            this.selectedWaiter = null;
            console.log('Waiter removed!');
          },
          error: (err) => {
            console.error('Failed to remove waiter:', err);
            this.logout();
          }
        });*/
      }
    }
  }

  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}
