import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { projectsService } from "@/services/api/projectsService";
import ApperIcon from "@/components/ApperIcon";
import ContentGenerator from "@/components/organisms/ContentGenerator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { setActiveProject, setError, setLoading } from "@/store/slices/projectsSlice";

const ContentEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
const { activeProject, loading, error } = useSelector((state) => state.projects)
  const { entities } = useSelector((state) => state.content)
  const { addContent, setActiveContent } = require('@/store/slices/contentSlice')
  
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
    // Content generated successfully - dispatch to Redux store
    dispatch(addContent(content))
    dispatch(setActiveContent(content))
    toast.success("Content has been generated and saved!")
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