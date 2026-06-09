import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Product } from '../models/product';
import { PRODUCTS } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private readonly PRODUCT_KEY = 'products';
  private readonly PRODUCT_URL = 'https://raw.githubusercontent.com/dauswege/gws_calc/refs/heads/main/data/pricelist_sommerfest26.json';

  private readonly productsSubject = new BehaviorSubject<Product[]>(this.loadCachedProducts());

  constructor(private http: HttpClient) {
    this.refreshProducts().subscribe();
  }

  productsChanges(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  private loadCachedProducts(): Product[] {
    const cached = localStorage.getItem(this.PRODUCT_KEY);

    if (cached) {
      try {
        return JSON.parse(cached) as Product[];
      } catch {
        localStorage.removeItem(this.PRODUCT_KEY);
      }
    }

    return PRODUCTS;
  }

  private persistProducts(products: Product[]) {
    localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(products));
  }

  refreshProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.PRODUCT_URL).pipe(
      tap(products => {
        this.productsSubject.next(products);
        this.persistProducts(products);
      }),
      catchError(() => of(this.productsSubject.value))
    );
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  getPrices() {
    // Legacy method for compatibility - now prices are directly in products
    return this.getProducts().map(p => ({
      id: `p${p.id}`,
      productId: p.id,
      amount: p.price,
      currency: 'EUR',
      validFrom: new Date().toISOString()
    }));
  }
}
