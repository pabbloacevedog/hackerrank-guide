# Angular - Nivel Intermedio

## Competencias Clave

### 1. Enrutamiento

El enrutamiento en Angular es fundamental para la navegación entre diferentes vistas de la aplicación. Permite crear una experiencia de usuario fluida al cambiar el contenido mostrado sin recargar la página completa. En una tienda virtual, el enrutamiento se utiliza para navegar entre diferentes secciones como el catálogo de productos, el carrito de compras y el proceso de pago.

Por ejemplo, en nuestra tienda virtual "TechShop", cuando un usuario navega desde la lista de productos a los detalles de un producto específico, o cuando procede al checkout, el enrutamiento maneja estas transiciones de manera eficiente.

#### Uso de enrutamiento para cambiar vistas

El enrutamiento en Angular permite la navegación entre diferentes vistas de la aplicación sin recargar la página completa. En una tienda virtual, como "TechShop", el enrutamiento se utiliza para navegar entre la lista de productos y los detalles de un producto específico, o para proceder al checkout.

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

#### Crear rutas comodín

Las rutas comodín se utilizan para manejar rutas no definidas y redirigir a una página de error. En "TechShop", esto asegura que los usuarios siempre vean una página adecuada incluso si navegan a una URL incorrecta.

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', component: NotFoundComponent } // Ruta comodín
];
```

#### Manejar condiciones de error

El manejo de errores en Angular permite redirigir a los usuarios a una página de error personalizada cuando ocurre un problema. En "TechShop", esto mejora la experiencia del usuario al proporcionar mensajes de error claros.

```typescript
// error-handler.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleError(error: any) {
    console.error('Se produjo un error:', error);
    this.router.navigate(['/error'], {
      queryParams: { message: error.message }
    });
  }
}
```

#### Crear redirecciones y usar rutas relativas

Las redirecciones y rutas relativas permiten una navegación más flexible dentro de la aplicación. En "TechShop", se utilizan para redirigir desde rutas antiguas a nuevas y para definir rutas hijas dentro de secciones como "productos".

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'old-path', redirectTo: '/new-path', pathMatch: 'full' },
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent }
    ]
  }
];
```

#### Acceder a parámetros de consulta

Acceder a parámetros de consulta permite obtener información adicional de la URL. En "TechShop", esto se utiliza para mostrar detalles específicos de un producto basado en su ID.

```typescript
// product.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  template: '<div>Producto ID: {{productId}}</div>'
})
export class ProductComponent implements OnInit {
  productId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
    });
  }
}
```

### 2. Módulos, Directivas, Pipes

Los módulos, directivas y pipes son herramientas fundamentales en Angular que nos permiten organizar y transformar nuestra aplicación de manera eficiente. En nuestra tienda virtual TechShop, utilizamos módulos para organizar características relacionadas como el catálogo de productos o el carrito de compras. Las directivas nos permiten manipular el DOM y agregar comportamientos personalizados a los elementos, mientras que los pipes nos ayudan a transformar y formatear datos como precios, fechas y descripciones de productos.

#### Usar NgModules

Los NgModules en Angular son bloques de construcción fundamentales que permiten organizar el código en módulos reutilizables. En "TechShop", utilizamos NgModules para agrupar componentes, directivas y servicios relacionados, mejorando la mantenibilidad y escalabilidad de la aplicación. Por ejemplo, podemos tener un módulo para el catálogo de productos que incluya componentes para la lista de productos y los detalles de cada producto.

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

#### Agrupar componentes relacionados

Agrupar componentes relacionados en módulos específicos mejora la organización y mantenibilidad del código. En "TechShop", agrupamos todos los componentes relacionados con el carrito de compras en un módulo dedicado, facilitando su reutilización y prueba.

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

#### Trabajar con directivas

Las directivas en Angular permiten extender el HTML con comportamiento personalizado. En "TechShop", implementamos una directiva de resaltado que cambia el color de fondo de un elemento cuando el usuario pasa el cursor sobre él, mejorando la interactividad de la interfaz.

```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() highlightColor: string = 'yellow';
  private originalColor: string;

  constructor(private el: ElementRef) {
    this.originalColor = this.el.nativeElement.style.backgroundColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.originalColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

#### Implementar pipes

Los pipes en Angular permiten transformar datos para su visualización. En "TechShop", implementamos un pipe personalizado para formatear precios según la moneda local, mejorando la experiencia del usuario al mostrar información financiera de manera clara y consistente.

```typescript
// currency-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
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
}

// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Component({
  selector: 'app-product-list',
  template: '<div *ngFor="let product of products">{{product.name}}</div>'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => this.products = products);
  }
}
```

### 3. Observables

   Los observables son fundamentales para la comunicación entre componentes en Angular. Por ejemplo, en una tienda virtual, podemos usar un servicio compartido con observables para mantener sincronizado el estado del carrito de compras entre diferentes componentes:
   
#### Usar observables para transmitir datos entre componentes

   Este ejemplo muestra cómo el CartService utiliza BehaviorSubject para mantener el estado del carrito y notificar a los componentes suscritos cuando hay cambios. El CartWidgetComponent se suscribe a estos observables para mostrar información actualizada del carrito en tiempo real.


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
     cartItems$ = this.cartItems.asObservable();

     addToCart(item: CartItem) {
       const currentItems = this.cartItems.value;
       const existingItem = currentItems.find(i => i.productId === item.productId);

       if (existingItem) {
         existingItem.quantity += 1;
         this.cartItems.next([...currentItems]);
       } else {
         this.cartItems.next([...currentItems, item]);
       }
     }

     removeFromCart(productId: string) {
       const currentItems = this.cartItems.value;
       this.cartItems.next(currentItems.filter(item => item.productId !== productId));
     }

     getTotal(): Observable<number> {
       return new Observable<number>(subscriber => {
         this.cartItems$.subscribe(items => {
           const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
           subscriber.next(total);
         });
       });
     }
   }

   // cart-widget.component.ts
   import { Component, OnInit } from '@angular/core';
   import { CartService } from './cart.service';
   import { CartItem } from './cart-item.model';

   @Component({
     selector: 'app-cart-widget',
     template: `
       <div class="cart-widget">
         <span>Items en carrito: {{itemCount}}</span>
         <span>Total: {{total | currency}}</span>
       </div>
     `
   })
   export class CartWidgetComponent implements OnInit {
     itemCount = 0;
     total = 0;

     constructor(private cartService: CartService) {}

     ngOnInit() {
       this.cartService.cartItems$.subscribe(items => {
         this.itemCount = items.length;
       });

       this.cartService.getTotal().subscribe(total => {
         this.total = total;
       });
     }
   }
   ```

#### Manejo de eventos

El manejo de eventos en Angular permite responder a las interacciones del usuario de manera eficiente. En "TechShop", podemos utilizar eventos para agregar productos al carrito cuando el usuario hace clic en un botón. Esto mejora la experiencia del usuario al proporcionar una respuesta inmediata a sus acciones.

```typescript
// add-to-cart.component.ts
import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { Product } from './product.model';

@Component({
  selector: 'app-add-to-cart',
  template: '<button (click)="addToCart(product)">Agregar al carrito</button>'
})
export class AddToCartComponent {
  product: Product;

  constructor(private cartService: CartService) {}

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
```

#### Programación asíncrona

La programación asíncrona en Angular es crucial para realizar operaciones que no bloqueen la interfaz de usuario, como la obtención de datos de una API. En "TechShop", utilizamos programación asíncrona para cargar productos desde el servidor sin interrumpir la experiencia del usuario.

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.techshop.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error al obtener productos:', error);
          throw error;
        })
      );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar producto:', error);
          throw error;
        })
      );
  }
}
```
### 4. Inyección de Dependencias

La inyección de dependencias es un patrón de diseño fundamental en Angular que nos permite gestionar las dependencias de nuestros componentes de manera eficiente. En nuestra tienda virtual TechShop, utilizamos la inyección de dependencias para manejar servicios como la gestión del carrito de compras, la autenticación de usuarios y el acceso a la API de productos.

#### Crear servicios externos

En TechShop, creamos un servicio de productos que maneja todas las operaciones relacionadas con el catálogo de productos:

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

#### Registrar servicios

Registramos nuestros servicios en el módulo principal de TechShop para que estén disponibles en toda la aplicación:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { ProductService } from './product.service';
import { CartService } from './cart.service';

@NgModule({
  // ...
  providers: [
    ProductService,
    CartService,
    {
      provide: 'API_URL',
      useValue: 'https://api.techshop.com'
    }
  ]
})
export class AppModule { }
```

#### Inyectar objetos

En los componentes de TechShop, inyectamos los servicios necesarios para acceder a la funcionalidad requerida:

```typescript
// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { Product } from './product.model';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-grid">
      <div *ngFor="let product of products" class="product-card">
        <h3>{{product.name}}</h3>
        <p>{{product.price | currencyFormat}}</p>
        <button (click)="addToCart(product)">Agregar al carrito</button>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
}
```

### 5. Uso de APIs

En TechShop, la comunicación con el backend se realiza a través de APIs RESTful. Esto nos permite gestionar el catálogo de productos, procesar pedidos y manejar la autenticación de usuarios de manera eficiente.

#### Obtener datos a través de HTTP/S

Implementamos un servicio de pedidos que maneja todas las operaciones relacionadas con las órdenes de compra:

```typescript
// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://api.techshop.com/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Order>(this.apiUrl, order, { headers });
  }

  getOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}`, { status });
  }
}
```
#### Consumir datos de APIs

En TechShop, implementamos un componente de checkout que utiliza el servicio de órdenes para procesar las compras:

```typescript
// checkout.component.ts
import { Component } from '@angular/core';
import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout-container">
      <div *ngIf="loading" class="loading-spinner">Procesando orden...</div>
      <div *ngIf="error" class="error-message">{{error}}</div>
      <div *ngIf="!loading && !error" class="order-summary">
        <h2>Resumen de la Orden</h2>
        <div *ngFor="let item of cartItems" class="order-item">
          <span>{{item.name}}</span>
          <span>{{item.quantity}}x</span>
          <span>{{item.price | currencyFormat}}</span>
        </div>
        <div class="total">
          <strong>Total: {{total | currencyFormat}}</strong>
        </div>
        <button (click)="processOrder()" [disabled]="loading">
          Confirmar Compra
        </button>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartItems: any[] = [];
  total: number = 0;
  loading = false;
  error: string = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });
  }

  processOrder() {
    this.loading = true;
    this.error = '';

    const order = {
      items: this.cartItems,
      total: this.total,
      date: new Date(),
      status: 'pending'
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.loading = false;
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation'], {
          queryParams: { orderId: response.id }
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al procesar la orden. Por favor, intente nuevamente.';
      }
    });
  }
}
```