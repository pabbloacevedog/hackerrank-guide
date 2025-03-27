# React Native - Nivel Intermedio

## Competencias Clave

### 1. Componentes y Props (Componentes Controlados, Múltiples, Ciclo de Vida)

Los componentes controlados y el ciclo de vida son elementos fundamentales en React Native que permiten mantener un control preciso sobre el comportamiento y estado de los componentes en la aplicación. Los componentes controlados garantizan que React sea la única fuente de verdad para el estado de los elementos de la interfaz de usuario.

#### Implementación de Componentes Controlados

Los componentes controlados son aquellos donde React controla completamente el estado del componente, permitiendo validar y transformar la entrada del usuario en tiempo real, manteniendo un flujo de datos unidireccional y predecible.

En TechShop Mobile, implementamos componentes controlados para gestionar formularios de productos, asegurando la validación de datos y una experiencia de usuario fluida. Por ejemplo, nuestro formulario de edición de productos utiliza componentes controlados para validar precios, cantidades y descripciones en tiempo real, proporcionando feedback inmediato al usuario.

```javascript
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text } from 'react-native';

const ControlledProductForm = ({ initialProduct, onSubmit }) => {
  const [product, setProduct] = useState(initialProduct);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateProduct(product);
  }, [product]);

  const validateProduct = (productData) => {
    const newErrors = {};
    if (!productData.name) newErrors.name = 'El nombre es requerido';
    if (productData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateProduct(product)) {
      onSubmit(product);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
        placeholder="Nombre del producto"
        style={styles.input}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        value={String(product.price)}
        onChangeText={(text) => setProduct({ ...product, price: parseFloat(text) || 0 })}
        placeholder="Precio"
        keyboardType="numeric"
        style={styles.input}
      />
      {errors.price && <Text style={styles.error}>{errors.price}</Text>}
    </View>
  );
};
```

### 2. Navegación con Parámetros y Opciones

La navegación con parámetros es una característica avanzada que permite transmitir datos entre pantallas y personalizar la experiencia de navegación según el contexto de la aplicación. Esta funcionalidad es esencial para crear flujos de navegación dinámicos y mantener el estado de la aplicación a través de diferentes pantallas.

#### Implementación de Navegación con Parámetros

La navegación con parámetros implica el paso de datos entre pantallas durante la navegación, permitiendo personalizar la interfaz y el comportamiento de cada pantalla según la información recibida. Esta técnica es fundamental para crear experiencias de usuario contextuales y coherentes.

En TechShop Mobile, implementamos una navegación avanzada que permite visualizar detalles de productos y acceder al carrito de compras de manera intuitiva. Por ejemplo, cuando un usuario selecciona un producto, pasamos los detalles del producto como parámetros a la pantalla de detalles, permitiendo personalizar el título de la navegación y mostrar opciones específicas del producto.

```javascript
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: product.name,
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Cart', { product })}
          style={styles.headerButton}
        >
          <Text>Añadir al Carrito</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, product]);

  return (
    <View style={styles.container}>
      <ProductDetails product={product} />
      <RelatedProducts 
        categoryId={product.categoryId}
        onProductPress={(relatedProduct) => 
          navigation.push('ProductDetails', { product: relatedProduct })
        }
      />
    </View>
  );
};
```

### 3. Uso de APIs

La integración con APIs es un componente crítico en el desarrollo de aplicaciones móviles modernas que permite conectar aplicaciones con servicios backend y gestionar datos remotos de manera eficiente. Las APIs proporcionan una interfaz estructurada para la comunicación cliente-servidor, permitiendo operaciones como autenticación, gestión de datos y procesamiento en el servidor.

#### Implementación de Servicios API

Los servicios API son módulos especializados que encapsulan la lógica de comunicación con el servidor, manejan errores de manera consistente y proporcionan una interfaz limpia para el resto de la aplicación. Esta abstracción permite mantener un código más organizado y facilita el mantenimiento y las actualizaciones.

En TechShop Mobile, implementamos servicios API para gestionar el catálogo de productos, inventario y transacciones de manera segura y eficiente. Por ejemplo, nuestro servicio de productos maneja todas las operaciones relacionadas con el catálogo, incluyendo la obtención de productos, actualización de inventario y gestión de precios, proporcionando una capa de abstracción robusta para toda la aplicación.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.techshop.com/v1',
  timeout: 10000,
});

const ProductService = {
  async getProducts(filters) {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId, updates) {
    try {
      const response = await api.patch(`/products/${productId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
};
```

### 4. Hooks Básicos (useState, useEffect)

Los Hooks son funciones especiales que permiten usar el estado y otras características de React en componentes funcionales. Proporcionan una forma más directa y eficiente de manejar el ciclo de vida y el estado de los componentes, eliminando la necesidad de clases y reduciendo la complejidad del código.

#### Implementación de Custom Hooks

Los Custom Hooks son funciones que encapsulan lógica reutilizable y permiten compartir comportamiento entre componentes. Esta abstracción ayuda a mantener los componentes limpios, enfocados en la presentación y facilita la reutilización de lógica común en toda la aplicación.

En TechShop Mobile, desarrollamos hooks personalizados para gestionar el inventario de productos en tiempo real, mejorando la experiencia de compra. Por ejemplo, nuestro hook useProductInventory maneja la lógica de actualización del inventario, incluyendo la carga de datos, manejo de errores y sincronización en tiempo real, permitiendo que múltiples componentes accedan a esta funcionalidad de manera consistente.

```javascript
import { useState, useEffect } from 'react';

const useProductInventory = (productId) => {
  const [inventory, setInventory] = useState({
    stock: 0,
    reserved: 0,
    available: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getInventory(productId);
        if (isMounted) {
          setInventory({
            stock: data.stock,
            reserved: data.reserved,
            available: data.stock - data.reserved
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInventory();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { inventory, loading, error };
};
```

### 5. Componentes Personalizados

Los componentes personalizados son bloques de construcción reutilizables que encapsulan lógica y diseño específicos. Estos elementos fundamentales de React Native permiten crear interfaces de usuario consistentes, mantener un código limpio y organizado, y establecer un sistema de diseño coherente en toda la aplicación.

#### Implementación de Componentes Reutilizables

Los componentes reutilizables son elementos de interfaz modulares que se pueden utilizar en múltiples partes de la aplicación. Estos componentes siguen principios de diseño consistentes, implementan patrones de interacción comunes y manejan su propio estado interno, lo que reduce la duplicación de código y facilita el mantenimiento de la aplicación.

En TechShop Mobile, utilizamos componentes personalizados para crear elementos de interfaz comunes como badges animados para el carrito de compras, tarjetas de productos y botones personalizados. Por ejemplo, nuestro componente CustomBadge implementa animaciones fluidas y se integra con el sistema de notificaciones para mostrar contadores en tiempo real en el carrito de compras, proporcionando una experiencia visual atractiva y consistente en toda la aplicación.

```javascript
import { View, Text, StyleSheet, Animated } from 'react-native';

const CustomBadge = ({ count, style }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count]);

  return (
    <Animated.View 
      style={[
        styles.badge,
        style,
        { transform: [{ scale: animatedValue }] }
      ]}
    >
      <Text style={styles.text}>{count}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

### 6. Soporte de TypeScript

TypeScript es un superconjunto tipado de JavaScript que añade un sistema de tipos estático opcional al lenguaje. Esta capa adicional de tipado permite detectar errores durante el desarrollo, mejora la documentación del código, facilita el mantenimiento de aplicaciones grandes y proporciona una mejor experiencia de desarrollo con características avanzadas de IDE.

#### Implementación de Tipos y Interfaces

Los tipos e interfaces en TypeScript son herramientas poderosas que permiten definir contratos claros para estructuras de datos, props de componentes y funciones. Este sistema de tipos ayuda a prevenir errores comunes en tiempo de compilación, mejora la autocompletación en el IDE, facilita el refactoring del código y proporciona una mejor documentación integrada.

En TechShop Mobile, utilizamos TypeScript para crear un sistema de tipos robusto que define claramente la estructura de nuestros productos, carritos de compra y componentes de la interfaz de usuario. Por ejemplo, nuestras interfaces tipadas para productos y carritos de compra aseguran la consistencia de los datos en toda la aplicación, facilitan la integración con APIs y ayudan a prevenir errores comunes durante el desarrollo.

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  inventory: {
    stock: number;
    reserved: number;
  };
}

// types/cart.ts
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  userId: string;
}

// components/ProductCard.tsx
import React from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPress, 
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={() => onPress(product)}
    >
      <Image 
        source={{ uri: product.imageUrl }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
```