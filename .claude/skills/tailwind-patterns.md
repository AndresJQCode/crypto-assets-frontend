# Tailwind CSS Patterns

Este proyecto usa Tailwind CSS 4 para estilos.

## Clases de Layout Comunes

```tsx
// Flexbox
className="flex items-center justify-between"
className="flex items-center gap-4"
className="flex flex-col gap-2"
className="flex-1" // Ocupa espacio disponible

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
className="grid grid-cols-12 gap-4"

// Contenedor con ancho máximo
className="container mx-auto px-4"
className="max-w-4xl mx-auto"
```

## Espaciado y Padding

```tsx
// Espaciado entre elementos hijos
className="space-y-4"  // Vertical
className="space-x-4"  // Horizontal

// Padding
className="p-4"        // Todos los lados
className="px-4 py-2"  // Horizontal y vertical
className="pt-6"       // Solo arriba

// Margin
className="mt-4"       // Arriba
className="mb-6"       // Abajo
className="mx-auto"    // Centrar horizontalmente
```

## Cards y Contenedores

```tsx
// Card básica
className="rounded-lg border bg-card p-6"

// Card con sombra
className="rounded-lg border bg-card p-6 shadow-sm"

// Card interactiva
className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"

// Contenedor con fondo
className="rounded-lg bg-muted p-4"
```

## Tipografía

```tsx
// Títulos
className="text-2xl font-bold"
className="text-xl font-semibold"
className="text-lg font-medium"

// Texto secundario
className="text-sm text-muted-foreground"

// Texto de error
className="text-sm text-destructive"

// Truncar texto
className="truncate"
className="line-clamp-2" // Máximo 2 líneas
```

## Estados y Transiciones

```tsx
// Hover
className="hover:bg-accent"
className="hover:text-accent-foreground"
className="hover:opacity-80"

// Focus
className="focus:outline-none focus:ring-2 focus:ring-ring"

// Disabled
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Transiciones
className="transition-colors"
className="transition-all duration-200"
```

## Función cn() para Clases Condicionales

```tsx
import { cn } from '@/lib/utils'

// Clases condicionales
<div className={cn(
  "base-classes p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed",
  variant === "outline" && "border-2"
)}>

// En componentes
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

function CustomButton({ variant = 'default', size = 'md', className }: ButtonProps) {
  return (
    <button className={cn(
      "rounded-md font-medium transition-colors",
      {
        'bg-primary text-primary-foreground': variant === 'default',
        'border border-input bg-background': variant === 'outline',
        'hover:bg-accent': variant === 'ghost',
      },
      {
        'px-3 py-1 text-sm': size === 'sm',
        'px-4 py-2': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },
      className
    )} />
  )
}
```

## Responsive Design

```tsx
// Mobile first
className="text-sm md:text-base lg:text-lg"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden md:block"  // Oculto en mobile
className="md:hidden"        // Solo en mobile

// Padding responsive
className="p-4 md:p-6 lg:p-8"
```

## Colores del Sistema

```tsx
// Fondos
className="bg-background"      // Fondo principal
className="bg-card"            // Fondo de cards
className="bg-muted"           // Fondo secundario
className="bg-accent"          // Fondo de acento
className="bg-primary"         // Color primario
className="bg-destructive"     // Color de error/eliminar

// Textos
className="text-foreground"           // Texto principal
className="text-muted-foreground"     // Texto secundario
className="text-primary"              // Texto primario
className="text-destructive"          // Texto de error

// Bordes
className="border-border"      // Borde estándar
className="border-input"       // Borde de inputs
```

## Patrones de Página

```tsx
// Layout de página admin
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Título</h1>
    <Button>Acción</Button>
  </div>

  {/* Filtros */}
  <div className="flex flex-wrap gap-4">
    <Input placeholder="Buscar..." className="max-w-sm" />
    <Select>...</Select>
  </div>

  {/* Contenido */}
  <Card>
    <CardContent className="p-0">
      <Table>...</Table>
    </CardContent>
  </Card>
</div>
```

## Formularios

```tsx
// Layout de formulario
<form className="space-y-6 max-w-2xl">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField>...</FormField>
    <FormField>...</FormField>
  </div>

  <FormField>...</FormField>

  {/* Botones */}
  <div className="flex gap-4 justify-end">
    <Button variant="outline">Cancelar</Button>
    <Button type="submit">Guardar</Button>
  </div>
</form>
```
