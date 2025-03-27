# TypeScript - Nivel Intermedio

## Competencias Clave

### 1. Modificadores de Acceso

**Definición:**
Los modificadores de acceso son palabras clave que establecen la visibilidad y accesibilidad de las propiedades y métodos en una clase. En TypeScript, estos son fundamentales para implementar el principio de encapsulamiento y proteger los datos de la clase.

**Uso Práctico:**
Se utilizan para controlar el acceso a las propiedades y métodos de una clase, permitiendo implementar el principio de encapsulamiento y proteger la integridad de los datos.

#### Control de Acceso a Propiedades y Métodos

**Definición:**
Los modificadores public, private y protected permiten definir diferentes niveles de acceso a los miembros de una clase, controlando qué código puede acceder a cada propiedad o método.

**Uso Práctico:**
Se emplea para proteger datos sensibles, implementar patrones de diseño y mantener la integridad del estado interno de los objetos.

**Ejemplo en TechShop:**
En TechShop, utilizamos modificadores de acceso para controlar cómo se accede a las propiedades sensibles de nuestros modelos de datos, como la información de productos y usuarios.

```typescript
class Product {
  public id: string;
  private _price: number;
  protected _inventory: number;

  constructor(id: string, price: number, inventory: number) {
    this.id = id;
    this._price = price;
    this._inventory = inventory;
  }

  public getPrice(): number {
    return this._price;
  }

  protected updateInventory(quantity: number): void {
    this._inventory += quantity;
  }
}
```

### 2. Modificadores de Solo Lectura

**Definición:**
Los modificadores de solo lectura son características que permiten definir propiedades que no pueden ser modificadas una vez inicializadas, garantizando la inmutabilidad de los datos.

**Uso Práctico:**
Se utilizan para prevenir modificaciones accidentales de datos críticos y garantizar la integridad de la información durante el ciclo de vida de la aplicación.

#### Implementación de Propiedades Inmutables

**Definición:**
El modificador readonly permite crear propiedades que solo pueden ser asignadas durante la inicialización del objeto, previniendo modificaciones posteriores.

**Uso Práctico:**
Se emplea para proteger datos que no deben cambiar después de su creación, como identificadores únicos y configuraciones del sistema.

**Ejemplo en TechShop:**
En nuestra aplicación, usamos readonly para proteger identificadores únicos y configuraciones que no deben cambiar durante la ejecución.

```typescript
class ProductConfiguration {
  readonly SKU: string;
  readonly category: string;

  constructor(sku: string, category: string) {
    this.SKU = sku;
    this.category = category;
  }
}
```

### 3. Accesores

**Definición:**
Los accesores son métodos especiales que permiten controlar el acceso y la modificación de las propiedades de una clase, proporcionando una capa adicional de encapsulamiento.

**Uso Práctico:**
Se utilizan para implementar lógica de validación, transformación de datos y mantener la consistencia del estado interno de los objetos.

#### Getters y Setters

**Definición:**
Los getters y setters son métodos especiales que permiten controlar cómo se accede y modifica una propiedad, permitiendo ejecutar lógica adicional durante estas operaciones.

**Uso Práctico:**
Se emplean para validar datos de entrada, calcular valores derivados y mantener la consistencia del estado interno de los objetos.

**Ejemplo en TechShop:**
Utilizamos accesores para controlar y validar las operaciones sobre cantidades en el carrito de compras.

```typescript
class CartItem {
  private _quantity: number = 0;

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    if (value >= 0) {
      this._quantity = value;
    } else {
      throw new Error("La cantidad no puede ser negativa");
    }
  }
}
```

### 4. Decoradores

**Definición:**
Los decoradores son una característica que permite modificar o aumentar el comportamiento de clases, métodos y propiedades en tiempo de ejecución mediante metadatos.

**Uso Práctico:**
Se utilizan para implementar aspectos transversales como logging, validación, y control de acceso de manera declarativa y reutilizable.

#### Implementación de Metadatos y Comportamientos

**Definición:**
Los decoradores permiten añadir metadatos y modificar el comportamiento de elementos del código de manera declarativa, mejorando la legibilidad y mantenibilidad.

**Uso Práctico:**
Se emplean para implementar validaciones, logging, control de acceso y otras funcionalidades transversales sin modificar el código original.

**Ejemplo en TechShop:**
Utilizamos decoradores para implementar validaciones y logging en nuestros servicios de negocio.

```typescript
function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    // Validación antes de ejecutar el método
    console.log(`Validando argumentos para ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
}

class OrderService {
  @Validate
  createOrder(products: Product[]): Order {
    // Lógica de creación de orden
    return new Order(products);
  }
}
```

### 5. Constructores, Instancias y Miembros Estáticos

**Definición:**
Los constructores, instancias y miembros estáticos son elementos fundamentales que definen cómo se crean y comparten recursos entre las instancias de una clase.

**Uso Práctico:**
Se utilizan para inicializar objetos, compartir recursos entre instancias y implementar patrones de diseño como Singleton.

#### Gestión de Instancias y Recursos Compartidos

**Definición:**
Los miembros estáticos pertenecen a la clase en sí y no a las instancias individuales, permitiendo compartir estado y comportamiento entre todas las instancias.

**Uso Práctico:**
Se emplean para implementar patrones de diseño como Singleton, compartir recursos y mantener estado global de la aplicación.

**Ejemplo en TechShop:**
Implementamos un gestor de productos utilizando el patrón Singleton para mantener un único punto de acceso al catálogo de productos.

```typescript
class ProductManager {
  private static instance: ProductManager;
  private products: Map<string, Product>;

  private constructor() {
    this.products = new Map();
  }

  public static getInstance(): ProductManager {
    if (!ProductManager.instance) {
      ProductManager.instance = new ProductManager();
    }
    return ProductManager.instance;
  }

  public addProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  public static createProduct(id: string, name: string, price: number): Product {
    return new Product(id, name, price);
  }
}
```