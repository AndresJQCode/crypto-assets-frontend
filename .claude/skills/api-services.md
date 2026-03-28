# Servicios API

Este proyecto centraliza las llamadas a API en servicios dentro de cada feature.

## Configuración Base

```tsx
// src/lib/env.ts
export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl) {
    throw new Error('VITE_API_URL no está configurada')
  }
  return apiUrl
}
```

## Estructura de un Servicio

```tsx
// src/features/users/services/userService.ts
import { getApiUrl } from '@/lib/env'
import type { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from '../types/user.types'

const API_URL = getApiUrl()

// GET Lista con paginación
export const getUsers = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<User>> => {
  const response = await fetch(
    `${API_URL}/users?page=${page}&limit=${limit}`
  )
  if (!response.ok) {
    throw new Error('Error al obtener usuarios')
  }
  return response.json()
}

// GET Por ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error('Error al obtener usuario')
  }
  return response.json()
}

// POST Crear
export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al crear usuario')
  }
  return response.json()
}

// PUT/PATCH Actualizar
export const updateUser = async (
  id: string,
  data: UpdateUserDto
): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Error al actualizar usuario')
  }
  return response.json()
}

// DELETE Eliminar
export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Error al eliminar usuario')
  }
}
```

## Servicio con Autenticación

```tsx
// src/lib/fetchWithAuth.ts
import { getApiUrl } from './env'
import { store } from '@/store'

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const API_URL = getApiUrl()
  const token = store.getState().auth.token

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  // Manejar token expirado
  if (response.status === 401) {
    store.dispatch(logout())
    window.location.href = '/login'
  }

  return response
}

// Uso en servicio
export const getUsers = async (page: number, limit: number) => {
  const response = await fetchWithAuth(`/users?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Error al obtener usuarios')
  return response.json()
}
```

## Tipos para Respuestas Paginadas

```tsx
// src/features/[feature]/types/common.types.ts
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
```

## Manejo de Errores

```tsx
// En el servicio
export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    // Lanzar error con mensaje del servidor
    throw new Error(error.message || 'Error al crear usuario')
  }

  return response.json()
}

// En el hook con TanStack Query
export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    onError: (error: Error) => {
      // El mensaje viene del servicio
      toast.error(error.message)
    },
  })
}
```

## Subir Archivos

```tsx
export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
    method: 'POST',
    body: formData,
    // NO incluir Content-Type, el navegador lo agrega automáticamente
  })

  if (!response.ok) {
    throw new Error('Error al subir imagen')
  }

  const data = await response.json()
  return data.avatarUrl
}
```

## Reglas Importantes

- SIEMPRE usar `getApiUrl()` de `src/lib/env.ts`
- Variable de entorno requerida: `VITE_API_URL`
- Manejar errores con throw new Error
- Tipar correctamente las respuestas
- No hacer console.log en producción
