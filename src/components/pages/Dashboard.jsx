import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import StatCard from "@/components/molecules/StatCard"
import SEOScoreRing from "@/components/molecules/SEOScoreRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { setProjects, setLoading, setError } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"
import { contentService } from "@/services/api/contentService"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalContent: 0,
    avgSeoScore: 0,
  })
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    dispatch(setLoading(true))
    try {
      const [projectsData, contentsData] = await Promise.all([
        projectsService.getAll(),
        contentService.getAll(),
      ])
      
      dispatch(setProjects(projectsData))
      
      // Calculate stats
      const activeProjects = projectsData.filter(p => p.status === "Active").length
      const avgScore = projectsData.length > 0 
        ? projectsData.reduce((sum, p) => sum + (p.seoScore || 0), 0) / projectsData.length
        : 0
      
      setStats({
        totalProjects: projectsData.length,
        activeProjects,
        totalContent: contentsData.length,
        avgSeoScore: Math.round(avgScore),
      })
    } catch (err) {
      dispatch(setError("Failed to load dashboard data. Please try again."))
    }
  }
  
  const handleCreateProject = () => {
    navigate("/new-project")
  }
  
  const handleProjectClick = (project) => {
    navigate(`/project/${project.Id}/analyzer`)
  }
  
  const retryLoad = () => {
    dispatch(setError(null))
    loadDashboardData()
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <Loading variant="skeleton" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Error 
          title="Dashboard Error"
          message={error}
          onRetry={retryLoad}
        />
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Content Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your SEO content projects and track performance</p>
        </div>
        
        <Button
          onClick={handleCreateProject}
          variant="primary"
          size="lg"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>New Project</span>
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="FolderOpen"
          trend="neutral"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="Activity"
          trend="up"
          change="+12% from last month"
        />
        <StatCard
          title="Content Pieces"
          value={stats.totalContent}
          icon="FileText"
          trend="up"
          change="+23% from last month"
        />
        <StatCard
          title="Avg SEO Score"
          value={stats.avgSeoScore}
          icon="TrendingUp"
          trend={stats.avgSeoScore >= 75 ? "up" : stats.avgSeoScore >= 50 ? "neutral" : "down"}
          change={`${stats.avgSeoScore >= 75 ? "+" : ""}${stats.avgSeoScore - 60}% target`}
        />
      </div>
      
      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-200">Recent Projects</h2>
          {projects.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        {projects.length === 0 ? (
          <Empty
            title="No projects yet"
            message="Create your first SEO content project to get started with AI-powered optimization."
            action={handleCreateProject}
            actionLabel="Create First Project"
            icon="Rocket"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-200 mb-1 truncate">
                        {project.targetKeyword}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">
                        {project.businessType} • {project.language}
                      </p>
                    </div>
                    
                    <SEOScoreRing score={project.seoScore || 0} size="sm" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Website</span>
                      <span className="text-slate-300 truncate ml-2">
                        {new URL(project.websiteUrl).hostname}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Location</span>
                      <span className="text-slate-300">
                        {project.location || "Worldwide"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={project.status === "Active" ? "success" : "default"}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="FileText" className="w-3 h-3" />
                          <span>{project.contentCount || 0} content</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Clock" className="w-3 h-3" />
                          <span>Updated {new Date(project.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                      
                      <ApperIcon name="ArrowRight" className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-200 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group" onClick={() => navigate("/new-project")}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
                  <ApperIcon name="Plus" className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">New Project</h3>
                  <p className="text-sm text-slate-400">Start a new SEO project</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group" onClick={() => navigate("/reports")}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all">
                  <ApperIcon name="BarChart3" className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">View Reports</h3>
                  <p className="text-sm text-slate-400">Analyze performance</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">
                  <ApperIcon name="Sparkles" className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">AI Assistant</h3>
                  <p className="text-sm text-slate-400">Get content suggestions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard