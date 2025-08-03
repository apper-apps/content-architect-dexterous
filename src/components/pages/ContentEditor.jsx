import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ContentGenerator from "@/components/organisms/ContentGenerator"
import { setActiveProject, setLoading, setError } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"

const ContentEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { activeProject, loading, error } = useSelector((state) => state.projects)
  const { entities } = useSelector((state) => state.content)
  
  useEffect(() => {
    if (id && (!activeProject || activeProject.Id !== parseInt(id))) {
      loadProject()
    }
  }, [id, activeProject])
  
  const loadProject = async () => {
    dispatch(setLoading(true))
    try {
      const project = await projectsService.getById(parseInt(id))
      dispatch(setActiveProject(project))
    } catch (err) {
      dispatch(setError("Failed to load project. Please try again."))
    }
  }
  
  const handleContentGenerated = (content) => {
    // Content generated successfully
    console.log("Content generated:", content)
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/project/${id}/analyzer`)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Analysis</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Content Editor</h1>
            <p className="text-slate-400 mt-2">
              Create SEO-optimized content for "<span className="text-blue-400">{activeProject.targetKeyword}</span>"
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
      
      {/* Content Generator */}
      <ContentGenerator 
        project={activeProject}
        entities={entities}
        onContentGenerated={handleContentGenerated}
      />
    </div>
  )
}

export default ContentEditor