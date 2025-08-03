import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { serpService } from "@/services/api/serpService"

const SERPAnalyzer = ({ keyword, onEntitiesExtracted }) => {
  const [serpResults, setSerpResults] = useState([])
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (keyword) {
      loadSerpData()
    }
  }, [keyword])
  
  const loadSerpData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await serpService.analyzeSERP(keyword)
      setSerpResults(results)
      
      // Extract entities from all results
      const allEntities = results.reduce((acc, result) => {
        return [...acc, ...result.entities]
      }, [])
      
      // Remove duplicates and count frequency
      const entityMap = {}
      allEntities.forEach(entity => {
        entityMap[entity] = (entityMap[entity] || 0) + 1
      })
      
      const topEntities = Object.entries(entityMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([entity, count]) => ({ name: entity, count }))
      
      setEntities(topEntities)
      
      if (onEntitiesExtracted) {
        onEntitiesExtracted(topEntities)
      }
    } catch (err) {
      setError("Failed to analyze SERP results. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadSerpData} />
  }
  
  return (
    <div className="space-y-6">
      {/* Entities Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <ApperIcon name="Tags" className="w-5 h-5 text-blue-400" />
          <span>Extracted Entities</span>
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {entities.map((entity, index) => (
            <motion.div
              key={entity.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Badge variant="entity" className="flex items-center space-x-1">
                <span>{entity.name}</span>
                <span className="text-xs opacity-70">({entity.count})</span>
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
      
      {/* SERP Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <ApperIcon name="Search" className="w-5 h-5 text-blue-400" />
          <span>Top 10 SERP Results</span>
        </h3>
        
        <div className="space-y-4">
          {serpResults.map((result, index) => (
            <motion.div
              key={result.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {result.position}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-200 mb-1 line-clamp-2">
                    {result.title}
                  </h4>
                  <p className="text-sm text-blue-400 mb-2 truncate">
                    {result.url}
                  </p>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {result.description}
                  </p>
                  
                  {/* Keywords & Entities */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 5).map((keyword, kidx) => (
                        <Badge key={kidx} variant="primary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {result.entities.slice(0, 3).map((entity, eidx) => (
                        <Badge key={eidx} variant="entity" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="success" className="text-xs">
                    DA: {result.domainAuthority}
                  </Badge>
                  <Badge variant="warning" className="text-xs">
                    {result.contentType}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SERPAnalyzer