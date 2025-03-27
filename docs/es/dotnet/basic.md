# dotNet - Nivel Básico

## Competencias Clave

### 1. Sistema de Tipos

El sistema de tipos en dotNet es un componente fundamental que define cómo se organizan y manipulan los datos en memoria. Proporciona un conjunto robusto de tipos predefinidos y permite la creación de tipos personalizados, garantizando la seguridad de tipos en tiempo de compilación.

#### Tipos de Valor y Referencia

**Definición:**
Los tipos en dotNet se dividen en dos categorías principales: tipos de valor (almacenados directamente en la pila) y tipos de referencia (almacenados en el montón). Esta distinción es crucial para entender cómo se manejan los datos en memoria y optimizar el rendimiento de las aplicaciones.

**Uso Práctico:**
Los tipos de valor son ideales para datos simples y pequeños que se pasan por valor, mientras que los tipos de referencia son mejores para objetos complejos que necesitan ser compartidos o modificados a través de referencias.

**Ejemplo en TechShop:**
En nuestra tienda virtual, utilizamos tipos de valor para manejar precios, cantidades y estados simples de productos, mientras que los tipos de referencia se emplean para gestionar objetos más complejos como productos y pedidos.

```csharp
public class GestorProductos
{
    // Tipos de valor para datos simples
    private decimal precioMinimo = 0.01m;
    private int stockMinimo = 5;
    private bool productoActivo = true;

    // Tipos de referencia para datos complejos
    private string descripcionProducto = "Producto de alta calidad";
    private DateTime fechaCreacion = DateTime.Now;

    public void ActualizarPrecio(string codigoProducto, decimal nuevoPrecio)
    {
        if (nuevoPrecio < precioMinimo)
        {
            throw new ArgumentException($"El precio debe ser mayor a {precioMinimo}");
        }
        // Lógica de actualización de precio
    }
}
```

#### Clases y Estructuras

**Definición:**
Las clases y estructuras son los bloques fundamentales para crear tipos personalizados en dotNet. Las clases son tipos de referencia que permiten herencia y polimorfismo, mientras que las estructuras son tipos de valor más ligeros y eficientes para datos pequeños.

**Uso Práctico:**
Las clases se utilizan para modelar objetos complejos con comportamiento y estado, mientras que las estructuras son ideales para representar datos simples y pequeños que se copian frecuentemente.

**Ejemplo en TechShop:**
Utilizamos clases para representar entidades del negocio como Productos y Pedidos, y estructuras para datos más simples como coordenadas de ubicación o dimensiones de productos.

```csharp
// Clase para representar un producto
public class Producto
{
    public string Codigo { get; set; }
    public string Nombre { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
}

// Estructura para dimensiones de producto
public struct DimensionesProducto
{
    public decimal Largo { get; set; }
    public decimal Ancho { get; set; }
    public decimal Alto { get; set; }

    public decimal CalcularVolumen()
    {
        return Largo * Ancho * Alto;
    }
}
```

### 2. Entrada/Salida

Las operaciones de entrada/salida en dotNet proporcionan mecanismos para interactuar con archivos, redes y otros recursos externos. Estas operaciones son fundamentales para la persistencia de datos y la comunicación entre sistemas.

#### Manejo de Archivos

**Definición:**
El sistema de archivos en dotNet ofrece clases y métodos para crear, leer, escribir y manipular archivos y directorios de manera segura y eficiente.

**Uso Práctico:**
Se utiliza para operaciones como lectura de configuraciones, almacenamiento de logs, procesamiento de archivos batch y exportación de datos.

**Ejemplo en TechShop:**
Implementamos el manejo de archivos para procesar catálogos de productos en formato CSV y generar reportes de ventas.

```csharp
public class GestorArchivos
{
    private readonly string _rutaArchivos;
    private readonly ILogger<GestorArchivos> _logger;

    public GestorArchivos(string rutaArchivos, ILogger<GestorArchivos> logger)
    {
        _rutaArchivos = rutaArchivos;
        _logger = logger;
    }

    public async Task<List<Producto>> ImportarProductosAsync(string nombreArchivo)
    {
        var productos = new List<Producto>();
        var rutaCompleta = Path.Combine(_rutaArchivos, nombreArchivo);

        try
        {
            var lineas = await File.ReadAllLinesAsync(rutaCompleta);
            foreach (var linea in lineas.Skip(1)) // Saltamos la cabecera
            {
                var campos = linea.Split(',');
                productos.Add(new Producto
                {
                    Codigo = campos[0],
                    Nombre = campos[1],
                    Precio = decimal.Parse(campos[2]),
                    Stock = int.Parse(campos[3])
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al importar productos");
            throw;
        }

        return productos;
    }
}
```

#### Comunicación en Red

**Definición:**
Las facilidades de red en dotNet permiten la comunicación entre aplicaciones a través de diversos protocolos y patrones de comunicación.

**Uso Práctico:**
Se utiliza para implementar servicios web, APIs REST, comunicación en tiempo real y conexiones a servicios externos.

**Ejemplo en TechShop:**
Implementamos comunicación en red para integrar nuestro sistema con servicios de pago y proveedores externos.

```csharp
public class ServicioPagos
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ServicioPagos(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["PagoAPI:Key"];
        _httpClient.BaseAddress = new Uri(config["PagoAPI:BaseUrl"]);
    }

    public async Task<ResultadoPago> ProcesarPagoAsync(PagoRequest request)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsJsonAsync("/api/pagos", request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<ResultadoPago>();
        }
        catch (HttpRequestException ex)
        {
            throw new PagoException("Error al procesar el pago", ex);
        }
    }
}
```

### 3. Colecciones

Las colecciones en dotNet proporcionan estructuras de datos optimizadas para almacenar, organizar y manipular grupos de objetos. Cada tipo de colección tiene características específicas que la hacen más adecuada para ciertos escenarios.

#### Listas y Arrays

**Definición:**
Las listas son colecciones dinámicas que pueden crecer o reducirse según sea necesario, mientras que los arrays son colecciones de tamaño fijo con acceso directo a elementos por índice.

**Uso Práctico:**
Las listas se utilizan cuando el tamaño de la colección es variable, mientras que los arrays son más eficientes para tamaños fijos y acceso aleatorio frecuente.

**Ejemplo en TechShop:**
Utilizamos listas para manejar catálogos de productos y carritos de compra, y arrays para operaciones que requieren rendimiento optimizado.

```csharp
public class CarritoCompra
{
    private List<ProductoCarrito> _items;
    private readonly decimal[] _descuentosPorCantidad = { 0.0m, 0.05m, 0.10m, 0.15m };

    public CarritoCompra()
    {
        _items = new List<ProductoCarrito>();
    }

    public void AgregarProducto(Producto producto, int cantidad)
    {
        var item = _items.FirstOrDefault(i => i.ProductoId == producto.Id);
        if (item != null)
        {
            item.Cantidad += cantidad;
        }
        else
        {
            _items.Add(new ProductoCarrito
            {
                ProductoId = producto.Id,
                Nombre = producto.Nombre,
                Precio = producto.Precio,
                Cantidad = cantidad
            });
        }
    }

    public decimal CalcularTotal()
    {
        decimal total = 0;
        foreach (var item in _items)
        {
            var descuentoIndex = Math.Min(item.Cantidad / 5, _descuentosPorCantidad.Length - 1);
            var descuento = _descuentosPorCantidad[descuentoIndex];
            total += item.Precio * item.Cantidad * (1 - descuento);
        }
        return total;
    }
}
```

