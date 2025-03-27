# dotNet - Nivel Intermedio

## Competencias Clave

### 1. Acceso a Datos

**Definición:**
El acceso a datos en dotNet proporciona una forma robusta y eficiente de interactuar con bases de datos relacionales y no relacionales. Mediante el uso de tecnologías como ADO.NET y Entity Framework, podemos implementar patrones de acceso a datos que garantizan la integridad, seguridad y rendimiento de nuestras aplicaciones.

**Uso Práctico:**
Se utiliza para implementar la capa de persistencia de datos en aplicaciones empresariales, permitiendo operaciones CRUD, consultas complejas y manejo de transacciones de manera eficiente y segura.

#### Conocimiento de API de base de datos en .Net, ADO.Net y Entity Framework

**Definición:**
Entity Framework Core es un ORM (Object-Relational Mapper) moderno que simplifica el acceso a datos mediante la abstracción de la capa de base de datos, permitiendo a los desarrolladores trabajar con objetos de dominio en lugar de consultas SQL directas.

**Uso Práctico:**
Se utiliza para mapear objetos del dominio a tablas de la base de datos, simplificar consultas complejas y mantener la integridad referencial de los datos.

**Ejemplo en TechShop:**
En TechShop, utilizamos Entity Framework Core para gestionar nuestro catálogo de productos, pedidos y datos de clientes. Esta tecnología nos permite mantener un código limpio y mantenible mientras garantizamos un acceso eficiente a los datos.

```csharp
public class TechShopContext : DbContext
{
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=.;Database=TechShop;Trusted_Connection=True;");
    }
}

public class ProductoServicio
{
    private readonly TechShopContext _context;

    public ProductoServicio(TechShopContext context)
    {
        _context = context;
    }

    public async Task<Producto> ObtenerProductoPorId(int id)
    {
        return await _context.Productos
            .Include(p => p.Categoria)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Producto>> ObtenerProductosEnStock()
    {
        return await _context.Productos
            .Where(p => p.Stock > 0)
            .ToListAsync();
    }
}
```

### 2. LINQ Intermedio

**Definición:**
LINQ (Language Integrated Query) es una característica poderosa de .NET que permite realizar consultas y transformaciones de datos de manera expresiva y tipo-segura. Proporciona una sintaxis unificada para trabajar con diferentes fuentes de datos.

**Uso Práctico:**
Se utiliza para realizar consultas complejas, transformaciones y análisis de datos en colecciones, bases de datos y otros orígenes de datos de manera consistente y mantenible.

#### Uso de LINQ para agrupar objetos y realizar subconsultas

**Definición:**
Las operaciones avanzadas de LINQ permiten realizar agrupaciones, subconsultas y transformaciones complejas de datos utilizando una sintaxis declarativa y tipo-segura.

**Uso Práctico:**
Se emplea para generar reportes, análisis estadísticos y transformaciones de datos que requieren múltiples niveles de agrupación y filtrado.

**Ejemplo en TechShop:**
En TechShop, utilizamos LINQ para realizar análisis de ventas, gestionar inventario y dar seguimiento a pedidos, permitiéndonos tomar decisiones basadas en datos.

```csharp
public class AnalizadorVentas
{
    private readonly TechShopContext _context;

    public async Task<IEnumerable<ResumenVentasCategoria>> ObtenerResumenPorCategoria()
    {
        return await _context.Pedidos
            .SelectMany(p => p.Items)
            .GroupBy(i => i.Producto.Categoria)
            .Select(g => new ResumenVentasCategoria
            {
                Categoria = g.Key.Nombre,
                TotalVentas = g.Sum(i => i.Cantidad * i.PrecioUnitario),
                ProductoMasVendido = g.GroupBy(i => i.Producto)
                    .OrderByDescending(pg => pg.Sum(i => i.Cantidad))
                    .Select(pg => pg.Key.Nombre)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> ObtenerProductosDestacados()
    {
        var promedioVentas = await _context.Pedidos
            .SelectMany(p => p.Items)
            .AverageAsync(i => i.Cantidad);

        return await _context.Productos
            .Where(p => p.PedidoItems.Average(i => i.Cantidad) > promedioVentas)
            .ToListAsync();
    }
}
```

### 3. Ecosistema .NET

**Definición:**
.NET es un ecosistema completo que incluye frameworks, herramientas y bibliotecas para desarrollar aplicaciones modernas. La plataforma ofrece un entorno de desarrollo unificado para diferentes tipos de aplicaciones.

**Uso Práctico:**
Se utiliza para desarrollar aplicaciones web, móviles, de escritorio y servicios en la nube, aprovechando un conjunto común de herramientas y bibliotecas.

#### Diferencias entre .NET Core y .NET Framework

**Definición:**
.NET Core, ahora conocido simplemente como .NET, es una plataforma de desarrollo multiplataforma, de código abierto y modular que representa la evolución moderna del framework .NET.

**Uso Práctico:**
Se emplea para desarrollar aplicaciones modernas que requieren ser ejecutadas en múltiples plataformas, contenedores y entornos cloud.

**Ejemplo en TechShop:**
En TechShop, aprovechamos la naturaleza multiplataforma de .NET Core para desplegar nuestra aplicación en diversos entornos, desde servidores Windows hasta contenedores Linux en la nube.

```csharp
public class GestorArchivos
{
    public string ObtenerDirectorioImagenes()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return Path.Combine(Environment.GetFolderPath(
                Environment.SpecialFolder.CommonApplicationData),
                "TechShop", "Imagenes");
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            return "/var/lib/techshop/imagenes";
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        {
            return "/Users/Shared/techshop/imagenes";
        }
        throw new PlatformNotSupportedException();
    }
}
```

### 4. Infraestructura de Lenguaje Común (CLI)

**Definición:**
La Infraestructura de Lenguaje Común (CLI) es un componente fundamental de .NET que define cómo se compila y ejecuta el código. Proporciona un entorno de ejecución estandarizado para múltiples lenguajes.

**Uso Práctico:**
Se utiliza para garantizar la interoperabilidad entre lenguajes, optimizar el rendimiento del código y proporcionar servicios runtime como la gestión de memoria y la seguridad.

#### Comprensión del CLR y compilador Roslyn

**Definición:**
El CLR (Common Language Runtime) y el compilador Roslyn son componentes clave que proporcionan servicios de ejecución y análisis de código en tiempo real.

**Uso Práctico:**
Se emplean para realizar análisis estático de código, refactorización automática y optimizaciones de rendimiento durante el desarrollo.

**Ejemplo en TechShop:**
En TechShop, utilizamos las capacidades del compilador Roslyn para implementar análisis de código estático y asegurar la calidad del código, manteniendo estándares de codificación consistentes.

```csharp
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

public class AnalizadorCodigo
{
    public IEnumerable<string> AnalizarControladores(string codigo)
    {
        var tree = CSharpSyntaxTree.ParseText(codigo);
        var root = tree.GetRoot();
        
        return root.DescendantNodes()
            .OfType<ClassDeclarationSyntax>()
            .Where(c => c.Identifier.Text.EndsWith("Controller"))
            .Select(c => c.Identifier.Text);
    }

    public bool ValidarConvencionesNombramiento(string codigo)
    {
        var tree = CSharpSyntaxTree.ParseText(codigo);
        var root = tree.GetRoot();
        
        var metodos = root.DescendantNodes()
            .OfType<MethodDeclarationSyntax>();

        return metodos.All(m => char.IsUpper(m.Identifier.Text[0]));
    }
}
```

### 5. Ensamblados

**Definición:**
Los ensamblados son las unidades fundamentales de implementación, control de versiones y seguridad en .NET. Proporcionan un mecanismo para organizar y distribuir código compilado y recursos.

**Uso Práctico:**
Se utilizan para empaquetar código, metadatos y recursos en unidades desplegables que pueden ser versionadas y distribuidas de manera independiente.

#### Conocimiento de formato de archivo de ensamblado y metadatos

**Definición:**
Los ensamblados contienen código IL (Intermediate Language), metadatos y recursos en un formato estructurado que permite su carga y ejecución por el runtime de .NET.

**Uso Práctico:**
Se emplea para crear sistemas modulares, implementar plugins y gestionar dependencias de manera eficiente.

**Ejemplo en TechShop:**
En TechShop, utilizamos ensamblados para modularizar nuestra aplicación y gestionar dependencias, permitiendo un sistema de plugins flexible y actualizaciones controladas de componentes.

```csharp
public class AnalizadorModulos
{
    public void AnalizarModulo(string rutaEnsamblado)
    {
        var ensamblado = Assembly.LoadFrom(rutaEnsamblado);
        
        var controladores = ensamblado.GetTypes()
            .Where(t => t.Name.EndsWith("Controller"));

        foreach (var controlador in controladores)
        {
            Console.WriteLine($"Controlador: {controlador.FullName}");
            
            var endpoints = controlador.GetMethods()
                .Where(m => m.GetCustomAttributes(typeof(HttpMethodAttribute), true).Any());

            foreach (var endpoint in endpoints)
            {
                Console.WriteLine($"  Endpoint: {endpoint.Name}");
                Console.WriteLine($"  Ruta: {endpoint.GetCustomAttribute<RouteAttribute>()?.Template}");
            }
        }
    }
}
```

### 6. Globalización y Localización

**Definición:**
La globalización y localización en .NET permiten crear aplicaciones que se adaptan a diferentes culturas y regiones. Proporcionan mecanismos para manejar formatos específicos de cada cultura y traducciones de contenido.

**Uso Práctico:**
Se utiliza para crear aplicaciones internacionales que pueden adaptarse a diferentes idiomas, formatos de fecha, números y moneda según la región del usuario.

#### Facilidades .NET para desarrollo de aplicaciones localizadas

**Definición:**
Las herramientas de localización de .NET permiten separar el contenido localizable del código, gestionar recursos de idioma y aplicar formatos específicos de cultura.

**Uso Práctico:**
Se emplea para crear interfaces de usuario multilingües, formatear datos según las convenciones locales y proporcionar una experiencia consistente para usuarios internacionales.

**Ejemplo en TechShop:**
En TechShop, implementamos un sistema robusto de localización para atender a clientes internacionales, permitiendo mostrar precios, fechas y mensajes en el formato local de cada usuario.

```csharp
public class ServicioLocalizacion
{
    private readonly IStringLocalizer<ServicioLocalizacion> _localizer;
    private readonly IOptions<RequestLocalizationOptions> _localizationOptions;

    public ServicioLocalizacion(
        IStringLocalizer<ServicioLocalizacion> localizer,
        IOptions<RequestLocalizationOptions> localizationOptions)
    {
        _localizer = localizer;
        _localizationOptions = localizationOptions;
    }

    public string ObtenerMensajeProducto(string nombreProducto, decimal precio)
    {
        return string.Format(_localizer["ProductDetails"],
            nombreProducto,
            FormatearPrecio(precio));
    }

    public string FormatearPrecio(decimal precio)
    {
        var cultura = CultureInfo.CurrentCulture;
        return precio.ToString("C", cultura);
    }

    public IEnumerable<CultureInfo> ObtenerCulturasDisponibles()
    {
        return _localizationOptions.Value.SupportedCultures;
    }
}
```