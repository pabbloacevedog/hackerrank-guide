# Angular - Intermediate Level
## Key Competencies
### 1. Routing
#### Using routing to change views

Routing in Angular allows navigation between different views of the application without reloading the entire page. In a virtual store like "TechShop", routing is used to navigate between the product list and specific product details, or to proceed to checkout.

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 2. Modules, Directives, Pipes

Modules, directives, and pipes are fundamental tools in Angular that allow us to organize and transform our application's code and data.

#### Using NgModules

NgModules in Angular are fundamental building blocks that allow organizing code into reusable modules. In "TechShop", we use NgModules to group related components, directives, and services, improving the application's maintainability and scalability. For example, we can have a module for the product catalog that includes components for the product list and product details.

```typescript
// product.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [CommonModule],
  exports: [ProductListComponent, ProductDetailComponent]
})
export class ProductModule { }
```

#### Grouping related components

Grouping related components into specific modules improves code organization and maintainability. In "TechShop", we group all shopping cart-related components into a dedicated module, facilitating their reuse and testing.

```typescript
// cart.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  declarations: [CartComponent, CartItemComponent, CheckoutComponent],
  imports: [CommonModule],
  exports: [CartComponent]
})
export class CartModule { }
```

#### Implementing pipes

Pipes in Angular allow data transformation for display. In "TechShop", we implement a custom pipe to format prices according to the local currency, improving user experience by displaying financial information clearly and consistently.

```typescript
// currency-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(value);
  }
}
```

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.techshop.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
```

### 3. Observables

Observables are a powerful way to handle asynchronous data streams and events in Angular applications.

#### Using observables for data transmission

In "TechShop", we use observables to manage the shopping cart state and product updates in real-time.

```typescript
// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next([...currentItems, item]);
  }
}
```

### 4. Dependency Injection

Dependency Injection is a fundamental concept in Angular that helps manage component dependencies and services.

#### Creating and using services

In "TechShop", we create services to handle product data and cart operations, making the code more modular and maintainable.

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.techshop.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
```

### 5. Using APIs

Angular applications often need to communicate with backend services through APIs.

#### HTTP communication

In "TechShop", we implement HTTP communication to fetch product data and manage user orders.

```typescript
// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://api.techshop.com/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/history`);
  }
}
```

This implementation demonstrates handling HTTP requests, error management, and working with observables for asynchronous operations.
```