import { Component } from '@angular/core';
import {User, UserHttpService} from '../user-http.service'
import { Router } from '@angular/router';
import { OrderHttpService } from '../order-http.service';
import { SocketioService } from '../socketio.service';
import { Drink } from '../Drink';
import { Dish } from '../Dish';
import { DishHttpService } from '../dish-http.service';
import { DrinkHttpService } from '../drink-http.service';
import { Order } from '../Order';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  public waiters : User[] = []                                    // list of waiters registered on the platform
  public waiterOrders : {[id : string]: number} = {}              // dictionary that maps a waiter's id to the number of active orders
  public orderPerStatus : {[status : string]: number} = {}        // dictionary that maps each order status with the number of order with that status
  public drinks : Drink[] = []
  public dishes : Dish[] = []
  public closedOrdersRevenue = 0;
  public openOrdersRevenue = 0;

  constructor(
    private us: UserHttpService,
    private router: Router,
    private os: OrderHttpService,
    private dis: DishHttpService,
    private drs: DrinkHttpService,
    private sio: SocketioService
  ) {}


  ngOnInit() {
    this.update_data();
    // subscribing to the socker io service 
    this.sio.connect().subscribe((m) => {
      this.update_data();
    });
  }

  // calls all the other functions to collect data on the current situation
  private update_data(){
    this.getWaiters()
    this.getDrinks()
    this.getDishes()
    this.calculateClosedOrdersTotal()
    this.calculateOpenOrdersTotal()
    for (let status of ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" , "PAID"])
      this.getNumOfOrders(status);
  }

  // subscribing for the info of all currently registered waiters
  public getWaiters(){
    this.us.get_waiters().subscribe({
      next: (newData) => {
        this.waiters = newData;
        // saving the numner of active orders of every waiter
        for (let waiter of this.waiters)
          this.getWaiterOrders(waiter);
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // subscribing for the info of all available dishes
  public getDishes(){
    this.dis.get_dishes().subscribe({
      next: (newData) => {
        this.dishes = newData;
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // subscribing for the info of all available drinks
  public getDrinks(){
    this.drs.get_drinks().subscribe({
      next: (newData) => {
        this.drinks = newData;
        // saving the numner of active orders of every waiter
        for (let waiter of this.waiters)
          this.getWaiterOrders(waiter);
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // functions that saves in the dictionary the number of existing orders for a given status
  public getNumOfOrders(status: string){
    this.os.get_orders({status: status}).subscribe({
      next: (newData) => {
        this.orderPerStatus[status] = newData.length;
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // function that saves in the dictionary the number of active orders of a specific waiter
  public getWaiterOrders(user: User){
    this.os.get_orders({table: user.assignedTables, status :  ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (newData) => {
        this.waiterOrders[user._id] = newData.length;
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  // calculates the amount of possible Revenue from all orders that are not completed yet
  private calculateOpenOrdersTotal() {

    this.os.get_orders({status: ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (newData) => {
        let sum = 0;
        for (let order of newData) {
          sum += this.calculateSingleOrderCost(order)
        }
        this.openOrdersRevenue = sum;
      },
      error: (err) => {
        this.logout();
      }
    });

  }

  // calculates the amount of Revenue from all closed orders
  private calculateClosedOrdersTotal() {

    this.os.get_orders({status: "PAID"}).subscribe({
      next: (newData) => {
        let sum = 0;
        for (let order of newData) {
          sum += this.calculateSingleOrderCost(order)
        }
        this.closedOrdersRevenue = sum;
      },
      error: (err) => {
        this.logout();
      }
    });

  }


  // sum up the prices of all the products present in a single order
  calculateSingleOrderCost(order: Order): number{
    var total : number = 0;
    console.log("total: " + total)
    // adding up the prices of every ordered drink using a lambda to count the number of occurences
    for (let drink of this.drinks) {
      total +=  order.drinks.includes(drink._id) ? drink.price*order.drinks.reduce((acc, currentValue) => {
        if (currentValue === drink._id) acc++;
        return acc;
      }, 0) : 0;
    }
    // adding up the prices of every ordered dish using a lambda to count the number of occurences
    console.log("total: " + total)
    for (let dish of this.dishes) {
      total +=  order.dishes.includes(dish._id) ? dish.price*order.dishes.reduce((acc, currentValue) => {
        if (currentValue === dish._id) acc++;
        return acc;
      }, 0) : 0;
    }
    console.log("total: " + total)
    return total;
  }


  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}
