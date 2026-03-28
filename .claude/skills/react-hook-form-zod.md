# React Hook Form + Zod (Formularios)

Este proyecto usa React Hook Form con Zod para validación y componentes Form de Shadcn/ui.

## Schema de Validación con Zod

```tsx
// src/features/users/types/user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest'], {
    required_error: 'Selecciona un rol',
  }),
  isActive: z.boolean().default(true),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
```

## Formulario de Creación

```tsx
// src/features/users/pages/CreateUserPage.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createUserSchema, CreateUserFormData } from '../types/user.schema'
import { useCreateUser } from '../hooks/useCreateUser'

export function CreateUserPage() {
  const createUser = useCreateUser()
  const navigate = useNavigate()

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange', // IMPORTANTE: siempre usar onChange
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: undefined,
      isActive: true,
    },
  })

  const onSubmit = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/users' })
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo de texto */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="guest">Invitado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Switch */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Estado activo</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/users' })}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isValid || createUser.isPending}
          >
            {createUser.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Formulario de Edición

```tsx
// src/features/users/pages/EditUserPage.tsx
export function EditUserPage() {
  const { userId } = Route.useParams()
  const { data: user, isLoading } = useGetUserById(userId)
  const updateUser = useUpdateUser()
  const navigate = useNavigate()

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
  })

  // Cargar datos cuando estén disponibles
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        role: user.role,
        isActive: user.isActive,
      })
    }
  }, [user, form])

  if (isLoading) return <FormSkeleton />

  const onSubmit = (data: UpdateUserFormData) => {
    updateUser.mutate(
      { id: userId, data },
      { onSuccess: () => navigate({ to: '/users' }) }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Campos del formulario */}
      </form>
    </Form>
  )
}
```

## Reglas Importantes

- SIEMPRE usar `mode: 'onChange'` en useForm
- SIEMPRE usar componentes Form de Shadcn/ui (FormField, FormItem, etc.)
- SelectItem NUNCA debe tener value vacío
- Formularios de crear y editar deben ser componentes separados
- Usar `form.formState.isValid` para deshabilitar botón de submit
