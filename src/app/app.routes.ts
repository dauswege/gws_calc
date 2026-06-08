import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component')
        .then(m => m.ProductsComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component')
        .then(m => m.CartComponent)
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];
