# Sistema de Permisos

Este proyecto incluye un sistema de permisos basado en roles para controlar acceso a funcionalidades.

## Componentes de Permisos

### PermissionGuard

Oculta contenido si el usuario no tiene el permiso requerido.

```tsx
import { PermissionGuard } from '@/components/permissions'

// Ocultar sección completa
<PermissionGuard permission="users.create">
  <CreateUserSection />
</PermissionGuard>

// Con fallback
<PermissionGuard
  permission="reports.view"
  fallback={<NoAccessMessage />}
>
  <ReportsSection />
</PermissionGuard>
```

### PermissionButton

Botón que se deshabilita/oculta según permisos.

```tsx
import { PermissionButton } from '@/components/permissions'

// Botón que se oculta sin permiso
<PermissionButton permission="users.create">
  Crear usuario
</PermissionButton>

// Botón que se deshabilita sin permiso
<PermissionButton permission="users.delete" behavior="disable">
  Eliminar
</PermissionButton>

// Con variantes de Button
<PermissionButton
  permission="users.create"
  variant="outline"
  size="sm"
>
  <Plus className="mr-2 h-4 w-4" />
  Nuevo
</PermissionButton>
```

### PermissionDropdownItem

Item de dropdown con control de permisos.

```tsx
import { PermissionDropdownItem } from '@/components/permissions'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <PermissionDropdownItem
      permission="users.edit"
      onClick={handleEdit}
    >
      <Pencil className="mr-2 h-4 w-4" />
      Editar
    </PermissionDropdownItem>
    <PermissionDropdownItem
      permission="users.delete"
      onClick={handleDelete}
      className="text-destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Eliminar
    </PermissionDropdownItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### PermissionRoute

Protege rutas completas.

```tsx
import { PermissionRoute } from '@/components/permissions'

// En definición de ruta
export const Route = createFileRoute('/_admin/users')({
  component: () => (
    <PermissionRoute permission="users.view">
      <UsersPage />
    </PermissionRoute>
  ),
})
```

## Hook usePermissions

```tsx
import { usePermissions } from '@/contexts/usePermissions'

function MyComponent() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions
  } = usePermissions()

  // Verificar un permiso
  if (hasPermission('users.create')) {
    // Mostrar botón de crear
  }

  // Verificar si tiene alguno de varios permisos
  if (hasAnyPermission(['users.edit', 'users.delete'])) {
    // Mostrar columna de acciones
  }

  // Verificar si tiene todos los permisos
  if (hasAllPermissions(['admin.access', 'users.manage'])) {
    // Mostrar panel de administración
  }

  return (
    <div>
      {hasPermission('reports.export') && (
        <Button onClick={exportReport}>Exportar</Button>
      )}
    </div>
  )
}
```

## Definición de Permisos

```tsx
// src/constants/permissions.ts
export const PERMISSIONS = {
  // Usuarios
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Productos
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_EDIT: 'products.edit',
  PRODUCTS_DELETE: 'products.delete',

  // Reportes
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // Admin
  ADMIN_ACCESS: 'admin.access',
  ADMIN_SETTINGS: 'admin.settings',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]
```

## Context de Permisos

```tsx
// src/contexts/PermissionsContext.tsx
import { createContext, useContext, ReactNode } from 'react'

interface PermissionsContextType {
  permissions: string[]
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | null>(null)

export function PermissionsProvider({
  children,
  permissions
}: {
  children: ReactNode
  permissions: string[]
}) {
  const hasPermission = (permission: string) =>
    permissions.includes(permission)

  const hasAnyPermission = (perms: string[]) =>
    perms.some(p => permissions.includes(p))

  const hasAllPermissions = (perms: string[]) =>
    perms.every(p => permissions.includes(p))

  return (
    <PermissionsContext.Provider value={{
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
    }}>
      {children}
    </PermissionsContext.Provider>
  )
}
```

## Uso en Tablas

```tsx
// Mostrar columna de acciones solo si tiene permisos
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Correo' },
]

// Agregar columna de acciones condicionalmente
const { hasAnyPermission } = usePermissions()

if (hasAnyPermission(['users.edit', 'users.delete'])) {
  columns.push({
    id: 'actions',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  })
}
```

## Patrones Comunes

```tsx
// En navegación
<nav>
  <PermissionGuard permission="dashboard.view">
    <NavLink to="/dashboard">Dashboard</NavLink>
  </PermissionGuard>
  <PermissionGuard permission="users.view">
    <NavLink to="/users">Usuarios</NavLink>
  </PermissionGuard>
</nav>

// En formularios
<form>
  <Input {...form.register('name')} />
  <PermissionGuard permission="users.changeRole">
    <RoleSelect {...form.register('role')} />
  </PermissionGuard>
</form>
```
