import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderSwitcherComponent } from './features/orders/order-switcher.component';

@Component({
  selector: 'app-root',
  imports: [OrderSwitcherComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gws_calc');
}
