# TanStack Table (Tablas con Server-Side Pagination)

Este proyecto usa TanStack Table para tablas con paginación del lado del servidor.

## Definir Columnas

```tsx
// src/features/users/components/UsersTable/columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { User } from '../../types/user.types'
import { ActionsDropdown } from './ActionsDropdown'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Correo electrónico',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de creación',
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('es-ES')
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionsDropdown user={row.original} />,
  },
]
```

## Componente de Tabla con Paginación Server-Side

```tsx
// src/features/users/components/UsersTable/UsersTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

interface UsersTableProps {
  data: User[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function UsersTable({
  data,
  total,
  page,
  pageSize,
  onPageChange
}: UsersTableProps) {
  const pageCount = Math.ceil(total / pageSize)

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize })
        onPageChange(newState.pageIndex + 1)
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No hay resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">
          Mostrando {data.length} de {total} registros
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-2">
            Página {page} de {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## Dropdown de Acciones

```tsx
// src/features/users/components/UsersTable/ActionsDropdown.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { PermissionDropdownItem } from '@/components/permissions'

export function ActionsDropdown({ user }: { user: User }) {
  const navigate = useNavigate()
  const deleteUser = useDeleteUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PermissionDropdownItem
          permission="users.edit"
          onClick={() => navigate({ to: '/users/$userId/edit', params: { userId: user.id } })}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </PermissionDropdownItem>
        <PermissionDropdownItem
          permission="users.delete"
          onClick={() => deleteUser.mutate(user.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </PermissionDropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Uso en Página Admin

```tsx
// src/features/users/pages/AdminUsersPage.tsx
export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading } = useGetUsers(page, pageSize)

  if (isLoading) return <TableSkeleton />

  return (
    <UsersTable
      data={data?.data ?? []}
      total={data?.total ?? 0}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
    />
  )
}
```
