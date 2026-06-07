import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="card" (click)="select.emit(product())">
      <b>{{ product().name }}</b>
    </div>
  `,
  styles: [`
    .card {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .card:hover {
      background: #f5f5f5;
    }
  `]
})
export class ProductCardComponent {
  product = input<any>();
  select = output<any>();
}
