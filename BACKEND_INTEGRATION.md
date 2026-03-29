# ✅ Integración Backend Completada

## Resumen

El frontend `crypto-assets-frontend` ha sido conectado con el backend .NET para los endpoints de Trading Orders y PnL Metrics.

---

## 🔌 Configuración

### 1. Archivo `.env` Creado

```env
# URL base de la API del backend
VITE_API_URL=http://localhost:5224

# Autenticación habilitada
VITE_AUTH_EMAIL_ENABLED=true

# OAuth deshabilitado (por ahora)
VITE_AUTH_MICROSOFT_ENABLED=false
VITE_AUTH_GOOGLE_ENABLED=false

# reCAPTCHA (placeholder)
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### 2. Cliente API Creado

**Archivo:** `src/lib/api-client.ts`

**Características:**
- ✅ Cliente HTTP singleton (`apiClient`)
- ✅ Autenticación automática con JWT (Bearer token)
- ✅ Manejo de errores con `ApiError`
- ✅ Soporte para query parameters
- ✅ Métodos: `get`, `post`, `put`, `patch`, `delete`
- ✅ Headers configurados automáticamente

**Uso:**
```typescript
// GET con query params
const orders = await apiClient.get<PaginatedData<Order>>("/api/orders", {
  params: { page: 1, limit: 10, status: "open" }
});

// POST con body
const newOrder = await apiClient.post<Order>("/api/orders", {
  symbol: "BTCUSDT",
  side: "buy",
  quantity: 0.5
});
```

---

## 📡 Servicios Implementados

### 1. ✅ `getOrdersService.ts` - Lista de órdenes

**Antes:** Mock data
**Ahora:** `GET /api/orders` con filtros

```typescript
const orders = await getOrders(page, limit, {
  exchangeId: "bybit-connector-id",
  status: "open",
  side: "buy",
  pair: "BTC"
});
```

### 2. ✅ `getOrderByIdService.ts` - Detalle de orden

**Antes:** Mock data
**Ahora:** `GET /api/orders/{id}`

```typescript
const order = await getOrderById("order-uuid");
```

### 3. ✅ `getPnLMetricsService.ts` - Métricas de P&L

**Antes:** Cálculo en frontend con mocks
**Ahora:** `GET /api/pnl-metrics`

```typescript
const metrics = await getPnLMetrics();
// { totalPnL, realizedPnL, unrealizedPnL, winRate, totalTrades }
```

---

## ⏳ Servicios Pendientes (Aún con Mocks)

### 1. 🟡 `getAssetsService.ts` - Balances de exchange
**Estado:** Mock data (backend no implementado aún)
**Endpoint futuro:** `GET /api/assets?exchangeId={id}`

### 2. 🟡 `getAssetBalanceService.ts` - Balance total
**Estado:** Mock data (backend no implementado aún)
**Endpoint futuro:** `GET /api/asset-balance?exchangeId={id}`

### 3. 🟡 `getOrderEventsService.ts` - Eventos de orden
**Estado:** Mock data (backend no implementado aún)
**Endpoint futuro:** `GET /api/orders/{id}/events`

### 4. 🟡 `getOrderTradesService.ts` - Trades de orden
**Estado:** Mock data (backend no implementado aún)
**Endpoint futuro:** `GET /api/orders/{id}/trades`

---

## 🔑 Autenticación

### Token Storage

El `apiClient` busca el token en `localStorage`:
```typescript
const token = localStorage.getItem("access_token");
```

### Login Flow

1. Usuario hace login en `/auth/login`
2. Backend retorna `{ access_token, refresh_token }`
3. Frontend guarda tokens en localStorage
4. Todas las peticiones posteriores incluyen `Authorization: Bearer {token}`

### Logout

```typescript
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");
```

---

## 🧪 Testing

### 1. Iniciar Backend

```bash
cd /home/andres/.openclaw/workspace/crypto-assets-backend
export DOTNET_ROOT=$HOME/.dotnet
export PATH="$HOME/.dotnet:$PATH:/home/andres/.dotnet/tools"
dotnet run --project Api
```

Backend estará en: `http://localhost:5224`

### 2. Iniciar Frontend

```bash
cd /home/andres/.openclaw/workspace/crypto-assets-frontend
npm install  # o bun install
npm run dev  # o bun dev
```

Frontend estará en: `http://localhost:5173` (o el puerto que configure Vite)

### 3. Probar Endpoints

**En DevTools → Network:**
- Ir a "Orders" page
- Ver petición: `GET http://localhost:5224/api/orders?page=1&limit=10`
- Verificar headers: `Authorization: Bearer {token}`
- Ver respuesta JSON

---

## ⚠️ Troubleshooting

### Error: "CORS policy"

El backend debe permitir CORS desde el frontend:

```json
// appsettings.json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"],
    "AllowedMethods": ["*"],
    "AllowedHeaders": ["*"],
    "AllowCredentials": true
  }
}
```

### Error: "401 Unauthorized"

1. Verificar que el usuario está logueado
2. Verificar token en localStorage
3. Verificar que el token no expiró
4. Verificar permisos: `TradingOrders.Read`

### Error: "API URL not set"

Verificar que existe `.env` con `VITE_API_URL`

### Error: "Network request failed"

1. Verificar que el backend está corriendo
2. Verificar la URL: `http://localhost:5224` (sin trailing slash)
3. Verificar firewall

---

## 📂 Archivos Modificados/Creados

### Nuevos archivos:

1. `.env` - Variables de entorno
2. `src/lib/api-client.ts` - Cliente HTTP
3. Servicios reemplazados:
   - `src/features/crypto-assets/services/getOrdersService.ts`
   - `src/features/crypto-assets/services/getOrderByIdService.ts`
   - `src/features/crypto-assets/services/getPnLMetricsService.ts`

### Archivos modificados:

1. `src/features/crypto-assets/services/index.ts` - Exporta getPnLMetrics

---

## 🚀 Próximos Pasos

### Alta Prioridad

1. **Implementar Assets/Balances en Backend**
   - Crear servicio para obtener balances de Bybit API
   - Implementar cache
   - Exponer endpoints `/api/assets` y `/api/asset-balance`
   - Conectar servicios del frontend

2. **Testing End-to-End**
   - Probar flujo completo de login
   - Probar lista de órdenes con filtros
   - Probar métricas de PnL
   - Verificar manejo de errores

### Media Prioridad

3. **Order Events & Trades**
   - Implementar backend para `/api/orders/{id}/events`
   - Implementar backend para `/api/orders/{id}/trades`
   - Conectar servicios del frontend

4. **Refresh Token**
   - Implementar interceptor para refrescar token expirado
   - Manejar 401 y renovar automáticamente

### Baja Prioridad

5. **WebSockets**
   - Real-time updates de órdenes
   - SignalR para notificaciones

6. **Optimizaciones**
   - Request caching con React Query
   - Debounce en búsquedas
   - Infinite scroll

---

## ✅ Checklist de Integración

- [x] Archivo `.env` creado
- [x] Cliente API implementado (`apiClient`)
- [x] Servicio `getOrders` conectado al backend
- [x] Servicio `getOrderById` conectado al backend
- [x] Servicio `getPnLMetrics` conectado al backend
- [x] Manejo de autenticación con JWT
- [x] Manejo de errores con `ApiError`
- [ ] Testing manual completo
- [ ] Servicios de Assets/Balances
- [ ] Servicios de Events/Trades
- [ ] Refresh token automático
- [ ] CORS configurado en backend
- [ ] Deploy a producción

---

**Fecha:** 2026-03-28  
**Estado:** ✅ Frontend conectado con backend (Orders & PnL)  
**Próximo paso:** Testing y validación de flujo completo
