import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "New Project", href: "/new-project", icon: "Plus" },
    { name: "SERP Analyzer", href: "/analyzer", icon: "Search" },
    { name: "Content Editor", href: "/editor", icon: "Edit3" },
    { name: "SEO Reports", href: "/reports", icon: "BarChart3" },
  ]
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <ApperIcon name="Zap" className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">Content Architect</h1>
          <p className="text-xs text-slate-400">SEO Content Studio</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  )} 
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">AI Powered</p>
              <p className="text-xs text-slate-400">Enhanced optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700"
      >
        <ApperIcon name={isMobileOpen ? "X" : "Menu"} className="w-5 h-5 text-slate-300" />
      </button>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-slate-900/50 lg:backdrop-blur-sm lg:border-r lg:border-slate-700/50">
        <SidebarContent />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-slate-900 border-r border-slate-700/50 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar