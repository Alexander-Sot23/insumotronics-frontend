# Documentacion de la API de Insumotronics

Este documento sirve como referencia para el equipo de Frontend. Detalla los endpoints del backend que estan configurados y listos para consumirse a traves de los servicios (src/services/).

Consejo para el equipo Frontend: No necesitan preocuparse por las rutas exactas, parametros o tokens al construir la UI. Simplemente importen las funciones desde los archivos Service y usenlas como promesas asincronas de JavaScript.

---

## Inventario (inventoryService.js)

Todos estos metodos se importan usando:
import inventoryService from '../services/inventoryService';

### Productos

- getAllProducts(role, page, size, sort)
  - Uso: Obtiene la lista paginada de todos los productos.
  - Parametros: role (String: ADMIN/STUDENT/TEACHER), page (Number), size (Number), sort (String).
  - Endpoints reales: GET /api/admin/product o GET /api/student/product

- getProductById(role, id)
  - Uso: Obtiene los detalles de un producto especifico.
  - Endpoints reales: GET /api/admin/product/id o GET /api/student/product/id

- searchByName(role, name, page, size)
  - Uso: Busca productos por nombre.
  - Endpoints reales: GET /api/admin/product/name o GET /api/student/product/name

- createProduct(productData, images, documents, onUploadProgress)
  - Uso: Crea un nuevo componente en el sistema subiendo sus datos, imagenes y PDF.
  - Endpoints reales: POST /api/admin/product (Multipart Form)

- updateProduct(id, productData, images, documents, onUploadProgress)
  - Uso: Modifica un componente existente.
  - Endpoints reales: PUT /api/admin/product (Multipart Form)

- deleteProduct(id)
  - Uso: Elimina un producto.
  - Endpoints reales: DELETE /api/admin/product

---

## Reservas (reserveService.js)

Todos estos metodos se importan usando:
import reserveService from '../services/reserveService';

### Administrador (Admin)

- getAll(page, size, sort)
  - Uso: Obtiene todas las reservas (paginado).
  - Endpoints reales: GET /api/admin/reserve

- getByStatusAdmin(status, page, size, sort)
  - Uso: Obtiene reservas filtradas por estado.
  - Endpoints reales: GET /api/admin/reserve/status

- getByIdAdmin(id)
  - Uso: Obtiene una reserva especifica por ID.
  - Endpoints reales: GET /api/admin/reserve/id

- confirmReserve(reserveId)
  - Uso: Confirma una reserva pendiente.
  - Endpoints reales: PUT /api/admin/reserve/confirm

- cancelReserve(reserveId, message)
  - Uso: Cancela una reserva con un mensaje de justificacion.
  - Endpoints reales: PUT /api/admin/reserve/cancel (Multipart Form)

### Estudiantes / Usuarios

- getUserHistory(userId, page, size, sort)
  - Uso: Obtiene el historial de reservas de un usuario.
  - Endpoints reales: GET /api/student/reserve

- getDashboardStats(userId)
  - Uso: Obtiene estadisticas de reservas para el dashboard del usuario.
  - Endpoints reales: GET /api/student/reserve/dashboard-stats

- getActiveReserves(userId)
  - Uso: Obtiene la lista de reservas activas de un usuario.
  - Endpoints reales: GET /api/student/reserve/active

- getByIdStudent(id)
  - Uso: Obtiene el detalle de una reserva por ID.
  - Endpoints reales: GET /api/student/reserve/id

- getByUserIdAndStatus(userId, status, page, size, sort)
  - Uso: Obtiene las reservas de un usuario filtradas por estado.
  - Endpoints reales: GET /api/student/reserve/status

- checkoutCart(cartId)
  - Uso: Procesa el carrito actual y genera una reserva.
  - Endpoints reales: POST /api/student/reserve/checkout

---

## Carrito de Compras (cartService.js)

Todos estos metodos se importan usando:
import cartService from '../services/cartService';

- getAll(page, size, sort)
  - Uso: Obtiene todos los carritos (uso interno/admin).
  - Endpoints reales: GET /api/student/cart

- getById(id)
  - Uso: Obtiene un carrito por su ID.
  - Endpoints reales: GET /api/student/cart/id

- getByUserId(userId, page, size, sort)
  - Uso: Obtiene los carritos asociados a un usuario.
  - Endpoints reales: GET /api/student/cart/user

- getOrCreateCurrentCart(userId)
  - Uso: Obtiene el carrito actual activo del usuario, si no existe, lo crea.
  - Endpoints reales: GET /api/student/cart/current

- create(userId)
  - Uso: Crea un carrito nuevo manualmente.
  - Endpoints reales: POST /api/student/cart (Multipart Form)

- delete(id)
  - Uso: Elimina un carrito.
  - Endpoints reales: DELETE /api/student/cart

---

## Items del Carrito (itemCartService.js)

Todos estos metodos se importan usando:
import itemCartService from '../services/itemCartService';

- getAll(page, size, sort)
  - Uso: Obtiene todos los items de carritos.
  - Endpoints reales: GET /api/student/item-cart

- getById(id)
  - Uso: Obtiene un item especifico.
  - Endpoints reales: GET /api/student/item-cart/id

- getByCartId(cartId, page, size, sort)
  - Uso: Obtiene todos los items dentro de un carrito especifico.
  - Endpoints reales: GET /api/student/item-cart/cart

- create(cartId, productId, quantity)
  - Uso: Crea un item para un carrito.
  - Endpoints reales: POST /api/student/item-cart (Multipart Form)

- addToCurrentCart(userId, productId, quantity)
  - Uso: Agrega rapidamente un producto al carrito actual del usuario.
  - Endpoints reales: POST /api/student/item-cart/add

- updateQuantity(id, quantity)
  - Uso: Actualiza la cantidad de un producto en el carrito.
  - Endpoints reales: PUT /api/student/item-cart/quantity

- delete(id)
  - Uso: Elimina un item del carrito.
  - Endpoints reales: DELETE /api/student/item-cart

---

## Usuarios (userService.js)

Todos estos metodos se importan usando:
import userService from '../services/userService';

- getUserByCode(role, code)
  - Uso: Obtiene un usuario basado en su codigo escolar/identificador.
  - Endpoints reales: GET /api/admin/user/code o GET /api/student/user/code

- getUserById(id)
  - Uso: Obtiene la informacion de un usuario por su ID interno.
  - Endpoints reales: GET /api/admin/user/id

- getAllUsers(page, size)
  - Uso: Obtiene el listado de todos los usuarios registrados (Solo admin).
  - Endpoints reales: GET /api/admin/user

---

## Entorno y Configuracion
El proyecto Frontend esta configurado para conectarse al backend usando la variable de entorno VITE_API_BASE_URL en el archivo .env. Si un desarrollador Frontend necesita correr la app, simplemente debe asegurarse de tener el .env con la URL apuntando al backend en la nube que esta desplegado.
