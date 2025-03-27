# SQL - Nivel Avanzado

## Competencias Clave

### 1. Joins y Operaciones de Conjuntos Avanzadas

**Definición:**
Los joins avanzados y operaciones de conjuntos son técnicas que permiten combinar y manipular datos de múltiples tablas de manera sofisticada, incluyendo CROSS JOIN, SELF JOIN y operaciones de conjuntos como UNION, INTERSECT y EXCEPT.

**Uso Práctico:**
Se utilizan para realizar análisis complejos que requieren relacionar datos de múltiples fuentes o realizar comparaciones entre diferentes conjuntos de resultados.

#### Joins Avanzados

**Definición:**
Los joins avanzados incluyen técnicas como CROSS JOIN para productos cartesianos y SELF JOIN para relaciones jerárquicas, permitiendo consultas sofisticadas entre tablas.

**Uso Práctico:**
Se emplean para análisis de datos complejos, reportes comparativos y relaciones jerárquicas dentro de la misma tabla.

**Ejemplo en TechShop:**
En TechShop, utilizamos joins avanzados para analizar relaciones entre productos similares y encontrar patrones de compra entre productos relacionados.

```sql
-- Self Join para encontrar productos similares
SELECT p1.nombre as producto,
       p2.nombre as producto_similar,
       p1.precio,
       p2.precio,
       c.nombre_categoria
FROM productos p1
JOIN productos p2 ON p1.categoria_id = p2.categoria_id
JOIN categorias c ON p1.categoria_id = c.id
WHERE p1.id < p2.id
AND ABS(p1.precio - p2.precio) < 100
ORDER BY c.nombre_categoria, p1.nombre;
```

#### Operaciones de Conjuntos

**Definición:**
Las operaciones de conjuntos como UNION, INTERSECT y EXCEPT permiten combinar o comparar resultados de múltiples consultas de manera eficiente.

**Uso Práctico:**
Se utilizan para consolidar datos de diferentes fuentes, identificar elementos comunes o diferencias entre conjuntos de resultados.

**Ejemplo en TechShop:**
Implementamos operaciones de conjuntos para analizar patrones de ventas y comportamiento de clientes en diferentes períodos.

```sql
-- Análisis comparativo de ventas entre períodos
SELECT p.nombre,
       SUM(v.cantidad) as total_ventas,
       'Este Mes' as periodo
FROM productos p
JOIN ventas v ON p.id = v.producto_id
WHERE fecha_venta >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY p.nombre

UNION ALL

SELECT p.nombre,
       SUM(v.cantidad),
       'Mes Anterior'
FROM productos p
JOIN ventas v ON p.id = v.producto_id
WHERE fecha_venta >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
AND fecha_venta < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY p.nombre
ORDER BY nombre, periodo;
```

### 2. Procedimientos Almacenados y Funciones

**Definición:**
Los procedimientos almacenados y funciones son bloques de código SQL reutilizables que encapsulan lógica de negocio compleja y pueden ser llamados desde cualquier parte de la aplicación.

**Uso Práctico:**
Se utilizan para centralizar la lógica de negocio, mejorar la seguridad y reducir el tráfico entre el cliente y el servidor.

#### Procedimientos Almacenados

**Definición:**
Los procedimientos almacenados son bloques de código SQL precompilados que pueden aceptar parámetros, realizar operaciones complejas y retornar resultados.

**Uso Práctico:**
Se utilizan para encapsular lógica de negocio compleja, mejorar la seguridad y optimizar el rendimiento de operaciones frecuentes.

**Ejemplo en TechShop:**
En TechShop, implementamos procedimientos almacenados para gestionar el inventario y procesar pedidos de manera segura y eficiente, manteniendo un registro detallado de todas las transacciones.

```sql
-- Procedimiento para procesar un nuevo pedido
CREATE PROCEDURE procesar_pedido(
    p_cliente_id INT,
    p_producto_id INT,
    p_cantidad INT,
    OUT p_pedido_id INT,
    OUT p_estado VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar stock disponible
    IF NOT EXISTS (
        SELECT 1 FROM productos
        WHERE id = p_producto_id
        AND stock_actual >= p_cantidad
    ) THEN
        p_estado := 'Stock insuficiente';
        RETURN;
    END IF;

    -- Iniciar transacción
    BEGIN
        -- Crear nuevo pedido
        INSERT INTO pedidos (cliente_id, fecha_creacion, estado)
        VALUES (p_cliente_id, CURRENT_TIMESTAMP, 'PENDIENTE')
        RETURNING id INTO p_pedido_id;

        -- Agregar detalle del pedido
        INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario)
        SELECT p_pedido_id, p_producto_id, p_cantidad, precio
        FROM productos
        WHERE id = p_producto_id;

        -- Actualizar inventario
        UPDATE productos
        SET stock_actual = stock_actual - p_cantidad,
            ultima_venta = CURRENT_TIMESTAMP
        WHERE id = p_producto_id;

        -- Registrar movimiento de inventario
        INSERT INTO movimientos_inventario
        (producto_id, cantidad, tipo_movimiento, pedido_id, fecha)
        VALUES (p_producto_id, p_cantidad, 'VENTA', p_pedido_id, CURRENT_TIMESTAMP);

        p_estado := 'Pedido procesado exitosamente';
        COMMIT;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        p_estado := 'Error al procesar pedido: ' || SQLERRM;
    END;
END;
$$;
```

#### Funciones

**Definición:**
Las funciones son bloques de código SQL que realizan cálculos específicos y retornan un valor o conjunto de resultados, permitiendo su uso en consultas y expresiones.

**Uso Práctico:**
Se emplean para encapsular lógica de cálculo compleja, transformar datos y crear operaciones reutilizables que pueden ser parte de consultas más grandes.

**Ejemplo en TechShop:**
En TechShop, utilizamos funciones para realizar cálculos de métricas de ventas, análisis de inventario y evaluación de rendimiento de productos.

```sql
-- Función para calcular métricas de producto
CREATE FUNCTION calcular_metricas_producto(
    p_producto_id INT,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    total_ventas DECIMAL(10,2),
    promedio_unidades_por_venta DECIMAL(10,2),
    dias_sin_stock INT,
    rotacion_inventario DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_periodo AS (
        SELECT 
            SUM(pd.cantidad * pd.precio_unitario) as total_ventas,
            AVG(pd.cantidad) as promedio_unidades,
            COUNT(DISTINCT p.id) as total_pedidos
        FROM pedidos p
        JOIN pedidos_detalle pd ON p.id = pd.pedido_id
        WHERE pd.producto_id = p_producto_id
        AND p.fecha_creacion BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    stock_diario AS (
        SELECT 
            COUNT(*) as dias_sin_stock
        FROM generate_series(
            p_fecha_inicio,
            p_fecha_fin,
            '1 day'::interval
        ) fecha
        WHERE NOT EXISTS (
            SELECT 1
            FROM movimientos_inventario mi
            WHERE mi.producto_id = p_producto_id
            AND mi.fecha::date <= fecha
            GROUP BY mi.producto_id
            HAVING SUM(CASE WHEN tipo_movimiento = 'ENTRADA' THEN cantidad
                          WHEN tipo_movimiento = 'SALIDA' THEN -cantidad
                     END) > 0
        )
    )
    SELECT 
        vp.total_ventas,
        vp.promedio_unidades,
        sd.dias_sin_stock,
        CASE 
            WHEN p.stock_promedio > 0 THEN
                vp.total_ventas / NULLIF(p.stock_promedio, 0)
            ELSE 0
        END as rotacion_inventario
    FROM ventas_periodo vp
    CROSS JOIN stock_diario sd
    CROSS JOIN (
        SELECT AVG(stock_actual) as stock_promedio
        FROM productos
        WHERE id = p_producto_id
    ) p;
END;
$$;
```

### 3. Subconsultas Avanzadas

**Definición:**
Las subconsultas avanzadas son consultas anidadas que permiten realizar operaciones complejas y análisis de datos en múltiples niveles, incluyendo correlación entre consultas internas y externas.

**Uso Práctico:**
Se utilizan para realizar análisis de datos complejos, filtrar resultados basados en agregaciones y crear consultas dinámicas que dependen de resultados intermedios.

#### Subconsultas Correlacionadas

**Definición:**
Las subconsultas correlacionadas son consultas anidadas que hacen referencia a columnas de la consulta externa, permitiendo filtrar o calcular resultados basados en relaciones entre ambas consultas.

**Uso Práctico:**
Se emplean para realizar comparaciones registro por registro, encontrar patrones complejos y analizar datos relacionados entre diferentes niveles de agregación.

**Ejemplo en TechShop:**
Utilizamos subconsultas correlacionadas para analizar el rendimiento de productos y detectar patrones de compra inusuales.

```sql
-- Identificar productos con ventas superiores al promedio de su categoría
SELECT 
    p.nombre as producto,
    c.nombre_categoria,
    COUNT(v.id) as total_ventas,
    (
        SELECT AVG(ventas_por_producto)
        FROM (
            SELECT COUNT(v2.id) as ventas_por_producto
            FROM productos p2
            LEFT JOIN ventas v2 ON p2.id = v2.producto_id
            WHERE p2.categoria_id = p.categoria_id
            GROUP BY p2.id
        ) subconsulta
    ) as promedio_categoria
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, c.nombre_categoria
HAVING COUNT(v.id) > (
    SELECT AVG(ventas_por_producto)
    FROM (
        SELECT COUNT(v2.id) as ventas_por_producto
        FROM productos p2
        LEFT JOIN ventas v2 ON p2.id = v2.producto_id
        WHERE p2.categoria_id = p.categoria_id
        GROUP BY p2.id
    ) subconsulta
)
ORDER BY c.nombre_categoria, total_ventas DESC;

-- Análisis de tendencias de compra por cliente
SELECT 
    c.nombre as cliente,
    p.nombre as producto,
    COUNT(v.id) as frecuencia_compra,
    (
        SELECT AVG(cantidad)
        FROM ventas v2
        WHERE v2.cliente_id = c.id
        AND v2.producto_id = p.id
    ) as cantidad_promedio,
    (
        SELECT MAX(fecha_venta)
        FROM ventas v3
        WHERE v3.cliente_id = c.id
        AND v3.producto_id = p.id
    ) as ultima_compra
FROM clientes c
JOIN ventas v ON c.id = v.cliente_id
JOIN productos p ON v.producto_id = p.id
GROUP BY c.id, c.nombre, p.id, p.nombre
HAVING COUNT(v.id) > 3
ORDER BY frecuencia_compra DESC;
```

### 4. Optimización de Rendimiento

**Definición:**
La optimización de rendimiento en SQL implica técnicas y estrategias para mejorar la velocidad y eficiencia de las consultas, incluyendo el uso adecuado de índices, análisis de planes de ejecución y optimización de consultas complejas.

**Uso Práctico:**
Se utiliza para mejorar el tiempo de respuesta de las consultas, reducir el consumo de recursos y mantener un rendimiento óptimo en aplicaciones con grandes volúmenes de datos.

#### Índices y Planes de Ejecución

**Definición:**
Los índices son estructuras de datos que mejoran la velocidad de recuperación de datos, mientras que los planes de ejecución muestran cómo el motor de base de datos procesa una consulta.

**Uso Práctico:**
Se emplean para optimizar el rendimiento de consultas frecuentes, analizar y mejorar el comportamiento de consultas complejas.

**Ejemplo en TechShop:**
Implementamos una estrategia de indexación para optimizar las búsquedas de productos y el análisis de ventas.

```sql
-- Crear índices estratégicos
CREATE INDEX idx_productos_categoria
ON productos (categoria_id)
INCLUDE (nombre, precio, stock_actual);

CREATE INDEX idx_ventas_fecha
ON ventas (fecha_venta)
INCLUDE (producto_id, cantidad);

-- Analizar plan de ejecución de consulta frecuente
EXPLAIN ANALYZE
SELECT 
    c.nombre_categoria,
    COUNT(DISTINCT p.id) as total_productos,
    SUM(v.cantidad) as unidades_vendidas,
    AVG(p.precio) as precio_promedio
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
LEFT JOIN ventas v ON p.id = v.producto_id
WHERE v.fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.id, c.nombre_categoria
HAVING COUNT(DISTINCT p.id) > 5;
```

### 5. Common Table Expressions (CTEs)

**Definición:**
Las Common Table Expressions (CTEs) son consultas temporales nombradas que pueden ser referenciadas múltiples veces dentro de una consulta principal, permitiendo escribir consultas más legibles y mantenibles.

**Uso Práctico:**
Se utilizan para simplificar consultas complejas, implementar consultas recursivas y mejorar la legibilidad del código SQL.

#### CTEs Recursivas

**Definición:**
Las CTEs recursivas son expresiones de tabla común que se referencian a sí mismas, permitiendo trabajar con estructuras de datos jerárquicas y realizar cálculos iterativos.

**Uso Práctico:**
Se emplean para navegar por estructuras jerárquicas, calcular series numéricas y resolver problemas que requieren iteración.

**Ejemplo en TechShop:**
Utilizamos CTEs recursivas para analizar categorías jerárquicas de productos y calcular descuentos acumulados.

```sql
-- Análisis de categorías jerárquicas
WITH RECURSIVE categoria_jerarquia AS (
    -- Caso base: categorías principales
    SELECT 
        id,
        nombre_categoria,
        categoria_padre_id,
        1 as nivel,
        ARRAY[nombre_categoria] as ruta
    FROM categorias
    WHERE categoria_padre_id IS NULL

    UNION ALL

    -- Caso recursivo: subcategorías
    SELECT 
        c.id,
        c.nombre_categoria,
        c.categoria_padre_id,
        ch.nivel + 1,
        ch.ruta || c.nombre_categoria
    FROM categorias c
    JOIN categoria_jerarquia ch ON c.categoria_padre_id = ch.id
)
SELECT 
    ruta,
    nivel,
    (
        SELECT COUNT(*)
        FROM productos p
        WHERE p.categoria_id = categoria_jerarquia.id
    ) as total_productos
FROM categoria_jerarquia
ORDER BY ruta;

-- Cálculo de descuentos acumulados
WITH RECURSIVE descuentos_acumulados AS (
    -- Caso base: primer nivel de descuento
    SELECT 
        producto_id,
        cantidad,
        precio_unitario,
        1 as nivel_descuento,
        CASE 
            WHEN cantidad >= 10 THEN 0.05
            ELSE 0
        END as descuento
    FROM pedidos_detalle
    WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '90 days'

    UNION ALL

    -- Caso recursivo: niveles adicionales de descuento
    SELECT 
        da.producto_id,
        da.cantidad,
        da.precio_unitario,
        da.nivel_descuento + 1,
        da.descuento + 
        CASE 
            WHEN da.cantidad >= (10 * da.nivel_descuento) THEN 0.02
            ELSE 0
        END
    FROM descuentos_acumulados da
    WHERE da.nivel_descuento < 5
    AND da.cantidad >= (10 * da.nivel_descuento)
)
SELECT 
    p.nombre as producto,
    d.cantidad,
    d.precio_unitario,
    d.descuento as descuento_maximo,
    ROUND(d.precio_unitario * (1 - d.descuento), 2) as precio_final
FROM descuentos_acumulados d
JOIN productos p ON d.producto_id = p.id
WHERE d.nivel_descuento = (
    SELECT MAX(nivel_descuento)
    FROM descuentos_acumulados d2
    WHERE d2.producto_id = d.producto_id
)
ORDER BY d.descuento DESC;
```
```
```

### 3. Subconsultas Avanzadas

**Definición:**
Las subconsultas avanzadas son consultas anidadas que pueden referenciar la consulta exterior y utilizar operadores complejos para filtrar y transformar datos.

**Uso Práctico:**
Se emplean para resolver problemas complejos que requieren múltiples niveles de filtrado y comparación de datos.

#### Subconsultas Correlacionadas

**Definición:**
Las subconsultas correlacionadas son consultas anidadas que hacen referencia a columnas de la consulta exterior, permitiendo realizar comparaciones y filtrados basados en relaciones entre ambas consultas.

**Uso Práctico:**
Se utilizan para realizar análisis comparativos, encontrar registros que cumplan condiciones complejas y realizar cálculos basados en múltiples niveles de datos.

**Ejemplo en TechShop:**
En TechShop, utilizamos subconsultas correlacionadas para analizar el rendimiento de ventas por producto y categoría, identificando productos destacados y patrones de compra.

```sql
-- Productos con ventas superiores a su categoría
SELECT p.nombre,
       c.nombre_categoria,
       p.precio,
       (SELECT AVG(cantidad)
        FROM ventas v
        WHERE v.producto_id = p.id) as promedio_ventas
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE (SELECT AVG(cantidad)
       FROM ventas v
       WHERE v.producto_id = p.id) >
      (SELECT AVG(cantidad)
       FROM ventas v
       JOIN productos p2 ON v.producto_id = p2.id
       WHERE p2.categoria_id = p.categoria_id);

-- Clientes que han comprado todos los productos de una categoría
SELECT c.nombre
FROM clientes c
WHERE NOT EXISTS (
    SELECT p.id
    FROM productos p
    WHERE p.categoria_id = 1
    AND NOT EXISTS (
        SELECT 1
        FROM ventas v
        WHERE v.cliente_id = c.id
        AND v.producto_id = p.id
    )
);
```

### 4. Optimización de Rendimiento y Query

**Definición:**
La optimización de rendimiento implica el análisis y mejora del plan de ejecución de consultas para maximizar la eficiencia y velocidad de las operaciones de base de datos.

**Uso Práctico:**
Se utiliza para mejorar el tiempo de respuesta de consultas complejas y reducir el consumo de recursos del servidor.

#### Análisis y Optimización de Planes de Ejecución

**Definición:**
El análisis de planes de ejecución es una técnica que permite entender cómo el motor de base de datos procesa y ejecuta las consultas, identificando cuellos de botella y oportunidades de mejora.

**Uso Práctico:**
Se emplea para optimizar consultas críticas, crear índices efectivos y mejorar el rendimiento general de la base de datos.

**Ejemplo en TechShop:**
En TechShop, utilizamos el análisis de planes de ejecución para optimizar consultas frecuentes de búsqueda de productos y análisis de ventas, mejorando significativamente los tiempos de respuesta.

```sql
-- Análisis del plan de ejecución
EXPLAIN ANALYZE
SELECT c.nombre_categoria,
       COUNT(DISTINCT v.cliente_id) as total_clientes,
       SUM(v.cantidad * p.precio) as ventas_totales
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
JOIN ventas v ON p.id = v.producto_id
WHERE v.fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.nombre_categoria
HAVING COUNT(DISTINCT v.cliente_id) > 10;

-- Optimización con índices y hints
SELECT /*+ INDEX(ventas idx_ventas_fecha) */
       p.nombre,
       SUM(v.cantidad) as total_vendido
FROM productos p
JOIN ventas v ON p.id = v.producto_id
WHERE v.fecha_venta BETWEEN :fecha_inicio AND :fecha_fin
GROUP BY p.nombre;
```

### 5. Expresiones de Tabla Común (CTEs)

**Definición:**
Las CTEs son consultas temporales nombradas que pueden ser referenciadas múltiples veces dentro de una consulta principal, mejorando la legibilidad y mantenibilidad del código.

**Uso Práctico:**
Se utilizan para simplificar consultas complejas y realizar cálculos recursivos.

**Ejemplo en TechShop:**
Implementamos CTEs para análisis jerárquico y consultas complejas.

```sql
-- CTE para análisis de tendencias de ventas
WITH ventas_mensuales AS (
    SELECT DATE_TRUNC('month', fecha_venta) as mes,
           producto_id,
           SUM(cantidad) as total_ventas
    FROM ventas
    GROUP BY DATE_TRUNC('month', fecha_venta), producto_id
),
comparacion_mensual AS (
    SELECT mes,
           producto_id,
           total_ventas,
           LAG(total_ventas) OVER (PARTITION BY producto_id ORDER BY mes) as ventas_mes_anterior
    FROM ventas_mensuales
)
SELECT p.nombre,
       cm.mes,
       cm.total_ventas,
       ROUND(((cm.total_ventas - cm.ventas_mes_anterior)::float / 
              NULLIF(cm.ventas_mes_anterior, 0) * 100), 2) as variacion_porcentual
FROM comparacion_mensual cm
JOIN productos p ON cm.producto_id = p.id
WHERE cm.ventas_mes_anterior IS NOT NULL;

-- CTE recursiva para jerarquía de categorías
WITH RECURSIVE jerarquia_categorias AS (
    SELECT id, nombre_categoria, categoria_padre_id, 1 as nivel
    FROM categorias
    WHERE categoria_padre_id IS NULL
    UNION ALL
    SELECT c.id, c.nombre_categoria, c.categoria_padre_id, jc.nivel + 1
    FROM categorias c
    JOIN jerarquia_categorias jc ON c.categoria_padre_id = jc.id
)
SELECT LPAD(' ', (nivel - 1) * 2) || nombre_categoria as categoria_jerarquica,
       nivel
FROM jerarquia_categorias
ORDER BY nivel, nombre_categoria;
```

### 6. Funciones de Ventana

**Definición:**
Las funciones de ventana permiten realizar cálculos a través de un conjunto de filas relacionadas con la fila actual, incluyendo funciones como ROW_NUMBER, RANK, DENSE_RANK, LEAD y LAG.

**Uso Práctico:**
Se utilizan para realizar análisis comparativos, rankings y cálculos secuenciales sobre conjuntos de datos.

**Ejemplo en TechShop:**
Implementamos funciones de ventana para análisis avanzado de ventas y productos.

```sql
-- Ranking de productos por ventas
SELECT p.nombre,
       c.nombre_categoria,
       SUM(v.cantidad) as total_ventas,
       ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY SUM(v.cantidad) DESC) as ranking_categoria,
       RANK() OVER (ORDER BY SUM(v.cantidad) DESC) as ranking_general
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, c.id, c.nombre_categoria;

-- Análisis de tendencias con funciones de ventana
SELECT p.nombre,
       DATE_TRUNC('month', v.fecha_venta) as mes,
       SUM(v.cantidad) as ventas_mes,
       LAG(SUM(v.cantidad)) OVER (PARTITION BY p.id ORDER BY DATE_TRUNC('month', v.fecha_venta)) as ventas_mes_anterior,
       LEAD(SUM(v.cantidad)) OVER (PARTITION BY p.id ORDER BY DATE_TRUNC('month', v.fecha_venta)) as ventas_mes_siguiente
FROM productos p
JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, DATE_TRUNC('month', v.fecha_venta)
ORDER BY p.nombre, mes;
```

### 7. Integridad de Datos y Restricciones

**Definición:**
La integridad de datos se refiere a la precisión, consistencia y confiabilidad de los datos en una base de datos, implementada mediante restricciones como PRIMARY KEY, FOREIGN KEY y CHECK.

**Uso Práctico:**
Se utiliza para garantizar la calidad de los datos y mantener la consistencia en las operaciones de la base de datos.

**Ejemplo en TechShop:**
Implementamos restricciones para mantener la integridad de los datos.

```sql
-- Definición de restricciones en tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) CHECK (precio > 0),
    stock_actual INT CHECK (stock_actual >= 0),
    stock_minimo INT CHECK (stock_minimo >= 0),
    categoria_id INT REFERENCES categorias(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado CHAR(1) CHECK (estado IN ('A','I')),
    CONSTRAINT stock_check CHECK (stock_actual >= stock_minimo)
);

-- Trigger para validación de integridad
CREATE TRIGGER validar_stock_venta
BEFORE INSERT OR UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION validar_stock();

CREATE FUNCTION validar_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM productos
        WHERE id = NEW.producto_id
        AND stock_actual >= NEW.cantidad
    ) THEN
        RAISE EXCEPTION 'Stock insuficiente';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 8. Prepared Statements

**Definición:**
Los Prepared Statements son consultas SQL parametrizadas que se compilan una vez y pueden ejecutarse múltiples veces con diferentes valores de parámetros.

**Uso Práctico:**
Se utilizan para mejorar el rendimiento de consultas frecuentes y prevenir ataques de inyección SQL.

**Ejemplo en TechShop:**
Implementamos Prepared Statements para operaciones comunes.

```sql
-- Prepared Statement para búsqueda de productos
PREPARE buscar_productos(varchar, int) AS
SELECT p.nombre,
       p.precio,
       p.stock_actual
FROM productos p
WHERE p.nombre ILIKE $1
AND p.categoria_id = $2;

EXECUTE buscar_productos('%laptop%', 1);

-- Prepared Statement para inserción de ventas
PREPARE insertar_venta(int, int, int, decimal) AS
INSERT INTO ventas (cliente_id, producto_id, cantidad, precio_unitario)
VALUES ($1, $2, $3, $4);

EXECUTE insertar_venta(1, 100, 2, 599.99);

-- Deallocate cuando ya no se necesite
DEALLOCATE buscar_productos;
DEALLOCATE insertar_venta;
```