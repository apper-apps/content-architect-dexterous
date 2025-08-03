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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
useEffect(() => {
    if (keyword && keyword.trim()) {
      loadSerpData()
    }
  }, [keyword])
  
  const loadSerpData = async () => {
    if (!keyword || !keyword.trim()) {
      setError("Please provide a valid keyword for analysis.")
      return
    }

    setLoading(true)
    setError(null)
    setSerpResults([])
    setEntities([])
try {
      // Call the correct service method for SERP analysis
      const results = await serpService.analyzeSERP(keyword.trim())
      
      // Ensure results is an array
      const serpArray = Array.isArray(results) ? results : []
      setSerpResults(serpArray)
      
      if (serpArray.length === 0) {
        setError("No SERP results found for this keyword. Please try a different keyword.")
        return
      }
      
      // Extract entities from all results with proper error handling
      const allEntities = serpArray.reduce((acc, result) => {
        if (result && Array.isArray(result.entities)) {
          return [...acc, ...result.entities]
        }
        return acc
      }, [])
      
      if (allEntities.length === 0) {
        setError("No entities could be extracted from SERP results.")
        return
      }
      
      // Remove duplicates and count frequency
      const entityMap = {}
      allEntities.forEach(entity => {
        if (entity && typeof entity === 'string') {
          const cleanEntity = entity.trim().toLowerCase()
          if (cleanEntity.length > 0) {
            entityMap[cleanEntity] = (entityMap[cleanEntity] || 0) + 1
          }
        }
      })
      
      // Convert to array and sort by frequency
      const topEntities = Object.entries(entityMap)
        .filter(([entity, count]) => entity && count > 0)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([entity, count]) => ({ 
          name: entity.charAt(0).toUpperCase() + entity.slice(1), 
          count 
        }))
      
      setEntities(topEntities)
      
      // Notify parent component
      if (onEntitiesExtracted && typeof onEntitiesExtracted === 'function') {
        onEntitiesExtracted(topEntities)
      }
      
    } catch (err) {
      console.error('SERP Analysis Error:', err)
      const errorMessage = err.message || "Failed to analyze SERP results. Please try again."
      setError(errorMessage)
      setSerpResults([])
      setEntities([])
    } finally {
      setLoading(false)
    }
  }
  
if (loading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Loading />
          <p className="text-slate-400 mt-4">Analyzing SERP results for "{keyword}"...</p>
        </div>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className="p-8">
        <Error 
          title="SERP Analysis Error"
          message={error} 
          onRetry={loadSerpData}
        />
      </Card>
    )
  }

  if (!serpResults || serpResults.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <ApperIcon name="Search" className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Results Found</h3>
          <p className="text-slate-400 mb-4">
            No SERP results were found for the keyword "{keyword}".
          </p>
          <button
            onClick={loadSerpData}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </Card>
    )
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