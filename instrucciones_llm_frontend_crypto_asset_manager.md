# Instrucciones para LLM (Claude Code)

## Contexto

Estás desarrollando el **frontend** de una aplicación para **administrar activos de criptomonedas**.

- El producto actual es un **prototipo funcional**, usando **datos quemados (mock)**.
- Más adelante se conectará a un backend real, por lo que el diseño debe ser **backend-ready**.

El primer exchange soportado será **Bybit**, pero el diseño debe permitir agregar otros exchanges en el futuro.

---

## Objetivo del Frontend

Construir una interfaz que permita:

1. Visualizar los **activos (balances)** del usuario en un exchange.
2. Administrar y consultar el **historial de órdenes**.
3. Mantener la **trazabilidad completa de cada orden**.
4. Sentar las bases para soportar **múltiples exchanges** sin reescribir la lógica.

---

## Principios de Diseño

### 1. Separación clara de responsabilidades

El frontend debe distinguir claramente entre:

- **Modelo de dominio (frontend)**: cómo se representan activos, órdenes, trades, posiciones.
- **Capa de acceso a datos (mock)**: fuente de datos simulada que luego será reemplazada por API real.
- **Capa de presentación**: componentes que consumen datos ya procesados.

Evita que los componentes contengan lógica de negocio compleja.

---

### 2. Diseño orientado a Exchange

Modela el sistema considerando que:

- Un *Exchange* es una fuente de datos externa.
- Cada exchange puede tener particularidades, pero debe mapearse a un **modelo común**.

Ejemplo conceptual (no código):

- Exchange
  - Nombre
  - Tipo (centralizado / descentralizado)
  - Soporte de spot, futures, etc.

---

## Activos (Balances)

### Requerimientos funcionales

El frontend debe poder:

- Mostrar el listado de activos disponibles en Bybit.
- Mostrar por cada activo:
  - Símbolo (ej: BTC, ETH)
  - Cantidad total
  - Cantidad disponible
  - Cantidad bloqueada (en órdenes)
  - Valor estimado (si existe)

### Consideraciones

- El modelo debe permitir soportar activos de otros exchanges con campos adicionales.
- El cálculo de valores puede venir preprocesado (mock) o derivarse en frontend.

---

## Órdenes

### Concepto de Orden

Una orden debe representarse como una **entidad rica en información**, no solo como un registro plano.

Debe permitir:

- Identificación única
- Asociación a un exchange
- Asociación a un par de trading (ej: BTC/USDT)
- Tipo de orden (market, limit, etc.)
- Lado (buy / sell)
- Estado actual
- Fechas relevantes

---

### Estados de una Orden

Modela los estados como un **flujo de vida**, por ejemplo:

- Created
- Submitted
- PartiallyFilled
- Filled
- Cancelled
- Rejected

El frontend debe poder:

- Mostrar el estado actual
- Mostrar la evolución histórica de estados

---

## Trazabilidad de Órdenes

### Requerimiento clave

Cada orden debe tener **trazabilidad completa**, lo que implica:

- Línea de tiempo de eventos
- Cambios de estado
- Ejecuciones parciales (fills / trades)

### Eventos de Orden

Ejemplos de eventos:

- Orden creada
- Orden enviada al exchange
- Ejecución parcial
- Ejecución completa
- Cancelación

Cada evento debe tener:

- Tipo de evento
- Fecha/hora
- Metadata relevante (cantidad, precio, etc.)

---

## Trades / Fills

Para órdenes ejecutadas parcial o totalmente:

- Representa cada ejecución como un **Trade / Fill**.
- Una orden puede tener **muchos trades**.

Cada trade debe incluir:

- Cantidad ejecutada
- Precio
- Fee (si existe)
- Timestamp

---

## Datos Mockeados

### Lineamientos

- Usa datos mock **realistas**, similares a los que retornaría Bybit.
- Los mocks deben vivir en una capa claramente aislada.
- Evita acoplar los componentes directamente a los mocks.

El objetivo es que luego se pueda reemplazar el origen de datos sin cambiar la UI ni la lógica.

---

## Preparación para Backend Futuro

Aunque el backend no existe aún:

- Diseña las funciones como si consumieran APIs asincrónicas.
- Centraliza la obtención de datos.
- Evita lógica duplicada en múltiples componentes.

---

## Alcance del Prototipo

Incluye:

- Vista de activos
- Vista de listado de órdenes
- Vista de detalle de una orden con trazabilidad

Excluye explícitamente:

- Autenticación
- Manejo de credenciales
- Permisos
- Configuración de exchange

---

## Resultado Esperado

Un frontend que:

- Sea coherente con un dominio de trading real
- Sea fácilmente extensible a otros exchanges
- Permita evolucionar de mocks a backend real sin refactor masivo

No escribas documentación teórica extensa: **enfócate en construir la lógica y estructura del frontend** siguiendo estas instrucciones.

