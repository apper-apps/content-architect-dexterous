import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data found", 
  message = "Get started by creating your first project.", 
  action,
  actionLabel = "Get Started",
  icon = "FileText"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-64 space-y-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-blue-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold gradient-text">
          {title}
        </h3>
        <p className="text-slate-400">
          {message}
        </p>
      </div>
      
      {action && (
        <Button 
          onClick={action}
          variant="primary"
          size="lg"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Empty