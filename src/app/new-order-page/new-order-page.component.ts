import { Component } from '@angular/core';
import { DrinkHttpService } from '../drink-http.service';
import { DishHttpService } from '../dish-http.service';
import { OrderHttpService } from '../order-http.service';
import { Router } from '@angular/router';
import { Order } from '../Order';
import { Dish } from '../Dish';
import { Drink } from '../Drink';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-new-order-page',
  templateUrl: './new-order-page.component.html',
  styleUrls: ['./new-order-page.component.css']
})
export class NewOrderPageComponent {
  public drinks: Drink[] = [];
  public dishes: Dish[] = [];
  public selectedDrink: string = '';
  public selectedDish: string = '';
  public selectedDrinks: SelectedItem[] = [];
  public selectedDishes: SelectedItem[] = [];
  public selectedTable: number = 0; // Default value for selected table
  public tableNumbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  public errorMessage: string | null = null;

  constructor(
    public drs: DrinkHttpService,
    public dis: DishHttpService,
    public os: OrderHttpService,
    public us: UserHttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.drs.get_drinks().subscribe({
      next: (newData) => {
        this.drinks = newData;
      },
      error: (err) => {
        this.logout();
      }
    });
    this.dis.get_dishes().subscribe({
      next: (newData) => {
        this.dishes = newData;
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  public addDrink() {
    if (this.selectedDrink) {
      const existingDrink = this.selectedDrinks.find((item) => item._id === this.selectedDrink);
      if (existingDrink) {
        existingDrink.count++;
      } else {
        const drink = this.drinks.find((item) => item._id === this.selectedDrink);
        if (drink) {
          this.selectedDrinks.push({ _id: drink._id, name: drink.name, price: drink.price, count: 1 });
        }
      }
      this.selectedDrink = '';
    }
  }

  public removeDrink(drinkId: string) {
    const existingDrink = this.selectedDrinks.find((item) => item._id === drinkId);
    if (existingDrink) {
      if (existingDrink.count === 1) {
        this.selectedDrinks = this.selectedDrinks.filter((item) => item._id !== drinkId);
      } else {
        existingDrink.count--;
      }
    }
  }

  public getDrinkCount(drinkId: string): number {
    const existingDrink = this.selectedDrinks.find((item) => item._id === drinkId);
    return existingDrink ? existingDrink.count : 0;
  }

  public addDish() {
    if (this.selectedDish) {
      const existingDish = this.selectedDishes.find((item) => item._id === this.selectedDish);
      if (existingDish) {
        existingDish.count++;
      } else {
        const dish = this.dishes.find((item) => item._id === this.selectedDish);
        if (dish) {
          this.selectedDishes.push({ _id: dish._id, name: dish.name, price: dish.price, count: 1 });
        }
      }
      this.selectedDish = '';
    }
  }

  public removeDish(dishId: string) {
    const existingDish = this.selectedDishes.find((item) => item._id === dishId);
    if (existingDish) {
      if (existingDish.count === 1) {
        this.selectedDishes = this.selectedDishes.filter((item) => item._id !== dishId);
      } else {
        existingDish.count--;
      }
    }
  }

  public getDishCount(dishId: string): number {
    const existingDish = this.selectedDishes.find((item) => item._id === dishId);
    return existingDish ? existingDish.count : 0;
  }

  public confirmOrder() {
    this.selectedTable = parseInt(this.selectedTable.toString(), 10);
    // checks if the table we creating an order from is assigned to the current user
    if(!this.us.is_table_assigned_to_user(this.selectedTable)){
      //if it isn't we try to get it 
      this.us.set_table_assignament(this.selectedTable).subscribe( {
        next: (m) => {
        console.log('Table assigned to the user');
        this.us.add_assigned_tables(this.selectedTable)
      },
      error: (error) => {
        console.log('Table already assigned to another waiter');
        this.errorMessage = "Table already assigned to another waiter"
      }});
    }

    var  order: Partial<Order> = { 
      table: this.selectedTable,
      drinks: this.selectedDrinks.flatMap(({ _id, count }) => Array.from({ length: count }, () => _id)),
      dishes: this.selectedDishes.flatMap(({ _id, count }) => Array.from({ length: count }, () => _id))
    };
    this.os.post_order(order).subscribe( {
      next: (m) => {
      console.log('Order posted');
      this.router.navigate(['/waiter-page']);
      },
      error: (error) => {
        console.log('Error occurred while posting: ' + error);
      }
    });
  }

  public cancelOrder() {
    this.router.navigate(['/waiter-page']);
  }

  public logout() {
    this.router.navigate(['/login']);
  }

  public getTotalPrice(): number {
    let totalPrice = 0;

    for (const drink of this.selectedDrinks) 
      totalPrice += drink.price * this.getDrinkCount(drink._id);

    for (const dish of this.selectedDishes) 
      totalPrice += dish.price * this.getDishCount(dish._id);

    return totalPrice;
  }

  public closePopup() {
    this.errorMessage = null;
  }
}




interface SelectedItem {
  _id: string;
  name: string;
  price: number;
  count: number;
}
