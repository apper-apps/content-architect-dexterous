import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const SEOScoreRing = ({ 
  score = 0, 
  size = "lg",
  className 
}) => {
  const sizes = {
    sm: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
    md: { container: "w-20 h-20", text: "text-xl", label: "text-sm" },
    lg: { container: "w-24 h-24", text: "text-2xl", label: "text-sm" },
    xl: { container: "w-32 h-32", text: "text-3xl", label: "text-base" },
  }
  
  const currentSize = sizes[size]
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }
  
  const getStrokeColor = (score) => {
    if (score >= 80) return "#10b981"
    if (score >= 60) return "#f59e0b"
    if (score >= 40) return "#f97316"
    return "#ef4444"
  }
  
  return (
    <div className={cn("relative", currentSize.container, className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-sm"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={cn("font-bold", currentSize.text, getScoreColor(score))}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {Math.round(score)}
        </motion.span>
        <span className={cn("text-slate-400 font-medium", currentSize.label)}>
          SEO
        </span>
      </div>
    </div>
  )
}

export default SEOScoreRing