import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  type = "text", 
  className,
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border bg-slate-800 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error 
          ? "border-red-500 focus:ring-red-500" 
          : "border-slate-600 focus:border-blue-500 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input