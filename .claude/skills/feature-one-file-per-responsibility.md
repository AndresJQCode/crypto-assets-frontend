# Un archivo por responsabilidad (Features)

Regla de arquitectura: **cada servicio y cada hook debe vivir en su propio archivo**. Aplicar siempre al crear o extender un feature (usuarios, productos, settings, etc.).

## Cuándo aplicar

- Al crear un nuevo feature desde cero
- Al añadir un nuevo servicio o hook a un feature existente
- Cuando se pida "crear feature", "añadir CRUD de X", "agregar servicios/hooks para X"

## Servicios: un archivo por función

En `src/features/[feature]/services/`:

- **Una función de API = un archivo** (p. ej. `getUsersService.ts`, `getUserByIdService.ts`, `createUserService.ts`).
- Utilidades compartidas (p. ej. `buildQueryString`) en su propio archivo (p. ej. `buildQueryString.ts`) si se reutilizan, o dentro del único servicio que las use.
- **`index.ts`** solo reexporta las funciones públicas del feature para que el resto del código importe desde `../services` o `@/features/.../services`.

### Estructura de carpeta services

```
src/features/[feature]/services/
├── index.ts                    # Reexporta todo
├── getUsersService.ts          # getUsers()
├── getUserByIdService.ts       # getUserById()
├── createUserService.ts        # createUser()
├── updateUserService.ts        # updateUser()
├── deleteUserService.ts        # deleteUser()
├── toggleUserStatusService.ts  # toggleUserStatus() (si aplica)
└── buildQueryString.ts         # Utilidad compartida (si aplica)
```

### Convención de nombres en servicios

- Archivo: `[nombreAccion]Service.ts` en camelCase (p. ej. `getUserByIdService.ts`, `createUserService.ts`).
- Export: una función por archivo, nombre en camelCase (p. ej. `getUsers`, `getUserById`, `createUser`).

### Ejemplo: un servicio en su archivo

```ts
// src/features/users/services/getUserByIdService.ts
import { getApiUrl } from "@/lib/env";
import type { UserWithDetails } from "../types";

export const getUserById = async (id: string): Promise<UserWithDetails> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/users/${id}`);
  if (!response.ok) throw new Error("Error al obtener el usuario");
  return response.json();
};
```

```ts
// src/features/users/services/index.ts
export { getUsers } from "./getUsersService";
export { getUserById } from "./getUserByIdService";
export { createUser } from "./createUserService";
export { updateUser } from "./updateUserService";
export { deleteUser } from "./deleteUserService";
// ... resto de exports
```

## Hooks: un archivo por hook

En `src/features/[feature]/hooks/`:

- **Un hook = un archivo** (p. ej. `useGetUsers.ts`, `useGetUserById.ts`, `useCreateUser.ts`).
- **`index.ts`** reexporta todos los hooks del feature.

### Estructura de carpeta hooks

```
src/features/[feature]/hooks/
├── index.ts           # Reexporta todos los hooks
├── useGetUsers.ts
├── useGetUserById.ts
├── useCreateUser.ts
├── useUpdateUser.ts
├── useDeleteUser.ts
└── useToggleUserStatus.ts   # si aplica
```

### Convención de nombres en hooks

- Archivo: `use[Nombre].ts` (PascalCase después de "use"), p. ej. `useGetUserById.ts`.
- Export: un hook por archivo, nombre en useCamelCase.

### Ejemplo: un hook en su archivo

```ts
// src/features/users/hooks/useGetUserById.ts
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services";

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
```

```ts
// src/features/users/hooks/index.ts
export { useGetUsers } from "./useGetUsers";
export { useGetUserById } from "./useGetUserById";
export { useCreateUser } from "./useCreateUser";
export { useUpdateUser } from "./useUpdateUser";
export { useDeleteUser } from "./useDeleteUser";
// ... resto de exports
```

## Resumen

| Capa     | Regla                          | Ejemplo de archivo        |
|----------|--------------------------------|---------------------------|
| Servicios| Una función de API por archivo | `getUserByIdService.ts`   |
| Hooks    | Un hook por archivo            | `useGetUserById.ts`       |

No agrupar varios servicios en un solo `userService.ts` ni varios hooks en un solo `useUsers.ts`. Mantener el barrel `index.ts` solo para reexportar.
