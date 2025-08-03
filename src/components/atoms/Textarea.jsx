import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ 
  className,
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all duration-200",
        error 
          ? "border-red-500 focus:ring-red-500" 
          : "border-slate-600 focus:border-blue-500 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export default Textarea