import { cn } from "@/utils/cn"

const FormField = ({ 
  label,
  children,
  error,
  required = false,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export default FormField