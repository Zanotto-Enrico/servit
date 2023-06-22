import { Component } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { OrderHttpService } from '../order-http.service';
import { DishHttpService } from '../dish-http.service';
import { DrinkHttpService } from '../drink-http.service';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';
import { Order } from '../Order';
import { Dish } from '../Dish';
import { Drink } from '../Drink';

@Component({
  selector: 'app-waiter-page',
  templateUrl: './waiter-page.component.html',
  styleUrls: ['./waiter-page.component.css']
})
export class WaiterPageComponent {
  public orders: Order[] = [];
  public dishes: Dish[] = [];
  public drinks: Drink[] = [];
  public selectedOrder: Order | null = null;
  public selectedDishes: Dish[] = [];
  public selectedDrinks: Drink[] = [];
  private orderOfImportance = ['READY', 'DISHES-READY', 'DRINKS-READY', 'PREPARING','IN-QUEUE', 'SERVED'];

  constructor(
    private sio: SocketioService,
    public os: OrderHttpService,
    public drs: DrinkHttpService,
    public dis: DishHttpService,
    public us: UserHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.update_data();
    this.sio.connect().subscribe((m) => {
      this.update_data();
    });
  }

  public update_data() {
    this.os.get_orders({status: ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (newData) => {
        // keeping only the orders made by the current waiter using the app
        this.orders = newData.filter(order => this.us.is_table_assigned_to_user(order.table) || order.status === "SERVED");
        // ordering the orders by their state with a lambda functions that confronts them based
        // on the position of their status in the array orderOfImportance
        this.orders = this.orders.sort((a, b) => {return this.orderOfImportance.indexOf(a.status) - this.orderOfImportance.indexOf(b.status);});
      },
      error: (err) => {
        this.logout();
      }
    });

    //updating the available drinks 
    this.drs.get_drinks().subscribe({
      next: (newData) => {
        this.drinks = newData;
      },
      error: (err) => {
        this.logout();
      }
    });

    // updating the available dishes 
    this.dis.get_dishes().subscribe({
      next: (newData) => {
        this.dishes = newData;
      },
      error: (err) => {
        this.logout();
      }
    })
  }

  public deleteOrder(order: Order) {
    this.os.delete_order(order).subscribe({
      next: (deletedOrder) => {
        this.orders = this.orders.filter((o) => o._id !== deletedOrder._id);
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  public serveOrder(order: Order) {
    order.status = "SERVED"
    this.os.update_order_status(order).subscribe({
      next: () => {
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  public showOrderInfo(order: Order) {
    this.selectedOrder = order;
    this.selectedDishes = this.dishes.filter(dish => order.dishes.includes(dish._id));
    this.selectedDrinks = this.drinks.filter(drink => order.drinks.includes(drink._id));
  }

  public closePopup() {
    this.selectedOrder = null;
  }

  public tables() {
    this.router.navigate(['/tables-status']);
  }

  public addOrder(){
    this.router.navigate(['/new-order-page']);
  }
    
  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}
