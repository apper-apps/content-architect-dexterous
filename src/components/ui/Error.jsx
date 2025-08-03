import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-64 space-y-6 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-slate-200">
          {title}
        </h3>
        <p className="text-slate-400">
          {message}
        </p>
      </div>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Error