# Configuración de Cursor

Este directorio contiene la configuración de Cursor IDE para el proyecto: reglas (rules), MCP de shadcn y configuración extendida.

## Reglas (`.cursor/rules/`)

Las reglas se definen en archivos `.mdc` (Markdown con frontmatter YAML):

- **`00-general.mdc`**: Instrucciones generales, package manager (bun), Screaming Architecture, formularios, rutas. Se aplica siempre (`alwaysApply: true`).
- **Skills del proyecto** (se aplican según los archivos que edites, vía `globs`):
  - `skill-api-services.mdc` – Servicios API, getApiUrl, tipos paginados
  - `skill-feature-one-file-per-responsibility.mdc` – Un archivo por servicio y por hook
  - `skill-permissions.mdc` – PermissionGuard, PermissionButton, usePermissions
  - `skill-screaming-architecture.mdc` – Estructura por features
  - `skill-shadcn-ui.mdc` – Componentes Shadcn, toast, AlertDialog
  - `skill-react-hook-form-zod.mdc` – Formularios con RHF + Zod
  - `skill-react-19-performance.mdc` – Rendimiento y buenas prácticas React 19
  - `skill-tailwind-patterns.mdc` – Patrones Tailwind y `cn()`
  - `skill-tanstack-query.mdc` – useQuery, useMutation, queryKeys
  - `skill-tanstack-router.mdc` – Rutas, Link, useNavigate
  - `skill-tanstack-table.mdc` – Tablas con paginación server-side

Las skills detalladas (con ejemplos de código completos) siguen en `.claude/skills/`. Las reglas de Cursor resumen lo esencial y activan el contexto por globs.

## Archivos de configuración

### `mcp.json`

Archivo principal de configuración MCP que permite a Cursor acceder al servidor MCP de shadcn:

```json
{
	"mcpServers": {
		"shadcn": {
			"command": "npx",
			"args": ["shadcn@latest", "mcp"]
		}
	}
}
```

### `shadcn-config.json`

Archivo de configuración extendida que proporciona contexto adicional sobre:

- Configuración actual de shadcn/ui
- Componentes instalados
- Estructura del proyecto (Screaming Architecture)
- Aliases de importación

## Funcionalidades habilitadas

Con esta configuración, Cursor puede:

- 🔍 Mapear automáticamente los componentes de shadcn/ui
- 📦 Sugerir componentes disponibles
- 🎯 Autocompletar imports de componentes
- 🏗️ Entender la estructura del proyecto
- 🔧 Facilitar la instalación de nuevos componentes

## Uso

Una vez configurado, simplemente reinicia Cursor para que tome la nueva configuración MCP. El servidor se iniciará automáticamente cuando uses comandos relacionados con shadcn.

## Comandos útiles

Para agregar nuevos componentes de shadcn:

```bash
npx shadcn@latest add <componente>
```

Para verificar la configuración:

```bash
npx shadcn@latest mcp
```
