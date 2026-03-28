# TanStack Router (File-Based Routing)

Este proyecto usa TanStack Router con file-based routing. Las rutas se definen en `src/routes/`.

## Crear una Ruta Básica

```tsx
// src/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users/pages/UsersPage'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})
```

## Ruta con Parámetros

```tsx
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserDetailPage } from '@/features/users/pages/UserDetailPage'

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailPage,
})

// Acceder al parámetro en el componente
function UserDetailPage() {
  const { userId } = Route.useParams()
  return <div>Usuario: {userId}</div>
}
```

## Ruta con Layout Admin

```tsx
// src/routes/_admin/users.tsx
// IMPORTANTE: NO incluir /admin en la ruta, el layout ya lo maneja
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/users')({
  component: UsersPage,
})
```

## Navegación

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

// Link declarativo
<Link to="/users">Ver usuarios</Link>
<Link to="/users/$userId" params={{ userId: '123' }}>Ver usuario</Link>

// Navegación programática
const navigate = useNavigate()
navigate({ to: '/users' })
navigate({ to: '/users/$userId', params: { userId: '123' } })
```

## Search Params

```tsx
// Definir en la ruta
export const Route = createFileRoute('/users')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    search: String(search.search || ''),
  }),
  component: UsersPage,
})

// Usar en componente
const { page, search } = Route.useSearch()
```

## Reglas Importantes

- NUNCA usar `window.location.href` - siempre usar `Link` o `useNavigate`
- Rutas bajo `_admin` NO llevan prefijo `/admin`
- No crear archivos de rutas manualmente si TanStack los genera automáticamente
