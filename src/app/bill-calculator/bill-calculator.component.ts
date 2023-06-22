import { Component, OnInit } from '@angular/core';
import { OrderHttpService } from '../order-http.service';
import { Order } from '../Order';
import { Drink } from '../Drink';
import { Dish } from '../Dish';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';
import { DrinkHttpService } from '../drink-http.service';
import { DishHttpService } from '../dish-http.service';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-bill-calculator',
  templateUrl: './bill-calculator.component.html',
  styleUrls: ['./bill-calculator.component.css']
})
export class BillCalculatorComponent implements OnInit {
  public selectedTable: number = 0;
  public tableOptions: number[] = [];
  public orders: Order[] = [];
  public drinks: Drink[] = [];
  public dishes: Dish[] = [];
  public total: number = 0;
  public checkout: boolean = false;

  constructor(
    private sio: SocketioService,
    private os: OrderHttpService,
    public drs: DrinkHttpService,
    public dis: DishHttpService,
    public us: UserHttpService,
    private router: Router) {}

  ngOnInit() {
    this.populateTableOptions();
    this.updateDishes();
    this.updateDrinks();
    this.sio.connect().subscribe(() => {
      this.updateDishes();
    });
    this.sio.connect().subscribe(() => {
      this.updateDrinks();
    });

  }

  public calculateBill() {
    this.os.get_orders({table: this.selectedTable, status: ["IN-QUEUE", "READY", "DISHES-READY", "DRINKS-READY","SERVED", "PREPARING" ]}).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.total = this.calculateTotal();
      },
      error: (err) => {
        console.error('Failed to retrieve orders:', err);
        this.logout()
      }
    });

  }

  private updateDishes(){
    this.dis.get_dishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes
      },
      error: (err) => {
        console.error('Failed to retrieve dishes:', err);
        this.logout()
      }
    });
  }

  private updateDrinks(){
    this.drs.get_drinks().subscribe({
      next: (drinks) => {
        this.drinks = drinks
      },
      error: (err) => {
        console.error('Failed to retrieve dishes:', err);
        this.logout()
      }
    });
  }

  private populateTableOptions() {
    for (let i = 1; i <= 100; i++) {
      this.tableOptions.push(i);
    }
  }

  private calculateTotal(): number {
    let sum = 0;
    for (let order of this.orders) {
      sum += this.calculateSingleOrderCost(order)
    }
    return sum;
  }

  public countOccurences(things: string[], thing: Dish | Drink){
    return things.reduce((acc, currentValue) => { if (currentValue === thing._id) acc++; return acc; }, 0)
  }

  calculateSingleOrderCost(order: Order): number{
    var total : number = 0;
    console.log("total: " + total)
    for (let drink of this.drinks) {
      total +=  order.drinks.includes(drink._id) ? drink.price*order.drinks.reduce((acc, currentValue) => {
        if (currentValue === drink._id) acc++;
        return acc;
      }, 0) : 0;
    }
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

  public closePopup()
  {
    this.checkout=false
    for(let order of this.orders){
      order.status = "PAID"
      this.os.update_order_status(order).subscribe({
        next: () => {
          this.us.get_table_assignament(this.selectedTable).subscribe({
            next: (waiter) => {
              this.us.remove_assigned_table(waiter[0]._id, this.selectedTable).subscribe({   
                next: (waiter) => {
                  this.us.update_assigned_tables()
                  this.selectedTable = 0;
                  this.orders = [];
                  console.log('Bill confirmed!');
                },
                error: (err) => {
                  console.error('Failed to free the waiter:', err);
                  this.logout()
                }
              });
            },
            error: (err) => {
              console.error('Failed to free the waiter:', err);
              this.logout()
            }
          });
        },
        error: (err) => {
          console.error('Failed to update orders:', err);
          this.logout()
        }
      });
    }
  }

  public confirmBill() {
    this.checkout = true
  }
  
  public logout() {
    this.us.logout();
    this.router.navigate(['/login']);
  }
}



