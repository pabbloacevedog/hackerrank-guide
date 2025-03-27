# SQL - Nivel Intermedio

## Competencias Clave

### 1. Subconsultas y Consultas Anidadas

**Definición:**
Las subconsultas son consultas SQL anidadas dentro de otras consultas principales. Permiten realizar operaciones complejas y obtener resultados basados en múltiples niveles de filtrado y agregación de datos.

**Uso Práctico:**
Se utilizan para realizar consultas complejas que requieren información derivada de múltiples tablas o cálculos intermedios, permitiendo una mayor flexibilidad en el filtrado y procesamiento de datos.

#### Implementación de Subconsultas en Diferentes Cláusulas

**Definición:**
Las subconsultas pueden implementarse en diferentes partes de una consulta SQL (SELECT, FROM, WHERE) para lograr diversos objetivos de procesamiento de datos.

**Uso Práctico:**
Se emplean para filtrar resultados basados en cálculos agregados, crear conjuntos de datos derivados y realizar comparaciones complejas.

**Ejemplo en TechShop:**
En TechShop, utilizamos subconsultas para analizar el rendimiento de ventas y gestionar el inventario de manera eficiente.

```sql
-- Productos con ventas superiores al promedio
SELECT p.nombre, 
       p.precio,
       (SELECT COUNT(*) 
        FROM ventas v 
        WHERE v.producto_id = p.id) as total_ventas
FROM productos p
WHERE (SELECT AVG(cantidad) 
       FROM ventas 
       WHERE producto_id = p.id) > 
      (SELECT AVG(cantidad) FROM ventas);

-- Categorías con productos de alto rendimiento
SELECT c.nombre_categoria,
       (SELECT COUNT(*)
        FROM productos p
        WHERE p.categoria_id = c.id) as total_productos,
       (SELECT AVG(precio)
        FROM productos
        WHERE categoria_id = c.id) as precio_promedio
FROM categorias c
WHERE EXISTS (
    SELECT 1
    FROM productos p
    WHERE p.categoria_id = c.id
    AND p.precio > 1000
);
```

### 2. Agrupación y Agregación de Datos

**Definición:**
La agrupación y agregación de datos permite resumir y analizar información mediante funciones de agregación y agrupamiento por criterios específicos.

**Uso Práctico:**
Se utiliza para generar reportes, realizar análisis estadísticos y obtener métricas agregadas que ayudan en la toma de decisiones empresariales.

#### Funciones de Agregación y Cláusulas GROUP BY

**Definición:**
Las funciones de agregación (COUNT, SUM, AVG, etc.) junto con GROUP BY permiten realizar cálculos sobre grupos de registros definidos por una o más columnas.

**Uso Práctico:**
Se emplea para calcular totales, promedios y otros indicadores estadísticos por categorías, períodos o cualquier otro criterio de agrupación.

**Ejemplo en TechShop:**
Utilizamos agrupación y agregación para analizar el rendimiento de ventas por categorías y períodos.

```sql
-- Resumen de ventas por categoría
SELECT c.nombre_categoria,
       COUNT(v.id) as total_ventas,
       SUM(v.cantidad * p.precio) as ingreso_total,
       AVG(v.cantidad) as promedio_unidades,
       MAX(v.fecha_venta) as ultima_venta
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
JOIN ventas v ON p.id = v.producto_id
GROUP BY c.nombre_categoria
HAVING SUM(v.cantidad) > 100
ORDER BY ingreso_total DESC;

-- Análisis de ventas mensuales
SELECT 
    DATE_TRUNC('month', v.fecha_venta) as mes,
    COUNT(DISTINCT v.cliente_id) as total_clientes,
    SUM(v.cantidad) as unidades_vendidas,
    SUM(v.cantidad * p.precio) as ingresos_totales
FROM ventas v
JOIN productos p ON v.producto_id = p.id
GROUP BY DATE_TRUNC('month', v.fecha_venta)
ORDER BY mes DESC;
```

### 3. Índices

**Definición:**
Los índices son estructuras de datos que mejoran la velocidad de recuperación de información en las tablas de la base de datos, optimizando el rendimiento de las consultas.

**Uso Práctico:**
Se utilizan para optimizar el rendimiento de consultas frecuentes y garantizar un acceso rápido a los datos en tablas grandes.

#### Diseño y Optimización de Índices

**Definición:**
El diseño de índices implica la selección estratégica de columnas y tipos de índices para maximizar el rendimiento de las consultas más frecuentes.

**Uso Práctico:**
Se emplea para mejorar el rendimiento de búsquedas, ordenamientos y joins frecuentes en la aplicación.

**Ejemplo en TechShop:**
Implementamos índices estratégicos para optimizar las consultas más comunes en nuestra plataforma.

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_productos_codigo 
ON productos(codigo);

-- Índice compuesto para optimizar búsquedas de ventas
CREATE INDEX idx_ventas_fecha_producto 
ON ventas(fecha_venta, producto_id);

-- Índice para búsquedas por categoría y precio
CREATE INDEX idx_productos_categoria_precio
ON productos(categoria_id, precio);

-- Índice para búsquedas de inventario
CREATE INDEX idx_productos_stock
ON productos(stock_actual)
WHERE stock_actual > 0;
```

### 4. Vistas

**Definición:**
Las vistas son consultas SQL almacenadas que se comportan como tablas virtuales, proporcionando una capa de abstracción sobre los datos subyacentes.

**Uso Práctico:**
Se utilizan para simplificar consultas complejas, implementar seguridad a nivel de datos y proporcionar interfaces consistentes para acceder a la información.

#### Implementación y Uso de Vistas

**Definición:**
Las vistas pueden ser simples o materializadas, y se utilizan para encapsular lógica de negocio compleja en consultas reutilizables.

**Uso Práctico:**
Se emplean para crear capas de abstracción, simplificar el acceso a datos y mejorar la seguridad y mantenibilidad del código.

**Ejemplo en TechShop:**
Utilizamos vistas para simplificar el acceso a información frecuentemente consultada.

```sql
-- Vista para resumen de inventario
CREATE VIEW resumen_inventario AS
SELECT p.nombre, 
       p.codigo, 
       p.precio,
       p.stock_actual,
       c.nombre_categoria,
       (SELECT COUNT(*) 
        FROM ventas v 
        WHERE v.producto_id = p.id 
        AND v.fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
       ) as ventas_ultimo_mes
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

-- Vista para análisis de rendimiento de productos
CREATE VIEW analisis_productos AS
SELECT p.nombre,
       p.codigo,
       COUNT(v.id) as total_ventas,
       SUM(v.cantidad) as unidades_vendidas,
       AVG(v.cantidad * p.precio) as valor_promedio_venta
FROM productos p
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, p.codigo;
```

### 5. Transacciones

**Definición:**
Las transacciones son unidades de trabajo que agrupan una o más operaciones SQL, garantizando la integridad y consistencia de los datos mediante las propiedades ACID.

**Uso Práctico:**
Se utilizan para mantener la consistencia de los datos en operaciones que involucran múltiples cambios relacionados en la base de datos.

#### Gestión de Transacciones y Control de Concurrencia

**Definición:**
La gestión de transacciones implica el uso de BEGIN, COMMIT y ROLLBACK para controlar la ejecución de operaciones y manejar errores de manera segura.

**Uso Práctico:**
Se emplea para garantizar la integridad de los datos en operaciones críticas como procesamiento de pedidos y actualizaciones de inventario.

**Ejemplo en TechShop:**
Implementamos transacciones para gestionar operaciones críticas de negocio.

```sql
-- Transacción para procesar una venta
BEGIN;

DECLARE @stock_actual INT;
SELECT @stock_actual = stock_actual 
FROM productos 
WHERE id = @producto_id;

IF @stock_actual >= @cantidad_venta
BEGIN
    -- Actualizar stock
    UPDATE productos
    SET stock_actual = stock_actual - @cantidad_venta
    WHERE id = @producto_id;

    -- Registrar venta
    INSERT INTO ventas (producto_id, cantidad, fecha_venta)
    VALUES (@producto_id, @cantidad_venta, CURRENT_TIMESTAMP);

    COMMIT;
END
ELSE
BEGIN
    ROLLBACK;
    RAISERROR ('Stock insuficiente', 16, 1);
END

-- Transacción para actualización masiva de precios
BEGIN;

SAVEPOINT actualizacion_precios;

UPDATE productos
SET precio = precio * 1.1
WHERE categoria_id IN (
    SELECT id 
    FROM categorias 
    WHERE nombre_categoria = 'Electrónicos'
);

IF @@ROWCOUNT > 100
BEGIN
    ROLLBACK TO actualizacion_precios;
    RAISERROR ('Demasiados productos afectados', 16, 1);
END
ELSE
    COMMIT;
```