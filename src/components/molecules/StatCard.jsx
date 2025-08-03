import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const StatCard = ({ 
  title,
  value,
  change,
  icon,
  trend = "neutral",
  className,
  ...props 
}) => {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  }
  
  const trendIcons = {
    up: "TrendingUp",
    down: "TrendingDown",
    neutral: "Minus",
  }
  
  return (
    <Card className={cn("p-6 hover:shadow-xl transition-all duration-200", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            {title}
          </p>
          <motion.p 
            className="text-3xl font-bold gradient-text"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={cn("flex items-center space-x-1 text-sm", trendColors[trend])}>
              <ApperIcon name={trendIcons[trend]} className="w-4 h-4" />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard