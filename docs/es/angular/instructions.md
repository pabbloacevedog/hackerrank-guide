# Instrucciones para Crear un Proyecto en Angular

## Requisitos Previos

1. Node.js y npm
   - Instalar Node.js (versión 14.x o superior)
   - npm (viene incluido con Node.js)
   - Verificar la instalación:
     ```bash
     node --version
     npm --version
     ```

2. Angular CLI
   - Instalar globalmente:
     ```bash
     npm install -g @angular/cli
     ```
   - Verificar la instalación:
     ```bash
     ng version
     ```

## Herramientas Recomendadas

1. Visual Studio Code
   - Extensiones recomendadas:
     - Angular Language Service
     - Angular Snippets
     - TSLint
     - Prettier

2. Git (para control de versiones)

3. Chrome DevTools con Angular DevTools

## Pasos para Crear un Nuevo Proyecto

1. Crear un nuevo proyecto
   ```bash
   ng new nombre-del-proyecto
   ```
   Durante la creación, se te preguntará:
   - Si deseas agregar routing (recomendado: sí)
   - Qué formato de estilos prefieres (CSS, SCSS, etc.)

2. Navegar al directorio del proyecto
   ```bash
   cd nombre-del-proyecto
   ```

3. Iniciar el servidor de desarrollo
   ```bash
   ng serve
   ```
   El proyecto estará disponible en `http://localhost:4200`

## Estructura Básica del Proyecto

```
src/
├── app/                    # Componentes, servicios, etc.
├── assets/                 # Recursos estáticos
├── environments/           # Configuraciones por entorno
├── index.html             # Página principal
└── styles.css             # Estilos globales
```

## Comandos Útiles

1. Generar componentes
   ```bash
   ng generate component nombre-componente
   ```

2. Generar servicios
   ```bash
   ng generate service nombre-servicio
   ```

3. Generar módulos
   ```bash
   ng generate module nombre-modulo
   ```

4. Construir para producción
   ```bash
   ng build --prod
   ```

## Buenas Prácticas

1. Estructura de Carpetas
   - Organizar por funcionalidad
   - Mantener componentes relacionados juntos
   - Usar lazy loading para módulos grandes

2. Convenciones de Nombres
   - Usar kebab-case para archivos
   - Usar PascalCase para clases
   - Usar camelCase para propiedades y métodos

3. Optimización
   - Implementar lazy loading
   - Usar AOT compilation
   - Minimizar el tamaño de los bundles

## Recursos Adicionales

- [Documentación oficial de Angular](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Angular CLI Wiki](https://github.com/angular/angular-cli/wiki)