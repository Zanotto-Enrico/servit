import { Component } from '@angular/core';
import { OrderHttpService } from '../order-http.service';
import { Order } from '../Order';
import { Dish } from '../Dish';
import { SocketioService } from '../socketio.service';
import { DishHttpService } from '../dish-http.service';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cook-page',
  templateUrl: './cook-page.component.html',
  styleUrls: ['./cook-page.component.css']
})
export class CookPageComponent {
  public inQueueOrders: Order[] = [];
  public preparingOrder: Order | null = null;
  public preparingDished: Dish[] | null = null;
  public countDishMap: { [id: string]: number } = {};
  public orderAlreadySelected: boolean = false;

  constructor(    
    private sio: SocketioService,
    public os: OrderHttpService,
    public dis: DishHttpService,
    public us: UserHttpService,
    private router: Router) {}

  ngOnInit() {
    this.getOrders();
  }

  public getOrders() {
    this.get_orders();
    this.sio.connect().subscribe((m) => {
      this.get_orders();
    });
  }

  public get_orders(){
    this.os.get_orders().subscribe({
      next: (newData) => {
        this.inQueueOrders = newData.filter(order => (order.status === 'IN-QUEUE' || order.status === 'DRINKS-READY') && order.dishes.length > 0 );
        this.preparingOrder = newData.filter(order => order.status === 'PREPARING' )[0];
        this.setPreparingDished()
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  public markOrderAsReady(order: Order) {
    console.log(order)
    this.os.set_dishes_ready(order).subscribe({
      next: (updatedOrder) => {
        this.preparingOrder = null;
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  public setPreparingDished()
  {
    if (!this.preparingOrder) return;
    this.dis.get_dishes().subscribe({
      next: (newData) => {
        this.preparingOrder?.dishes?.forEach((dishId: string) => {
          this.countDishMap[dishId] = this.countDishMap[dishId] ? this.countDishMap[dishId] + 1 : 1;
        });
        
        // filtering only dishes that appears in selected order
        this.preparingDished = newData.filter((o) => this.countDishMap[o._id] > 0);
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  public prepareOrder(order: Order) {
    // checks if an order has been already selected 
    if (this.preparingOrder) {
      this.orderAlreadySelected = true;
      return;
    }

    // sets the new status of the order 
    order.status = 'PREPARING';
    this.os.update_order_status(order).subscribe({
      next: (updatedOrder) => {
        this.inQueueOrders = this.inQueueOrders.filter(o => o._id !== updatedOrder._id);
        this.preparingOrder = order;
        this.setPreparingDished()
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  public closePopup() {
    this.orderAlreadySelected = false;
  }

  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}
