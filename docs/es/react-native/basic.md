# React Native - Nivel Básico

## Competencias Clave

### 1. Navegación Básica

La navegación en React Native es un sistema que permite a los usuarios moverse entre diferentes pantallas y gestionar el historial de navegación en una aplicación móvil. Es esencial para crear una experiencia de usuario intuitiva y fluida.

#### Comprensión de la navegación entre componentes

La navegación entre componentes es la capacidad de moverse entre diferentes pantallas o vistas en una aplicación React Native, manteniendo un historial de navegación y permitiendo acciones como retroceder o avanzar.

En TechShop Mobile, utilizamos la navegación para permitir a los usuarios explorar el catálogo de productos, ver detalles específicos de cada producto y gestionar su carrito de compras de manera intuitiva. Implementamos React Navigation para crear una estructura de navegación eficiente y mantenible que mejora la experiencia del usuario.

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'TechShop' }} 
        />
        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen} 
          options={{ title: 'Detalles del Producto' }} 
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{ title: 'Carrito' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 2. Componentes de React Native

Los componentes de React Native son los bloques de construcción fundamentales para crear interfaces de usuario en aplicaciones móviles. Estos componentes se renderizan como elementos nativos de la plataforma (iOS o Android), proporcionando un rendimiento óptimo y una experiencia de usuario nativa.

#### Uso de componentes básicos

Los componentes básicos son los elementos fundamentales proporcionados por React Native para construir interfaces de usuario. Incluyen View (contenedor), Text (texto), Image (imágenes) y TouchableOpacity (áreas táctiles), entre otros.

En TechShop Mobile, utilizamos estos componentes básicos para construir interfaces de usuario nativas y responsivas que se adaptan a diferentes dispositivos y plataformas. Implementamos estos componentes para crear tarjetas de productos, listas de categorías y botones de acción que proporcionan una experiencia de compra intuitiva y agradable.

```javascript
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image 
        source={{ uri: product.imageUrl }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  info: {
    marginTop: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
```

### 3. Renderizado de Elementos

El renderizado de elementos en React Native es el proceso de convertir los componentes de React en vistas nativas de la plataforma. Este proceso es crucial para mantener un rendimiento óptimo y una experiencia de usuario fluida, especialmente al manejar grandes cantidades de datos.

#### Implementación de listas y elementos dinámicos

Las listas y elementos dinámicos son componentes especializados para mostrar colecciones de datos de manera eficiente. React Native proporciona componentes como FlatList y ScrollView que implementan técnicas de renderizado optimizado y reciclaje de vistas.

En TechShop Mobile, implementamos estas técnicas eficientes de renderizado para mostrar nuestro catálogo de productos, categorías y detalles de manera optimizada. Utilizamos FlatList para manejar grandes listas de productos con scroll infinito y ScrollView para contenido estático que requiere desplazamiento.

```javascript
import { FlatList, ActivityIndicator } from 'react-native';

const ProductList = ({ products, onProductPress }) => {
  const renderItem = ({ item }) => (
    <ProductCard 
      product={item} 
      onPress={() => onProductPress(item)} 
    />
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text>No hay productos disponibles</Text>
    </View>
  );

  const renderFooter = () => (
    <ActivityIndicator size="large" color="#0000ff" />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={loadMoreProducts}
      onEndReachedThreshold={0.5}
    />
  );
};
```

### 4. Gestión de Estado (Estado Interno del Componente)

La gestión de estado en React Native se refiere al manejo y almacenamiento de datos que pueden cambiar durante el ciclo de vida de un componente o aplicación. Es fundamental para mantener la interfaz de usuario sincronizada con los datos y manejar las interacciones del usuario.

#### Manejo de estado con useState y useReducer

Los hooks useState y useReducer son herramientas proporcionadas por React para gestionar el estado en componentes funcionales. useState es ideal para estados simples, mientras que useReducer es más apropiado para lógica de estado compleja.

En TechShop Mobile, utilizamos estos hooks para gestionar el estado de nuestra aplicación, manteniendo la información actualizada y sincronizada entre diferentes componentes. Por ejemplo, usamos useState para manejar estados simples como la cantidad de productos en el carrito, y useReducer para manejar estados más complejos como el proceso de checkout.

```javascript
import { useState, useReducer } from 'react';

const CartScreen = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return [...state, action.payload];
      case 'REMOVE_ITEM':
        return state.filter(item => item.id !== action.payload.id);
      case 'UPDATE_QUANTITY':
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      default:
        return state;
    }
  };

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <View style={styles.container}>
      <CartItemList 
        items={cartItems} 
        onUpdateQuantity={(item, quantity) =>
          dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { id: item.id, quantity }
          })
        }
      />
    </View>
  );
};
```

### 5. Manejo de Eventos

El manejo de eventos en React Native es el sistema que permite detectar y responder a las interacciones del usuario con la aplicación. Esto incluye toques, gestos, cambios en el texto y otros tipos de entrada del usuario.

#### Implementación de eventos táctiles y gestos

Los eventos táctiles y gestos son interacciones físicas del usuario con la pantalla del dispositivo. React Native proporciona una API completa para manejar estos eventos, incluyendo toques simples, deslizamientos, pellizcos y otros gestos complejos.

En TechShop Mobile, implementamos un sistema robusto de manejo de eventos para proporcionar una experiencia de usuario interactiva y receptiva. Utilizamos eventos táctiles para la selección de productos, gestos de deslizamiento para navegar entre imágenes de productos, y gestos de pellizco para hacer zoom en las imágenes de productos.

```javascript
import { TouchableOpacity, Alert } from 'react-native';
import { PanResponder, Animated } from 'react-native';

const SwipeableProductCard = ({ product, onDelete }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, { dx }) => {
      if (Math.abs(dx) > 120) {
        Alert.alert(
          'Confirmar',
          '¿Desea eliminar este producto?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Eliminar', 
              onPress: () => onDelete(product.id) 
            },
          ]
        );
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }).start();
    },
  });

  return (
    <Animated.View
      style={[styles.card, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <ProductCard product={product} />
    </Animated.View>
  );
};
```

### 6. ES6 y JavaScript

ES6 y JavaScript moderno proporcionan características y funcionalidades avanzadas que permiten escribir código más limpio, eficiente y mantenible. Estas características son fundamentales para el desarrollo de aplicaciones React Native modernas.

#### Uso de características modernas de JavaScript

Las características modernas de JavaScript, como desestructuración, arrow functions, async/await y métodos de array, permiten escribir código más conciso y expresivo, mejorando la legibilidad y mantenibilidad del código.

En TechShop Mobile, aprovechamos estas características modernas para implementar funcionalidades como el cálculo de descuentos, la gestión de llamadas a API y la transformación de datos del catálogo de productos. Esto nos permite mantener un código base limpio y eficiente que es fácil de entender y mantener.

```javascript
// Desestructuración y arrow functions
const { name, price, description } = product;
const calculateDiscount = (price, percentage) => price * (1 - percentage / 100);

// Async/await para llamadas a API
const fetchProducts = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products?category=${category}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Map y filter para transformación de datos
const discountedProducts = products
  .filter(product => product.stock > 0)
  .map(product => ({
    ...product,
    finalPrice: calculateDiscount(product.price, product.discountPercentage)
  }));
```

### 8. Validación de Formularios

La validación de formularios es un aspecto crucial en el desarrollo de aplicaciones móviles que garantiza la integridad y calidad de los datos ingresados por los usuarios. Incluye la verificación de campos obligatorios, formatos específicos y reglas de negocio personalizadas.

#### Implementación de validación de datos

La validación de datos implica la implementación de reglas y restricciones que aseguran que la información ingresada por los usuarios cumple con los requisitos establecidos. Esto incluye validaciones en tiempo real, mensajes de error informativos y feedback visual.

En TechShop Mobile, implementamos un sistema robusto de validación para nuestros formularios de registro y checkout, asegurando que los datos de contacto, dirección y pago sean correctos y completos. Utilizamos validación en tiempo real para proporcionar feedback inmediato a los usuarios y mejorar la experiencia de compra.

```javascript
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

const CheckoutForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validación de teléfono
    if (!formData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    // Validación de dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => 
          setFormData(prev => ({ ...prev, email: text }))
        }
      />
      {errors.email && 
        <Text style={styles.error}>{errors.email}</Text>
      }

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={formData.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => 
          setFormData(prev => ({ ...prev, phone: text }))
        }
      />
      {errors.phone && 
        <Text style={styles.error}>{errors.phone}</Text>
      }

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={formData.address}
        multiline
        onChangeText={(text) => 
          setFormData(prev => ({ ...prev, address: text }))
        }
      />
      {errors.address && 
        <Text style={styles.error}>{errors.address}</Text>
      }

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```