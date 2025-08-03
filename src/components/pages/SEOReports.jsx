import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Chart from "react-apexcharts"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import StatCard from "@/components/molecules/StatCard"
import SEOScoreRing from "@/components/molecules/SEOScoreRing"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { setProjects, setLoading, setError } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"
import { contentService } from "@/services/api/contentService"
import { serpService } from "@/services/api/serpService"
const SEOReports = () => {
const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const [contents, setContents] = useState([])
  const [timeRange, setTimeRange] = useState("30")
  const [urlInput, setUrlInput] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [liveAnalysisResults, setLiveAnalysisResults] = useState([])
  const [chartData, setChartData] = useState({
    seoTrends: { series: [], categories: [] },
    contentPerformance: { series: [], categories: [] },
    keywordDistribution: { series: [], labels: [] },
  })
  useEffect(() => {
loadReportsData()
  }, [timeRange])
  
  const loadReportsData = async () => {
    dispatch(setLoading(true))
    try {
      const [projectsData, contentsData] = await Promise.all([
        projectsService.getAll(),
        contentService.getAll(),
      ])
      
      dispatch(setProjects(projectsData))
      setContents(contentsData)
      
      // Generate chart data with live analysis results
      generateChartData([...projectsData, ...liveAnalysisResults], contentsData)
    } catch (err) {
      dispatch(setError("Failed to load reports data. Please try again."))
      toast.error("Failed to load reports data")
    }
  }
  
  const handleAnalyzeWebsite = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a website URL to analyze")
      return
    }
    
    setAnalyzing(true)
    try {
      toast.info("Analyzing website for SEO report... This may take a moment")
      const analysis = await serpService.analyzeWebsite(urlInput.trim())
      
      // Convert analysis to project-like format for charts
      const projectData = {
        Id: Date.now(),
        targetKeyword: analysis.keyword,
        seoScore: analysis.seoScore,
        businessType: 'Live Analysis',
        websiteUrl: analysis.url,
        domain: analysis.domain,
        contentCount: Math.floor(analysis.contentAnalysis?.wordCount / 100) || 0,
        status: 'Analyzed',
        createdAt: new Date().toISOString()
      }
      
      setLiveAnalysisResults(prev => [projectData, ...prev.slice(0, 9)]) // Keep last 10
      toast.success(`Website analyzed! SEO Score: ${analysis.seoScore}%`)
      
      // Refresh chart data
      generateChartData([...projects, projectData], contents)
      
    } catch (err) {
      toast.error(err.message || "Failed to analyze website")
      console.error("Website analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
  }
  
  const generateChartData = (projectsData, contentsData) => {
    const allData = [...projectsData, ...liveAnalysisResults]
    
    // SEO Trends Chart
    const seoTrends = {
      series: [{
        name: "SEO Score",
        data: allData.map(p => p.seoScore || 0)
      }],
      categories: allData.map(p => {
        const keyword = p.targetKeyword || p.domain || 'Unknown'
        return keyword.length > 20 ? keyword.substring(0, 20) + "..." : keyword
      })
    }
    
    // Content Performance Chart  
    const contentPerformance = {
      series: [
        {
          name: "Content Count",
          data: allData.map(p => p.contentCount || 0)
        },
        {
          name: "SEO Score", 
          data: allData.map(p => p.seoScore || 0)
        }
      ],
      categories: allData.map(p => p.businessType || 'Analysis')
    }
    
    // Keyword Distribution Pie Chart
    const businessTypes = {}
    allData.forEach(p => {
      const type = p.businessType || 'Live Analysis'
      businessTypes[type] = (businessTypes[type] || 0) + 1
    })
    
    const keywordDistribution = {
      series: Object.values(businessTypes),
      labels: Object.keys(businessTypes)
    }
    
    setChartData({
      seoTrends,
      contentPerformance,
      keywordDistribution,
    })
  }
  
  const retryLoad = () => {
    dispatch(setError(null))
    loadReportsData()
  }
  
  // Calculate stats
const allAnalysisData = [...projects, ...liveAnalysisResults]
  
  const stats = {
    avgSeoScore: allAnalysisData.length > 0 
      ? Math.round(allAnalysisData.reduce((sum, p) => sum + (p.seoScore || 0), 0) / allAnalysisData.length)
      : 0,
    totalContent: contents.length,
    liveAnalyses: liveAnalysisResults.length,
    topPerformer: allAnalysisData.length > 0 
      ? allAnalysisData.reduce((best, current) => 
          (current.seoScore || 0) > (best.seoScore || 0) ? current : best
        )
      : null,
    improvementOpportunity: allAnalysisData.filter(p => (p.seoScore || 0) < 70).length,
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
          title="Reports Error"
          message={error}
          onRetry={retryLoad}
        />
      </div>
    )
  }
  
if (projects.length === 0 && liveAnalysisResults.length === 0) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">SEO Reports</h1>
            <p className="text-slate-400 mt-2">Analyze websites in real-time to generate performance reports</p>
          </div>
        </div>
        
        {/* Website Analysis Section */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ApperIcon name="Search" className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-slate-200">Website SEO Analysis</h2>
          </div>
          
          <div className="max-w-2xl">
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
              Enter any website URL to generate comprehensive SEO reports with real-time data analysis.
            </p>
          </div>
        </Card>
        
        <Empty
          title="No data to report yet"
          message="Analyze some websites above to see performance insights and analytics."
          icon="BarChart3"
        />
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-8">
{/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">SEO Reports</h1>
          <p className="text-slate-400 mt-2">Real-time website analysis and performance tracking</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Website Analysis Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ApperIcon name="Search" className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-slate-200">Analyze New Website</h2>
        </div>
        
        <div className="max-w-2xl">
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
            Enter any website URL to generate comprehensive SEO reports with real-time data analysis.
          </p>
        </div>
      </Card>
      
      {/* Key Metrics */}
{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average SEO Score"
          value={stats.avgSeoScore}
          icon="TrendingUp"
          trend={stats.avgSeoScore >= 75 ? "up" : stats.avgSeoScore >= 50 ? "neutral" : "down"}
          change={`${stats.avgSeoScore >= 70 ? "Good" : "Needs work"}`}
        />
        <StatCard
          title="Live Analyses"
          value={stats.liveAnalyses}
          icon="Activity"
          trend="up"
          change="Real-time data"
        />
        <StatCard
          title="Top Performer"
          value={stats.topPerformer ? `${stats.topPerformer.seoScore}%` : "N/A"}
          icon="Award"
          trend="up"
          change={stats.topPerformer?.targetKeyword?.substring(0, 15) + "..." || stats.topPerformer?.domain?.substring(0, 15) + "..." || "N/A"}
        />
        <StatCard
          title="Need Optimization"
          value={stats.improvementOpportunity}
          icon="AlertTriangle"
          trend={stats.improvementOpportunity > 0 ? "down" : "up"}
          change="Sites under 70%"
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-blue-400" />
            <span>SEO Score Trends</span>
            <Badge variant="success" className="text-xs">Live</Badge>
          </h3>
          
          <Chart
            options={{
              chart: {
                type: "line",
                background: "transparent",
                toolbar: { show: false },
              },
              theme: { mode: "dark" },
              stroke: {
                curve: "smooth",
                width: 3,
                colors: ["#3b82f6"],
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.3,
                  opacityTo: 0.1,
                  stops: [0, 100],
                  colorStops: [
                    { offset: 0, color: "#3b82f6", opacity: 0.3 },
                    { offset: 100, color: "#3b82f6", opacity: 0.1 },
                  ],
                },
              },
              xaxis: {
                categories: chartData.seoTrends.categories,
                labels: { style: { colors: "#94a3b8" } },
              },
              yaxis: {
                labels: { style: { colors: "#94a3b8" } },
                min: 0,
                max: 100,
              },
              grid: {
                borderColor: "#334155",
                strokeDashArray: 3,
              },
              tooltip: {
                theme: "dark",
                style: { fontSize: "12px" },
              },
            }}
            series={chartData.seoTrends.series}
            type="area"
            height={300}
          />
        </Card>
        
        {/* Analysis Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <ApperIcon name="PieChart" className="w-5 h-5 text-blue-400" />
            <span>Analysis Distribution</span>
            <Badge variant="success" className="text-xs">Real-time</Badge>
          </h3>
          
          <Chart
            options={{
              chart: {
                type: "donut",
                background: "transparent",
              },
              theme: { mode: "dark" },
              colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316"],
              labels: chartData.keywordDistribution.labels,
              legend: {
                position: "bottom",
                labels: { colors: "#94a3b8" },
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: "60%",
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        label: "Total",
                        color: "#e2e8f0",
                      },
                    },
                  },
                },
              },
              tooltip: {
                theme: "dark",
                style: { fontSize: "12px" },
              },
            }}
            series={chartData.keywordDistribution.series}
            type="donut"
            height={300}
          />
        </Card>
      </div>
      
      {/* Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
            <ApperIcon name="Table" className="w-5 h-5 text-blue-400" />
            <span>Analysis Results</span>
            <Badge variant="success" className="text-xs">Live Data</Badge>
          </h3>
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Website</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">SEO Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Content</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Analyzed</th>
              </tr>
            </thead>
            <tbody>
              {allAnalysisData.map((item, index) => (
                <motion.tr
                  key={item.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-200 truncate max-w-[200px]">
                        {item.targetKeyword || item.domain || 'Unknown'}
                      </div>
                      <div className="text-sm text-slate-400 truncate">
                        {item.websiteUrl ? new URL(item.websiteUrl).hostname : item.domain || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={item.businessType === 'Live Analysis' ? "success" : "primary"}>
                      {item.businessType || 'Analysis'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <SEOScoreRing score={item.seoScore || 0} size="sm" />
                      <span className="text-slate-200 font-medium">
                        {item.seoScore || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-300">{item.contentCount || 0}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={item.status === "Active" ? "success" : item.status === "Analyzed" ? "primary" : "default"}>
                      {item.status || 'Complete'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default SEOReports