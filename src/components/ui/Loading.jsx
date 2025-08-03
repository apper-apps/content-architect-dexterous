import { motion } from "framer-motion"

const Loading = ({ variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded w-3/4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-2/3 animate-pulse" />
              <div className="h-20 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          Analyzing Content...
        </h3>
        <p className="text-slate-400 text-sm">
          Processing SERP data and extracting entities
        </p>
      </div>
    </div>
  )
}

export default Loading