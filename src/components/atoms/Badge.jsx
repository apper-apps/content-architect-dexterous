import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-slate-700 text-slate-200 border-slate-600",
    primary: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    success: "bg-green-600/20 text-green-300 border-green-500/30",
    warning: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
    danger: "bg-red-600/20 text-red-300 border-red-500/30",
    entity: "bg-purple-600/20 text-purple-300 border-purple-500/30",
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge