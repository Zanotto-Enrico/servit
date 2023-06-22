import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserHttpService } from './user-http.service';
import { SignupComponent } from './signup/signup.component';
import { CashierPageComponent } from './cashier-page/cashier-page.component';
import { CookPageComponent } from './cook-page/cook-page.component';
import { BartenderPageComponent } from './bartender-page/bartender-page.component';
import { WaiterPageComponent } from './waiter-page/waiter-page.component';
import { SocketioService } from './socketio.service';
import { OrderHttpService } from './order-http.service';
import { DrinkHttpService } from './drink-http.service';
import { DishHttpService } from './dish-http.service';
import { NewOrderPageComponent } from './new-order-page/new-order-page.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { TableStatusComponent } from './table-status/table-status.component';
import { BillCalculatorComponent } from './bill-calculator/bill-calculator.component';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { RemoveWaiterComponent } from './remove-waiter/remove-waiter.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CashierPageComponent,
    CookPageComponent,
    BartenderPageComponent,
    WaiterPageComponent,
    NewOrderPageComponent,
    AppHeaderComponent,
    TableStatusComponent,
    BillCalculatorComponent,
    ProfileComponent,
    StatisticsComponent,
    RemoveWaiterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{provide: UserHttpService, useClass: UserHttpService },
              {provide: SocketioService, useClass: SocketioService },
              {provide: OrderHttpService, useClass: OrderHttpService},
              {provide: DrinkHttpService, useClass: DrinkHttpService},
              {provide: DishHttpService, useClass: DishHttpService},],
  bootstrap: [AppComponent]
})
export class AppModule { }
