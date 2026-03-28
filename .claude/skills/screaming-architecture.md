# Screaming Architecture (Estructura por Features)

Este proyecto usa Screaming Architecture, organizando el código por características de negocio.

## Estructura de Carpetas

```
src/
├── features/                    # Features de negocio
│   ├── users/                   # Feature de usuarios
│   │   ├── components/          # Componentes específicos
│   │   │   ├── UsersTable/
│   │   │   │   ├── UsersTable.tsx
│   │   │   │   ├── columns.tsx
│   │   │   │   └── ActionsDropdown.tsx
│   │   │   └── UserForm/
│   │   │       └── UserForm.tsx
│   │   ├── hooks/               # Hooks de TanStack Query
│   │   │   ├── index.ts
│   │   │   ├── useGetUsers.ts
│   │   │   ├── useGetUserById.ts
│   │   │   ├── useCreateUser.ts
│   │   │   ├── useUpdateUser.ts
│   │   │   └── useDeleteUser.ts
│   │   ├── services/            # Llamadas a API (un archivo por servicio)
│   │   │   ├── index.ts
│   │   │   ├── getUsersService.ts
│   │   │   ├── getUserByIdService.ts
│   │   │   ├── createUserService.ts
│   │   │   ├── updateUserService.ts
│   │   │   └── deleteUserService.ts
│   │   ├── types/               # Tipos TypeScript
│   │   │   ├── user.types.ts
│   │   │   └── user.schema.ts
│   │   ├── utils/               # Utilidades específicas
│   │   │   └── userUtils.ts
│   │   └── pages/               # Páginas
│   │       ├── AdminUsersPage.tsx
│   │       ├── CreateUserPage.tsx
│   │       └── EditUserPage.tsx
│   └── products/                # Otro feature
│       └── ...
├── components/
│   ├── ui/                      # Componentes Shadcn
│   ├── layouts/                 # Layouts
│   │   ├── AdminLayout.tsx
│   │   ├── AdminHeader.tsx
│   │   └── AdminNavigation.tsx
│   └── permissions/             # Sistema de permisos
├── routes/                      # Rutas TanStack Router
├── contexts/                    # React Contexts
├── constants/                   # Constantes globales
├── lib/                         # Configuraciones globales
└── assets/                      # Assets estáticos
```

## Crear un Nuevo Feature

### 1. Crear estructura de carpetas

```bash
mkdir -p src/features/products/{components,hooks,services,types,utils,pages}
```

### 2. Definir tipos

```tsx
// src/features/products/types/product.types.ts
export interface Product {
  id: string
  name: string
  price: number
  description: string
  categoryId: string
  createdAt: Date
}

export interface CreateProductDto {
  name: string
  price: number
  description: string
  categoryId: string
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

// src/features/products/types/product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser positivo'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
})
```

### 3. Crear servicios (un archivo por servicio)

Seguir la skill **feature-one-file-per-responsibility**: cada función de API en su propio archivo y un `index.ts` que reexporte.

```tsx
// src/features/products/services/getProductsService.ts
import { getApiUrl } from '@/lib/env'
export const getProducts = async (page: number, limit: number) => {
  const response = await fetch(`${getApiUrl()}/products?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Error al obtener productos')
  return response.json()
}

// src/features/products/services/getProductByIdService.ts
// src/features/products/services/createProductService.ts
// ... un archivo por cada: getProductById, createProduct, updateProduct, deleteProduct

// src/features/products/services/index.ts
export { getProducts } from './getProductsService'
export { getProductById } from './getProductByIdService'
export { createProduct } from './createProductService'
// ...
```

### 4. Crear hooks (un archivo por hook)

Seguir la skill **feature-one-file-per-responsibility**: un hook por archivo, `index.ts` reexporta.

```tsx
// src/features/products/hooks/useGetProducts.ts
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services'
export const useGetProducts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => getProducts(page, limit),
  })
}

// Un archivo por cada: useGetProductById.ts, useCreateProduct.ts, useUpdateProduct.ts, useDeleteProduct.ts

// src/features/products/hooks/index.ts
export { useGetProducts } from './useGetProducts'
export { useGetProductById } from './useGetProductById'
export { useCreateProduct } from './useCreateProduct'
export { useUpdateProduct } from './useUpdateProduct'
export { useDeleteProduct } from './useDeleteProduct'
```

### 5. Crear páginas

```tsx
// src/features/products/pages/AdminProductsPage.tsx
export function AdminProductsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetProducts(page, 10)

  if (isLoading) return <TableSkeleton />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <PermissionButton permission="products.create" asChild>
          <Link to="/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Link>
        </PermissionButton>
      </div>
      <ProductsTable
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={10}
        onPageChange={setPage}
      />
    </div>
  )
}
```

### 6. Crear rutas

```tsx
// src/routes/_admin/products/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AdminProductsPage } from '@/features/products/pages/AdminProductsPage'

export const Route = createFileRoute('/_admin/products/')({
  component: AdminProductsPage,
})

// src/routes/_admin/products/create.tsx
// src/routes/_admin/products/$productId/edit.tsx
```

## Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Carpetas | kebab-case | `user-management` |
| Componentes | PascalCase | `UserTable.tsx` |
| Hooks | useCamelCase | `useGetUsers.ts` |
| Servicios | [accion]Service.ts (camelCase) | `getUserByIdService.ts` |
| Tipos | PascalCase | `User`, `CreateUserDto` |
| Schemas | camelCase | `createUserSchema` |
