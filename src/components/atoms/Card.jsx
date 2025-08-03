import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className,
  children,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "glass-panel",
    solid: "bg-slate-800 border border-slate-700",
    gradient: "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl shadow-lg transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card