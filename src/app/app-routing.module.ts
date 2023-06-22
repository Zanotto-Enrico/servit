import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CashierPageComponent } from './cashier-page/cashier-page.component';
import { CookPageComponent } from './cook-page/cook-page.component';
import { WaiterPageComponent } from './waiter-page/waiter-page.component';
import { BartenderPageComponent } from './bartender-page/bartender-page.component';
import { NewOrderPageComponent } from './new-order-page/new-order-page.component';
import { TableStatusComponent } from './table-status/table-status.component';
import { BillCalculatorComponent } from './bill-calculator/bill-calculator.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cashier-page', component: CashierPageComponent },
  { path: 'cook-page', component: CookPageComponent },
  { path: 'waiter-page', component: WaiterPageComponent },
  { path: 'bartender-page', component: BartenderPageComponent },
  { path: 'new-order-page', component: NewOrderPageComponent },
  { path: 'tables-status', component: TableStatusComponent },
  { path: 'bill-calculator', component: BillCalculatorComponent },
  { path: 'profile-page', component: ProfileComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
