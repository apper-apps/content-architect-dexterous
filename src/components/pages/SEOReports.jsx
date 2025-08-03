import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import Chart from "react-apexcharts"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import StatCard from "@/components/molecules/StatCard"
import SEOScoreRing from "@/components/molecules/SEOScoreRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { setProjects, setLoading, setError } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"
import { contentService } from "@/services/api/contentService"

const SEOReports = () => {
  const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const [contents, setContents] = useState([])
  const [timeRange, setTimeRange] = useState("30")
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
      
      // Generate chart data
      generateChartData(projectsData, contentsData)
    } catch (err) {
      dispatch(setError("Failed to load reports data. Please try again."))
    }
  }
  
  const generateChartData = (projectsData, contentsData) => {
    // SEO Trends Chart
    const seoTrends = {
      series: [{
        name: "SEO Score",
        data: projectsData.map(p => p.seoScore || 0)
      }],
      categories: projectsData.map(p => p.targetKeyword.substring(0, 20) + "...")
    }
    
    // Content Performance Chart
    const contentPerformance = {
      series: [
        {
          name: "Content Count",
          data: projectsData.map(p => p.contentCount || 0)
        },
        {
          name: "SEO Score",
          data: projectsData.map(p => p.seoScore || 0)
        }
      ],
      categories: projectsData.map(p => p.businessType)
    }
    
    // Keyword Distribution Pie Chart
    const businessTypes = {}
    projectsData.forEach(p => {
      businessTypes[p.businessType] = (businessTypes[p.businessType] || 0) + 1
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
  const stats = {
    avgSeoScore: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.seoScore || 0), 0) / projects.length)
      : 0,
    totalContent: contents.length,
    topPerformer: projects.length > 0 
      ? projects.reduce((best, current) => 
          (current.seoScore || 0) > (best.seoScore || 0) ? current : best
        )
      : null,
    improvementOpportunity: projects.filter(p => (p.seoScore || 0) < 70).length,
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
  
  if (projects.length === 0) {
    return (
      <div className="p-6">
        <Empty
          title="No data to report"
          message="Create some projects and content to see performance insights and analytics."
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
          <p className="text-slate-400 mt-2">Track performance and optimize your content strategy</p>
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
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average SEO Score"
          value={stats.avgSeoScore}
          icon="TrendingUp"
          trend={stats.avgSeoScore >= 75 ? "up" : stats.avgSeoScore >= 50 ? "neutral" : "down"}
          change={`${stats.avgSeoScore >= 70 ? "Good" : "Needs work"}`}
        />
        <StatCard
          title="Total Content"
          value={stats.totalContent}
          icon="FileText"
          trend="up"
          change="+23% from last period"
        />
        <StatCard
          title="Top Performer"
          value={stats.topPerformer ? `${stats.topPerformer.seoScore}%` : "N/A"}
          icon="Award"
          trend="up"
          change={stats.topPerformer?.targetKeyword.substring(0, 15) + "..."}
        />
        <StatCard
          title="Need Optimization"
          value={stats.improvementOpportunity}
          icon="AlertTriangle"
          trend={stats.improvementOpportunity > 0 ? "down" : "up"}
          change="Projects under 70%"
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-blue-400" />
            <span>SEO Score Trends</span>
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
        
        {/* Business Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <ApperIcon name="PieChart" className="w-5 h-5 text-blue-400" />
            <span>Business Type Distribution</span>
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
            <span>Project Performance</span>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Project</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Business Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">SEO Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Content</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <motion.tr
                  key={project.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-200 truncate max-w-[200px]">
                        {project.targetKeyword}
                      </div>
                      <div className="text-sm text-slate-400 truncate">
                        {new URL(project.websiteUrl).hostname}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="primary">{project.businessType}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <SEOScoreRing score={project.seoScore || 0} size="sm" />
                      <span className="text-slate-200 font-medium">
                        {project.seoScore || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-300">{project.contentCount || 0}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={project.status === "Active" ? "success" : "default"}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString()}
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