import { Component } from '@angular/core';
import { OrderHttpService } from '../order-http.service';
import { Order } from '../Order';
import { Drink } from '../Drink';
import { SocketioService } from '../socketio.service';
import { Router } from '@angular/router';
import { DrinkHttpService } from '../drink-http.service';

@Component({
  selector: 'app-bartender-page',
  templateUrl: './bartender-page.component.html',
  styleUrls: ['./bartender-page.component.css']
})
export class BartenderPageComponent {
  public orders: Order[] = [];
  public drinks: Drink[] | null = null;
  public countDrinkMap: { [id: string]: { [id: string]: number } } = {};


  constructor(
    private sio: SocketioService,
    public os: OrderHttpService,
    public drs: DrinkHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  public getOrders() {
    this.get_orders();
    this.sio.connect().subscribe((m) => {
      this.get_orders();
    });
  }

  // updates the current order list from the API
  public get_orders() {
    this.os.get_orders().subscribe({
      next: (newData) => {
        // getting only the orders that are of intrest to the bartender 
        this.orders = newData.filter(order => (order.status === 'PREPARING' || order.status === 'DISHES-READY' || order.status === 'IN-QUEUE') && order.drinks.length > 0 );
        // updating drinks count every time an order is added
        this.get_drinks();
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // updates the available drink list from the API 
  public get_drinks() {
    this.drs.get_drinks().subscribe({
      next: (newData) => {
        // saving the list of available drinks in a local array
        this.drinks =  newData
        // counting the times each drinks shows up on the order and mapping the result into a dictionary
        for(let order of this.orders){
          this.countDrinkMap[order._id] = {}
          for(let drink of order.drinks){
            this.countDrinkMap[order._id][drink] = this.countDrinkMap[order._id][drink] ? this.countDrinkMap[order._id][drink] + 1 : 1;
          }
        }
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // informing the system that the drinks for a specific order are ready to be served 
  public markOrderAsReady(order: Order) {
    this.os.set_drinks_ready(order).subscribe({
      next: (updatedOrder) => {
        this.orders = this.orders.filter(o => o._id !== updatedOrder._id);
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  public logout() {
    this.router.navigate(['/login']);
  }
}
