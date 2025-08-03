import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import SERPAnalyzer from "@/components/organisms/SERPAnalyzer"
import { setActiveProject, setLoading, setError } from "@/store/slices/projectsSlice"
import { setEntities } from "@/store/slices/contentSlice"
import { projectsService } from "@/services/api/projectsService"

const ProjectAnalyzer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { activeProject, loading, error } = useSelector((state) => state.projects)
  const [extractedEntities, setExtractedEntities] = useState([])
  
  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])
  
  const loadProject = async () => {
    dispatch(setLoading(true))
    try {
      const project = await projectsService.getById(parseInt(id))
      dispatch(setActiveProject(project))
    } catch (err) {
      dispatch(setError("Failed to load project. Please try again."))
    }
  }
  
  const handleEntitiesExtracted = (entities) => {
    setExtractedEntities(entities)
    dispatch(setEntities(entities))
  }
  
  const handleStartContentCreation = () => {
    navigate(`/project/${id}/editor`)
  }
  
  const retryLoad = () => {
    dispatch(setError(null))
    loadProject()
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Error 
          title="Project Load Error"
          message={error}
          onRetry={retryLoad}
        />
      </div>
    )
  }
  
  if (!activeProject) {
    return (
      <div className="p-6">
        <Error 
          title="Project Not Found"
          message="The requested project could not be found."
          showRetry={false}
        />
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold gradient-text">SERP Analysis</h1>
          <p className="text-slate-400 mt-2">
            Analyzing top results for "<span className="text-blue-400">{activeProject.targetKeyword}</span>"
          </p>
        </div>
        
        <Button
          onClick={handleStartContentCreation}
          variant="primary"
          size="lg"
          disabled={extractedEntities.length === 0}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Edit3" className="w-5 h-5" />
          <span>Create Content</span>
        </Button>
      </div>
      
      {/* Project Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Target" className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Target Keyword</h3>
            <p className="text-sm text-slate-400">{activeProject.targetKeyword}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Building2" className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Business Type</h3>
            <p className="text-sm text-slate-400">{activeProject.businessType}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Globe" className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Location</h3>
            <p className="text-sm text-slate-400">{activeProject.location || "Worldwide"}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="MessageSquare" className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Tone</h3>
            <p className="text-sm text-slate-400">{activeProject.toneOfVoice}</p>
          </div>
        </div>
      </Card>
      
      {/* SERP Analysis Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SERPAnalyzer 
          keyword={activeProject.targetKeyword}
          onEntitiesExtracted={handleEntitiesExtracted}
        />
      </motion.div>
      
      {/* Analysis Summary */}
      {extractedEntities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-400" />
                <span>Analysis Complete</span>
              </h3>
              
              <div className="text-sm text-slate-400">
                {extractedEntities.length} entities extracted
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  {extractedEntities.length}
                </div>
                <div className="text-sm text-slate-400">Semantic Entities</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">10</div>
                <div className="text-sm text-slate-400">SERP Results Analyzed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  {Math.round(extractedEntities.reduce((sum, e) => sum + e.count, 0) / 10)}
                </div>
                <div className="text-sm text-slate-400">Avg Entity Frequency</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-slate-400 mb-4">
                Ready to create SEO-optimized content based on this analysis
              </p>
              
              <Button
                onClick={handleStartContentCreation}
                variant="primary"
                size="lg"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Sparkles" className="w-5 h-5" />
                <span>Generate Content Now</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectAnalyzer