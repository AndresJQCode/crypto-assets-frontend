# TanStack Query (Data Fetching)

Este proyecto usa TanStack Query para manejo de estado del servidor y data fetching.

## Hook para Obtener Lista (con Paginación)

```tsx
// src/features/users/hooks/useGetUsers.ts
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../services/userService'

export const useGetUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => getUsers(page, limit),
  })
}
```

## Hook para Obtener por ID

```tsx
// src/features/users/hooks/useGetUserById.ts
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../services/userService'

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id, // Solo ejecutar si hay ID
  })
}
```

## Hook para Crear (Mutación)

```tsx
// src/features/users/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../services/userService'
import { toast } from 'sonner'

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
      console.error(error)
    },
  })
}
```

## Hook para Actualizar

```tsx
// src/features/users/hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../services/userService'
import { toast } from 'sonner'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      toast.success('Usuario actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar usuario')
    },
  })
}
```

## Hook para Eliminar

```tsx
// src/features/users/hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '../services/userService'
import { toast } from 'sonner'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar usuario')
    },
  })
}
```

## Uso en Componentes

```tsx
function UsersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useGetUsers(page, 10)
  const createUser = useCreateUser()

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  const handleCreate = (data: CreateUserDto) => {
    createUser.mutate(data)
  }

  return (
    <div>
      <UsersTable data={data?.data ?? []} />
      <Button
        onClick={() => handleCreate(formData)}
        disabled={createUser.isPending}
      >
        {createUser.isPending ? 'Creando...' : 'Crear'}
      </Button>
    </div>
  )
}
```

## Convenciones de Query Keys

- Lista: `['users']` o `['users', page, limit]`
- Detalle: `['user', id]`
- Filtros: `['users', { status, search }]`
