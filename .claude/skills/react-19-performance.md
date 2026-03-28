# React 19 + TypeScript (Rendimiento y Buenas Prácticas)

Este proyecto usa React 19 con TypeScript. Optimiza el rendimiento evitando re-renders innecesarios.

## React 19 - Nuevas Features

### use() Hook

```tsx
// Leer promesas directamente (reemplaza useEffect para data fetching)
import { use, Suspense } from 'react'

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise) // Suspende hasta resolver
  return <div>{user.name}</div>
}

// Uso con Suspense
<Suspense fallback={<Skeleton />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>

// Leer context condicionalmente
function Component({ showUser }: { showUser: boolean }) {
  if (showUser) {
    const user = use(UserContext) // Ahora válido en condicionales
    return <div>{user.name}</div>
  }
  return null
}
```

### useOptimistic

```tsx
// Actualizaciones optimistas instantáneas
import { useOptimistic } from 'react'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  )

  async function handleAdd(formData: FormData) {
    const newTodo = { id: crypto.randomUUID(), title: formData.get('title') as string }
    addOptimisticTodo(newTodo) // UI actualiza inmediatamente
    await createTodo(newTodo)  // Servidor procesa
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} className={todo.pending ? 'opacity-50' : ''}>
          {todo.title}
        </li>
      ))}
    </ul>
  )
}
```

### useFormStatus

```tsx
// Estado del formulario padre
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar'}
    </Button>
  )
}

// Uso en formulario
function UserForm() {
  async function handleSubmit(formData: FormData) {
    'use server'
    await saveUser(formData)
  }

  return (
    <form action={handleSubmit}>
      <Input name="name" />
      <SubmitButton /> {/* Automáticamente sabe si está pending */}
    </form>
  )
}
```

### useActionState

```tsx
// Manejar estado de acciones del servidor
import { useActionState } from 'react'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: LoginState, formData: FormData) => {
      const result = await login(formData)
      if (result.error) return { error: result.error }
      return { success: true }
    },
    { error: null }
  )

  return (
    <form action={formAction}>
      <Input name="email" type="email" />
      <Input name="password" type="password" />
      {state.error && <p className="text-destructive">{state.error}</p>}
      <Button disabled={isPending}>
        {isPending ? 'Iniciando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
```

## Evitar Re-renders Innecesarios

### React.memo - Memorizar Componentes

```tsx
// SOLO usar cuando el componente:
// 1. Recibe las mismas props frecuentemente
// 2. Es costoso de renderizar
// 3. El padre re-renderiza mucho

interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

// Componente memorizado
const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>{user.name}</CardHeader>
      <CardContent>
        <Button onClick={() => onEdit(user.id)}>Editar</Button>
      </CardContent>
    </Card>
  )
})

// Con comparador personalizado (casos especiales)
const UserCard = memo(
  function UserCard({ user, onEdit }: UserCardProps) {
    // ...
  },
  (prevProps, nextProps) => {
    // Retorna true si son iguales (no re-renderizar)
    return prevProps.user.id === nextProps.user.id &&
           prevProps.user.updatedAt === nextProps.user.updatedAt
  }
)
```

### useCallback - Memorizar Funciones

```tsx
// USAR cuando pasas funciones a componentes memorizados
function UserList({ users }: { users: User[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // SIN useCallback: nueva función en cada render
  // const handleSelect = (id: string) => setSelectedId(id)

  // CON useCallback: misma referencia si deps no cambian
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, []) // Sin dependencias = función estable

  const handleDelete = useCallback((id: string) => {
    deleteUser(id).then(() => {
      // Actualizar lista
    })
  }, [])

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
```

### useMemo - Memorizar Valores Computados

```tsx
// USAR para cálculos costosos
function Dashboard({ transactions }: { transactions: Transaction[] }) {
  // Cálculo costoso - solo recalcular si transactions cambia
  const stats = useMemo(() => {
    return {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      average: transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
        : 0,
      byCategory: transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>),
    }
  }, [transactions])

  // Filtrado costoso
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [users, search])

  return <StatsDisplay stats={stats} />
}
```

### NO usar memo/useCallback/useMemo cuando:

```tsx
// ❌ NO NECESARIO: Valores primitivos
const name = useMemo(() => user.firstName + ' ' + user.lastName, [user])
// ✅ MEJOR: Cálculo simple, sin memo
const name = user.firstName + ' ' + user.lastName

// ❌ NO NECESARIO: Funciones que no se pasan a hijos memorizados
const handleClick = useCallback(() => setOpen(true), [])
// ✅ MEJOR: Función simple
const handleClick = () => setOpen(true)

// ❌ NO NECESARIO: Componentes simples que renderizan rápido
const SimpleText = memo(({ text }: { text: string }) => <span>{text}</span>)
// ✅ MEJOR: Sin memo para componentes triviales
const SimpleText = ({ text }: { text: string }) => <span>{text}</span>
```

## Composición para Evitar Re-renders

### Patrón: Mover Estado Hacia Abajo

```tsx
// ❌ MALO: Todo re-renderiza cuando cambia isOpen
function Page() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <ExpensiveComponent /> {/* Re-renderiza innecesariamente */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Button onClick={() => setIsOpen(true)}>Abrir</Button>
    </div>
  )
}

// ✅ BUENO: Aislar estado en su propio componente
function Page() {
  return (
    <div>
      <ExpensiveComponent /> {/* Ya no re-renderiza */}
      <ModalWithButton />
    </div>
  )
}

function ModalWithButton() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Button onClick={() => setIsOpen(true)}>Abrir</Button>
    </>
  )
}
```

### Patrón: Children como Props

```tsx
// ❌ MALO: Children re-renderiza con el estado
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <p>Scroll: {scrollY}</p>
      <ExpensiveComponent /> {/* Re-renderiza en cada scroll */}
    </div>
  )
}

// ✅ BUENO: Children se pasa desde fuera
function ScrollTracker({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <p>Scroll: {scrollY}</p>
      {children} {/* NO re-renderiza, referencia estable */}
    </div>
  )
}

// Uso
<ScrollTracker>
  <ExpensiveComponent />
</ScrollTracker>
```

## Context Optimizado

### Separar Contextos por Frecuencia de Actualización

```tsx
// ❌ MALO: Un contexto con todo
const AppContext = createContext<{
  user: User
  theme: Theme
  notifications: Notification[]
} | null>(null)

// ✅ BUENO: Contextos separados
const UserContext = createContext<User | null>(null)
const ThemeContext = createContext<Theme>('light')
const NotificationsContext = createContext<Notification[]>([])

// Componente que solo necesita theme no re-renderiza
// cuando cambian notifications
```

### Memorizar Valor del Provider

```tsx
// ❌ MALO: Nuevo objeto en cada render del provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  return (
    <AuthContext.Provider value={{ user, setUser }}> {/* Nuevo objeto */}
      {children}
    </AuthContext.Provider>
  )
}

// ✅ BUENO: Valor memorizado
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const value = useMemo(() => ({ user, setUser }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

## TypeScript - Tipos Correctos

### Props de Componentes

```tsx
// Props con children
interface CardProps {
  title: string
  children: React.ReactNode // Para cualquier contenido
}

// Props con render prop
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactElement
}

// Props que extienden HTML
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

function Button({ variant = 'primary', isLoading, children, ...props }: ButtonProps) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? 'Cargando...' : children}
    </button>
  )
}
```

### Tipos para Hooks

```tsx
// useState con tipo explícito
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])

// useRef con tipo correcto
const inputRef = useRef<HTMLInputElement>(null)
const timerRef = useRef<NodeJS.Timeout | null>(null)

// useReducer con tipos
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: User[] }
  | { type: 'SET_ERROR'; payload: string }

interface State {
  loading: boolean
  data: User[]
  error: string | null
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
  }
}
```

### Generics en Componentes

```tsx
// Componente genérico para listas
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
}

function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  // ...
}

// Uso con inferencia de tipos
<DataTable
  data={users}           // T inferido como User
  columns={userColumns}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

## Lazy Loading y Code Splitting

```tsx
import { lazy, Suspense } from 'react'

// Cargar componente solo cuando se necesita
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))

// En rutas
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Suspense>
  )
}

// Precargar en hover (mejora UX)
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const handleMouseEnter = () => {
    // Precargar el chunk
    if (to === '/admin') {
      import('@/features/admin/pages/AdminDashboard')
    }
  }

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  )
}
```

## Keys Correctas en Listas

```tsx
// ❌ MALO: Index como key
{items.map((item, index) => (
  <Item key={index} data={item} /> // Problemas al reordenar/filtrar
))}

// ❌ MALO: Key generada en render
{items.map(item => (
  <Item key={Math.random()} data={item} /> // Re-monta en cada render
))}

// ✅ BUENO: ID único y estable
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// ✅ BUENO: Combinación si no hay ID único
{items.map(item => (
  <Item key={`${item.category}-${item.name}`} data={item} />
))}
```

## Reglas de Rendimiento

1. **Medir antes de optimizar** - Usa React DevTools Profiler
2. **memo/useCallback/useMemo** - Solo cuando hay problema real
3. **Estado lo más cerca posible** - Evita prop drilling
4. **Composición sobre herencia** - Usa children y render props
5. **Lazy loading** - Para rutas y componentes pesados
6. **Keys estables** - Nunca index para listas dinámicas
7. **Evita crear objetos/arrays en render** - Muévelos fuera o usa useMemo
