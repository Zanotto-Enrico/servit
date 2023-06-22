import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { OrderHttpService } from '../order-http.service';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.css']
})
export class TableStatusComponent {
  public tables: number[] = [];
  public occupiedTables: number[] = [];
  public selectedTable: number | null = null;
  public selectedTableOrders: number | null = null;
  public selectedTableWaiter: string | null = null;


  constructor(
    private sio: SocketioService,
    private us: UserHttpService,
    private os: OrderHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTables();
    this.getOccupiedTables();
  }

  private getTables() {
    for (let i = 1; i < 101; i++) {
      this.tables.push(i);
    }
  }

  private getOccupiedTables() {
    this.os.get_orders({status: ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (orders) => {
        this.occupiedTables = orders.map(order => order.table);
      },
      error: (err) => {
        console.error('Failed to retrieve occupied tables:', err);
        this.logout()
      }
    });
  }

  public isTableOccupied(table: number): boolean {
    // Logic to check if the table is occupied
    return this.occupiedTables.includes(table);
  }

  public isTableAssigned(table: number): boolean {
    // Logic to check if the table is assigned to the current user
    return this.us.is_table_assigned_to_user(table);
  }

  public openPopup(table: number) {
    this.selectedTable = table;
    this.updateActiveOrderCount(table)
    this.updateAssignedWaiter(table)
  }

  public closePopup() {
    this.selectedTable = null;
  }

  public updateAssignedWaiter(table: number) {
    // Logic to get the username of the assigned waiter for the table
    this.selectedTableWaiter = ""
    this.us.get_table_assignament(table).subscribe({
      next: (waiter) => {
        if(waiter[0])
          this.selectedTableWaiter = waiter[0].username 
      },
      error: (err) => {
        console.error('Failed to retrieve order number for table:', err);
      }
    });
  }

  public updateActiveOrderCount(table: number){
    // Logic to get the number of active orders for the table
    this.selectedTableOrders = 0
      this.os.get_orders({table: table, status: ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (orders) => {
        this.selectedTableOrders = orders.length
      },
      error: (err) => {
        console.error('Failed to retrieve order number for table:', err);
      }
    });
  }
  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}
