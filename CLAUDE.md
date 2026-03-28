# CLAUDE.md

Este archivo proporciona contexto para Claude Code al trabajar con este repositorio.

## Descripción del Proyecto

Template frontend basado en React 19 con Vite, TanStack (Router, Query, Table), Shadcn/ui y Tailwind CSS. Utiliza arquitectura Screaming Architecture organizada por features de negocio.

## Comandos Principales

> **Nota**: Este proyecto usa `bun` como package manager (no pnpm/npm/yarn)

```bash
# Desarrollo
bun dev              # Inicia servidor en puerto 3002

# Build y producción
bun build            # Compila para producción
bun serve            # Preview de producción

# Testing
bun test             # Ejecuta tests con Vitest

# Linting y formateo (Biome)
bun format           # Formatea código
bun format:check     # Verifica formato
bun lint             # Ejecuta linter
bun lint:fix         # Corrige errores de lint
bun check            # Verifica todo
bun check:fix        # Corrige todo

# Shadcn components
bunx shadcn@latest add <componente>
```

## Arquitectura del Proyecto

### Estructura de Carpetas (Screaming Architecture)

```
src/
├── features/           # Features de negocio (principal)
│   └── [feature]/
│       ├── components/ # Componentes específicos
│       ├── hooks/      # useQuery/useMutation hooks
│       ├── services/   # Llamadas a API
│       ├── types/      # Tipos TypeScript
│       ├── utils/      # Utilidades
│       └── pages/      # Páginas (Admin, Create, Edit)
├── components/
│   ├── ui/             # Componentes Shadcn/ui
│   ├── layouts/        # Layouts (AdminLayout, etc.)
│   └── permissions/    # Guards de permisos
├── routes/             # Rutas TanStack Router (file-based)
├── contexts/           # React Contexts
├── constants/          # Constantes (routes, permissions)
└── lib/                # Configuraciones globales
```

### Convenciones de Nombres

- Carpetas: `kebab-case`
- Componentes: `PascalCase`
- Hooks: `useCamelCase`
- Servicios: `camelCase`

## Stack Tecnológico

- **Framework**: React 19
- **Build**: Vite 7
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query
- **Tablas**: TanStack Table
- **State Management**: Redux Toolkit + Redux Persist
- **Forms**: React Hook Form + Zod
- **UI**: Shadcn/ui + Tailwind CSS 4
- **Linting**: Biome

## Reglas de Desarrollo

### General

- Código en inglés, interfaz de usuario en español
- Usar siempre `bun` (no pnpm/npm/yarn)
- Usar `Link` de TanStack Router (no `window.location.href`)
- Eliminar importaciones innecesarias

### Componentes Shadcn

- Instalar con: `bunx shadcn@latest add <componente>`
- SelectItem nunca debe tener value vacío

### Formularios

- Usar Form de shadcn/ui con react-hook-form
- Validación con Zod
- Siempre usar `mode: 'onChange'`
- Usar FormField de shadcn/ui para campos

### Rutas

- Rutas bajo layout `_admin` NO incluyen prefijo `/admin`
- Ejemplo: usar `/users` en vez de `/admin/users`

### Servicios/API

- Usar `getApiUrl()` de `src/lib/env.ts` para URL de API
- Variable de entorno requerida: `VITE_API_URL`
- **Centralizar URLs de endpoints**: Crear `constants/endpoints.ts` en cada feature para evitar repetir URLs en cada servicio:

```tsx
// src/features/[feature]/constants/endpoints.ts
import { getApiUrl } from "@/lib/env";

export const getFeatureEndpoint = () => `${getApiUrl()}/feature-resource`;

export const endpoints = {
  list: () => getFeatureEndpoint(),
  byId: (id: string) => `${getFeatureEndpoint()}/${id}`,
  toggle: (id: string) => `${getFeatureEndpoint()}/${id}/toggle`,
};

// Uso en servicios:
import { endpoints } from "../constants";
const response = await fetch(endpoints.byId(id));
```

## Crear Nuevo Feature

1. Crear carpeta en `src/features/[nombre-feature]/`
2. Crear subcarpetas: `components/`, `hooks/`, `services/`, `types/`, `constants/`, `pages/`
3. **Crear `constants/endpoints.ts`**: Centralizar URLs de API para evitar repetición en servicios
4. **Un archivo por servicio y por hook**: cada función de API en su propio archivo (p. ej. `getUsersService.ts`, `getUserByIdService.ts`); cada hook en su propio archivo (p. ej. `useGetUsers.ts`, `useGetUserById.ts`). Usar `index.ts` en `services/` y `hooks/` solo para reexportar. Ver skill `feature-one-file-per-responsibility`.
5. Hooks: `useGet[Feature]ByID`, `useGet[Features]`, `useCreate[Feature]`, `useUpdate[Feature]`, `useDelete[Feature]`
6. Pages: `Admin[Feature]Page.tsx`, `Create[Feature]Page.tsx`, `Edit[Feature]Page.tsx`
7. Tablas con TanStack Table y paginación server-side

## Skills de Claude Code

- **feature-one-file-per-responsibility**: Al crear o extender un feature, usar un archivo por cada servicio (cada función de API) y un archivo por cada hook. No agrupar varios servicios en un solo `*Service.ts` ni varios hooks en un solo archivo.

### TanStack Router (File-Based Routing)

```tsx
// Crear ruta en src/routes/[nombre].tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

// Ruta con parámetros: src/routes/users/$userId.tsx
export const Route = createFileRoute('/users/$userId')({
  component: UserDetailPage,
})

// Navegación
import { Link, useNavigate } from '@tanstack/react-router'
<Link to="/users" params={{ userId: '123' }}>Ver usuario</Link>
const navigate = useNavigate()
navigate({ to: '/users' })
```

### TanStack Query (Data Fetching)

```tsx
// Hook para obtener lista (con paginación)
export const useGetUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => getUsers(page, limit),
  })
}

// Hook para obtener por ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

// Hook para mutaciones (create/update/delete)
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear usuario')
    },
  })
}
```

### TanStack Table (Tablas con Server-Side Pagination)

```tsx
// Definir columnas
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Correo',
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  },
]

// Configurar tabla
const table = useReactTable({
  data: users ?? [],
  columns,
  pageCount: Math.ceil(total / pageSize),
  state: { pagination: { pageIndex, pageSize } },
  onPaginationChange: setPagination,
  manualPagination: true,
  getCoreRowModel: getCoreRowModel(),
})
```

### React Hook Form + Zod (Formularios)

```tsx
// Schema de validación
const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'),
  phone: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

// Formulario
const form = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  mode: 'onChange',
  defaultValues: { name: '', email: '' },
})

// JSX con Form de shadcn
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" disabled={!form.formState.isValid}>
      Guardar
    </Button>
  </form>
</Form>
```

### Servicios API

```tsx
// src/features/[feature]/services/userService.ts
import { getApiUrl } from '@/lib/env'

const API_URL = getApiUrl()

export const getUsers = async (page: number, limit: number) => {
  const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Error al obtener usuarios')
  return response.json()
}

export const createUser = async (data: CreateUserDto) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Error al crear usuario')
  return response.json()
}
```

### Tipos TypeScript

```tsx
// src/features/[feature]/types/user.types.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface CreateUserDto {
  name: string
  email: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

### Componentes Shadcn/ui Comunes

```tsx
// Imports comunes
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Notificaciones
toast.success('Operación exitosa')
toast.error('Ocurrió un error')
toast.loading('Procesando...')
```

### Tailwind CSS Patterns

```tsx
// Clases comunes
className="flex items-center justify-between gap-4"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
className="p-4 rounded-lg border bg-card"
className="text-sm text-muted-foreground"
className="hover:bg-accent transition-colors"

// Uso de cn() para clases condicionales
import { cn } from '@/lib/utils'
className={cn(
  "base-classes",
  isActive && "active-classes",
  disabled && "opacity-50 cursor-not-allowed"
)}
```

### Permisos y Guards

```tsx
// Verificar permisos en componentes
import { PermissionGuard, PermissionButton } from '@/components/permissions'

<PermissionGuard permission="users.create">
  <CreateUserButton />
</PermissionGuard>

<PermissionButton permission="users.delete" onClick={handleDelete}>
  Eliminar
</PermissionButton>

// Hook de permisos
import { usePermissions } from '@/contexts/usePermissions'
const { hasPermission } = usePermissions()
if (hasPermission('users.edit')) { /* ... */ }
```

### Redux Toolkit (Estado Global)

```tsx
// Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
    },
  },
})

// Usar en componentes
import { useSelector, useDispatch } from 'react-redux'
const user = useSelector((state: RootState) => state.user.currentUser)
const dispatch = useDispatch()
dispatch(setUser(userData))
```

### Testing con Vitest

```tsx
// src/features/[feature]/__tests__/userService.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('UserService', () => {
  it('should fetch users', async () => {
    const users = await getUsers(1, 10)
    expect(users.data).toBeDefined()
    expect(Array.isArray(users.data)).toBe(true)
  })
})

// Mock de fetch
vi.mock('fetch', () => ({
  default: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })),
}))
```
