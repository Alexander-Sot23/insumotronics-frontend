# Insumotronics Frontend - Dashboard de Gestión de Productos

[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-blueviolet)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.14-orange)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.15-000000)](https://axios-http.com/)

Una interfaz de usuario moderna y responsive para gestionar productos, carritos de compra y reservas. Construida con React 19, Vite y Tailwind CSS, ofrece una experiencia de usuario intuitiva para estudiantes y administradores.

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Páginas y Funcionalidades](#páginas-y-funcionalidades)
- [Componentes](#componentes)
- [Servicios](#servicios)
- [Context API](#context-api)
- [Autenticación](#autenticación)
- [Estilos](#estilos)
- [Configuración de Desarrollo](#configuración-de-desarrollo)
- [Variables de Entorno](#variables-de-entorno)
- [Build para Producción](#build-para-producción)

## Características Principales

- **Autenticación JWT**: Sistema seguro con tokens almacenados localmente
- **Control de Acceso Basado en Roles**: Interfaces diferenciadas para STUDENT y ADMIN
- **Cuadro de Mandos Inteligente**: Estadísticas personalizadas según el rol del usuario
- **Gestión de Productos**: Visualización, búsqueda y filtrado de productos
- **Carrito de Compras**: Sistema dinámico con actualización de cantidades y totales
- **Sistema de Reservas**: Historial completo de reservas con filtrado por estado
- **Gestión de Inventario (ADMIN)**: Crear, editar y eliminar productos con carga de archivos
- **Gestión de Pedidos (ADMIN)**: Supervisar y gestionar reservas de usuarios
- **Perfil de Usuario**: Visualización y gestión de información personal
- **Responsive Design**: Interface adaptada a dispositivos móviles, tablets y desktops
- **Alertas Interactivas**: Notificaciones con SweetAlert2
- **Interceptores de API**: Manejo automático de errores y renovación de sesiones
- **Navegación Intuitiva**: Menú responsive con activos visuales de ruta

## Tecnologías Utilizadas

### Frontend Framework
- **React 19.2.4**: Librería de interfaz para construir componentes
- **Vite 8.0**: Build tool moderno y rápido
- **React Router DOM 7.14**: Enrutamiento y navegación

### Estilos y UI
- **Tailwind CSS 4.2**: Framework de CSS utility-first
- **Lucide React 1.8**: Librería de iconos SVG
- **SweetAlert2 11.26**: Diálogos y notificaciones hermosas
- **PostCSS 8.5**: Herramienta de transformación de CSS
- **Autoprefixer 10.5**: Añade prefijos de navegador automáticamente

### HTTP y API
- **Axios 1.15**: Cliente HTTP para comunicación con backend
- **Interceptores Axios**: Manejo centralizado de autenticación y errores

### Development
- **ESLint 9.39**: Linting de código
- **Node.js (LTS recomendado)**: Runtime de JavaScript

## Requisitos Previos

- **Node.js 16.0.0+** (preferiblemente LTS)
- **npm 8.0.0+** o **yarn 3.0+**
- **Git** para control de versiones
- **Backend corriendo** en `http://localhost:8080`

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Alexander-Sot23/insumotronics.git
cd insumotronics/insumotronics-frontend
```

### 2. Instalar Dependencias

```bash
npm install
# o si prefieres yarn
yarn install
```

### 3. Configurar Variables de Entorno

El proyecto usa la configuración automática del API basada en el hostname. Crea un archivo `.env.local` si necesitas override:

```properties
# .env.local (opcional)
VITE_API_URL=http://localhost:8080
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre tu navegador en: `http://localhost:5173`

### 5. Build para Producción

```bash
npm run build
# o
yarn build
```

Los archivos compilados estarán en la carpeta `dist/`

## Estructura del Proyecto

```
insumotronics-frontend/
├── src/
│   ├── pages/                          # Páginas principales
│   │   ├── Home.jsx                   # Dashboard principal
│   │   ├── Inventory.jsx              # Catálogo de productos
│   │   ├── ProductDetails.jsx         # Detalles de producto
│   │   ├── Profile.jsx                # Perfil del usuario
│   │   ├── Login.jsx                  # Formulario de login
│   │   ├── ManageInventory.jsx        # Gestión de productos (ADMIN)
│   │   └── ManageOrders.jsx           # Gestión de pedidos (ADMIN)
│   ├── components/                     # Componentes reutilizables
│   │   ├── Navbar.jsx                 # Barra de navegación
│   │   ├── ProtectedRoute.jsx         # Wrapper para rutas protegidas
│   │   └── ProductImage.jsx           # Galería de imágenes
│   ├── services/                       # Servicios de API
│   │   ├── inventoryService.js        # Llamadas para inventario
│   │   └── userService.js             # Llamadas de usuarios
│   ├── context/                        # Context API
│   │   └── AuthContext.jsx            # Autenticación y estado global
│   ├── api/
│   │   └── client.js                  # Configuración de Axios
│   ├── assets/                         # Imágenes y recursos estáticos
│   │   └── *.png, *.jpg               # Logos y banners
│   ├── App.jsx                         # Componente raíz
│   ├── main.jsx                        # Punto de entrada
│   └── index.css                       # Estilos globales
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── package.json                        # Dependencias y scripts
├── vite.config.js                      # Configuración de Vite
├── eslint.config.js                    # Configuración de ESLint
└── README.md                           # Este archivo
```

## Páginas y Funcionalidades

### **Home Dashboard** (`/home`)

Página principal adaptada según el rol del usuario.

**Para ESTUDIANTES/PROFESORES:**
- Estadísticas personales (productos disponibles, mis reservas, pendientes de recoger)
- Historial de solicitudes activas
- Botón directo para crear nuevo pedido
- Banner institucional con redes sociales

**Para ADMIN:**
- Estadísticas globales (inventario total, total de reservas)
- Indicador del estado del sistema
- Actividad global de todas las reservas
- Gráficos y métricas de rendimiento

### **Inventario** (`/inventory`)

Catálogo completo de productos disponibles.

**Funcionalidades:**
- Visualización de todos los productos con paginación
- Búsqueda en tiempo real por nombre
- Filtrado por categoría
- Vista en grid de productos
- Información: precio, stock, categoría
- Acceso a detalles de productos
- Agregar productos al carrito

### **Detalles del Producto** (`/product/:id`)

Página individual de cada producto.

**Detalles mostrados:**
- Galería de imágenes del producto
- Nombre y descripción completa
- Precio y stock disponible
- Categoría y especificaciones
- Documentos descargables (PDF)
- Cantidad a solicitar
- Botón para agregar al carrito

### **Perfil de Usuario** (`/profile`)

Información personal del usuario autenticado.

**Secciones:**
- Datos personales (nombre, apellido, código)
- Información académica (carrera, grado, nivel académico)
- Email y estado de cuenta
- Última fecha de acceso
- Opción para cambiar contraseña

### **Gestionar Inventario** (`/manage-inventory`) - Solo ADMIN

Interfaz administrativa para gestionar productos.

**Funcionalidades:**
- Tabla de todos los productos
- Crear nuevo producto con formulario
- Editar productos existentes
- Cargar imágenes y documentos
- Eliminar productos
- Búsqueda y filtrado avanzado
- Vista previa de cambios

### **Gestionar Pedidos** (`/manage-orders`) - Solo ADMIN

Supervisión de todas las reservas de usuarios.

**Funcionalidades:**
- Tabla de reservas con filtros
- Visualizar estado de cada reserva
- Detalles de items en reserva
- Filtrar por estado (Pendiente, Confirmada, Supervisión)
- Procesar y actualizar reservas
- Generar reportes

### **Login** (`/login`)

Formulario de autenticación.

**Procesos:**
- Formulario con código de usuario y contraseña
- Validación de campos
- Integración con JWT
- Redirección automática tras login exitoso
- Manejo de errores de autenticación
- Mensajes de feedback claros

## Componentes

### **Navbar.jsx**
Barra de navegación principal con:
- Logo del sistema
- Menú de navegación diferenciado por rol
- Indicador de usuario activo
- Carrito de compras (badge con contador)
- Perfil y logout
- Menú responsive para móviles

### **ProtectedRoute.jsx**
Componente wrapper que:
- Valida autenticación antes de mostrar rutas
- Redirige a login si no está autenticado
- Verifica carga de datos de usuario
- Protege acceso a rutas administrativas

### **ProductImage.jsx**
Galería de imágenes con:
- Visualización de múltiples imágenes del producto
- Navegación entre imágenes
- Lightbox o modal expandido
- Fallback para imágenes no disponibles

## Servicios

### **inventoryService.js**

Gestiona todas las llamadas relacionadas con productos:

```javascript
// Obtener productos
getAllProducts(role, page, size, sort)
getProductById(role, id)
searchByName(role, name, page, size)

// Estadísticas
getDashboardStats()          // Stats globales (ADMIN)
getStudentStats(userId)      // Stats personales

// Reservas
getRecentReserves(page, size)
getUserHistory(userId, page, size)
getActiveReserves(userId)

// Operaciones CRUD (ADMIN)
createProduct(productData, images, documents)
updateProduct(id, productData, images, documents)
deleteProduct(id)
```

### **userService.js**

Gestiona información de usuarios:

```javascript
getUserByCode(role, code)    // Obtener usuario por código
getUserById(id)               // Obtener usuario por ID
getAllUsers(page, size)       // Listar usuarios (ADMIN)
```

## Context API

### **AuthContext.jsx**

Proporciona estado global de autenticación:

```javascript
const { 
  user,              // Datos del usuario autenticado
  loading,           // Estado de carga
  isAuthenticated,   // Boolean de autenticación
  login,             // Función para iniciar sesión
  logout             // Función para cerrar sesión
} = useAuth()
```

**Estructura del usuario:**
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Juan",
  lastname: "Pérez",
  code: "A001",
  role: "STUDENT",
  email: "juan@example.com",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Autenticación

### Flujo de Autenticación

1. Usuario envía credenciales (código + contraseña)
2. Backend retorna datos del usuario + token JWT
3. Frontend almacena en `localStorage`
4. Token se incluye en headers de todas las peticiones
5. Si token expira (401), usuario se redirige a login

### Interceptores de Axios

```javascript
// Interceptor de petición (request)
- Agrega Authorization header con token
- Maneja FormData correctamente

// Interceptor de respuesta (response)
- Intercepta errores 401/403
- Limpia sesión y redirige a login
- Mantiene sesión de login intacta
```

## Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con:
- **Utility-first approach** para máxima flexibilidad
- **Color scheme personalizado** con tonos indigo/slate
- **Responsive design** con breakpoints: sm, md, lg, xl, 2xl
- **Componentes predefinidos** para ahorro de tiempo
- **Dark mode ready** (configuración lista)

### Estructura de Colores
```
Primario: Indigo (indigo-600)
Secundario: Slate (slate-500)
Éxito: Emerald (emerald-500)
Advertencia: Amber (amber-500)
Error: Red (red-500)
```

### Tipografía
```
Fuentes: Sans (sistema), Serif (Merriweather)
Tamaños: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
Pesos: light (300), normal (400), medium (500), bold (700)
```

## Configuración de Desarrollo

### ESLint

```bash
# Verificar código
npm run lint

# Las reglas están configuradas para React hooks y refresh
```

### Vite Config

```javascript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## Variables de Entorno

Las variables de entorno son opcionales. El sistema usa configuración automática por defecto.

```properties
# .env.local (opcional)
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

Si tienes un proxy en desarrollo, puedes configurarlo en `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```

## Build para Producción

### Compilar

```bash
npm run build
```

Genera carpeta `dist/` optimizada lista para deployment.

### Preview Local

```bash
npm run preview
```

Permite ver cómo se verá en producción localmente.

### Deployment

La carpeta `dist/` contiene archivos estáticos listos para:
- Vercel
- Netlify
- GitHub Pages
- Servidores web tradicionales (Apache, Nginx)
- Docker
- Cualquier CDN

## Responsividad

El diseño es completamente responsive:

- **Mobile (< 640px)**: Menú hamburguesa, single column
- **Tablet (640px - 1024px)**: Layout adaptado, 2 columnas
- **Desktop (> 1024px)**: Layout completo, 3+ columnas

## Conexión con Backend

**URL Base:** `http://localhost:8080`

El cliente se conecta automáticamente según el hostname del navegador. Para cambiar el host en desarrollo:

```javascript
// En src/api/client.js
const apiClient = axios.create({
  baseURL: `http://TU_HOST:8080`,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Ejemplos de Uso

### Login

```javascript
// Ir a /login
// Ingresar código: A001
// Ingresar contraseña: tuContraseña
// Se guardará en localStorage y redirigirá a /home
```

### Agregar Producto al Carrito

```javascript
// 1. Ir a /inventory
// 2. Hacer click en un producto
// 3. Ingresar cantidad deseada
// 4. Click en "Agregar al Carrito"
```

### Crear Producto (ADMIN)

```javascript
// 1. Ir a /manage-inventory
// 2. Click en "Nuevo Producto"
// 3. Llenar formulario
// 4. Seleccionar imágenes y documentos
// 5. Click en "Guardar"
```

### Realizar Checkout

```javascript
// Backend: POST /api/student/reserve/checkout?cartId=XXX
// Frontend: Click en botón "Realizar Pedido" en carrito
```

## Testing

Para testing en desarrollo:

```bash
# Verificar con ESLint
npm run lint

# Build sin errores
npm run build
```

## Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Verifica que backend esté corriendo en `http://localhost:8080`
- Configura CORS en backend si es necesario

### Token expirado
- El sistema redirige automáticamente a login
- Abre DevTools → Application → localStorage → verifica el token

### Estilos no aplican
```bash
# Regenerar Tailwind CSS
npm install
npm run dev
```

## Licencia

Distribuido bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## Autor

**Alexander Sotelo**
- GitHub: [@Alexander-Sot23](https://github.com/Alexander-Sot23)
- Email: alexandersotelo423@gmail.com

## Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Soporte

Para problemas o sugerencias, abre un issue en GitHub.

---

**Desarrollado con React para mejorar tu experiencia de usuario**
