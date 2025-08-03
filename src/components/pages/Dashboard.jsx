import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import StatCard from "@/components/molecules/StatCard"
import SEOScoreRing from "@/components/molecules/SEOScoreRing"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { setProjects, setLoading, setError, setAnalysisData } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"
import { contentService } from "@/services/api/contentService"
import { serpService } from "@/services/api/serpService"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
const { projects, loading, error, analysisData } = useSelector((state) => state.projects)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalContent: 0,
    avgSeoScore: 0,
  })
  const [urlInput, setUrlInput] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  
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
      
      // Calculate stats with real analysis data
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
      toast.error("Failed to load dashboard data")
    }
  }
  
  const handleAnalyzeWebsite = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a website URL to analyze")
      return
    }
    
    setAnalyzing(true)
    try {
      toast.info("Analyzing website... This may take a moment")
      const analysis = await serpService.analyzeWebsite(urlInput.trim())
      
      setAnalysisResults(analysis)
      dispatch(setAnalysisData(analysis))
      
      toast.success(`Analysis complete! SEO Score: ${analysis.seoScore}%`)
      
// Update stats with fresh analysis data
      setStats(prev => ({
        ...prev,
        avgSeoScore: Math.round((prev.avgSeoScore + analysis.seoScore) / 2),
        lastAnalysis: analysis.domain,
        analysisCount: (prev.analysisCount || 0) + 1
      }))
      
      toast.success(`Fresh SEO analysis completed! Score: ${analysis.seoScore}% for ${analysis.domain}`)
    } catch (err) {
      toast.error(err.message || "Failed to analyze website")
      console.error("Website analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
}

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text('SEO Analysis Report', 20, 30)
      
      // Add generation date
      doc.setFontSize(12)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      
      // Add stats
      doc.setFontSize(14)
      doc.text('Performance Summary', 20, 65)
      doc.setFontSize(11)
      doc.text(`Average SEO Score: ${stats.avgSeoScore}%`, 25, 80)
      doc.text(`Total Projects: ${activeProjects.length}`, 25, 90)
      doc.text(`Total Content: ${stats.totalContent}`, 25, 100)
      
      // Add recent analysis if available
      if (analysis) {
        doc.setFontSize(14)
        doc.text('Latest Analysis', 20, 120)
        doc.setFontSize(11)
        doc.text(`Website: ${analysis.domain}`, 25, 135)
        doc.text(`SEO Score: ${analysis.seoScore}%`, 25, 145)
        doc.text(`Keyword: ${analysis.keyword}`, 25, 155)
        doc.text(`Analysis Date: ${new Date(analysis.generatedAt || Date.now()).toLocaleDateString()}`, 25, 165)
      }
      
      doc.save('seo-report.pdf')
      toast.success('SEO report downloaded successfully!')
    } catch (err) {
      toast.error('Failed to generate PDF report')
      console.error('PDF generation error:', err)
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
          <p className="text-slate-400 mt-2">Analyze websites in real-time and manage your SEO content projects</p>
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
      
      {/* Website Analysis Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ApperIcon name="Search" className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-slate-200">Real-Time Website Analysis</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FormField
              label="Website URL"
              className="mb-4"
            >
              <div className="flex space-x-3">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1"
                  disabled={analyzing}
                />
                <Button
                  onClick={handleAnalyzeWebsite}
                  disabled={analyzing || !urlInput.trim()}
                  variant="primary"
                  className="flex items-center space-x-2 min-w-[120px]"
                >
                  {analyzing ? (
                    <>
                      <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Search" className="w-4 h-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </Button>
              </div>
            </FormField>
            
            <p className="text-sm text-slate-400">
              Enter any website URL to get real-time SEO analysis, performance metrics, and optimization recommendations.
            </p>
          </div>
          
          {analysisResults && (
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
<div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-200">Latest Analysis</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" className="text-xs">Live Data</Badge>
                      {analysis && (
                        <Button
                          onClick={handleDownloadPDF}
                          variant="ghost"
                          size="sm"
                          className="text-xs flex items-center space-x-1"
                        >
                          <ApperIcon name="Download" className="w-3 h-3" />
                          <span>PDF</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">SEO Score</span>
                    <div className="flex items-center space-x-2">
                      <SEOScoreRing score={analysisResults.seoScore} size="sm" />
                      <span className="text-slate-200 font-medium">{analysisResults.seoScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Performance</span>
                    <span className="text-slate-200">{analysisResults.metrics?.performance || 'N/A'}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Mobile Score</span>
                    <span className="text-slate-200">{analysisResults.metrics?.mobileScore || 'N/A'}%</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      Analyzed: {new Date(analysisResults.lastAnalyzed).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
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
          change="Real-time tracking"
        />
        <StatCard
          title="Content Pieces"
          value={stats.totalContent}
          icon="FileText"
          trend="up"
          change="Live content analysis"
        />
        <StatCard
          title="Avg SEO Score"
          value={stats.avgSeoScore}
          icon="TrendingUp"
          trend={stats.avgSeoScore >= 75 ? "up" : stats.avgSeoScore >= 50 ? "neutral" : "down"}
          change={`${stats.avgSeoScore >= 70 ? "Good" : "Needs improvement"}`}
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