import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { createPortal } from "react-dom"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  const toasterElement = (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )

  // Renderizar en el body del documento para evitar conflictos con modales
  if (typeof window !== "undefined") {
    return createPortal(toasterElement, document.body)
  }

  return toasterElement
}

export { Toaster }
