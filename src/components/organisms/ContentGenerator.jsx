import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import SEOScoreRing from "@/components/molecules/SEOScoreRing"
import Badge from "@/components/atoms/Badge"
import { contentService } from "@/services/api/contentService"

const ContentGenerator = ({ project, entities = [], onContentGenerated }) => {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [faqSection, setFaqSection] = useState([])
  const [seoScore, setSeoScore] = useState(0)
const [generating, setGenerating] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [keywordFilter, setKeywordFilter] = useState('all') // all, high, medium, low
  const [showWordCloud, setShowWordCloud] = useState(true)
  
// Keyword density analysis
  const keywordAnalysis = useMemo(() => {
    if (!content || content.length < 50) return { keywords: [], totalWords: 0 }
    
    const text = content.toLowerCase()
    const words = text.match(/\b[a-zA-Z]{3,}\b/g) || []
    const totalWords = words.length
    
    // Count word frequencies
    const wordCount = {}
    words.forEach(word => {
      if (!isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
    
    // Calculate density and create keyword objects
    const keywords = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / totalWords) * 100).toFixed(2),
        category: getDensityCategory(count, totalWords),
        size: Math.min(Math.max(count * 4 + 12, 12), 36)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)
    
    return { keywords, totalWords }
  }, [content])

  const isStopWord = (word) => {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'cannot', 'will', 'shall']
    return stopWords.includes(word)
  }

  const getDensityCategory = (count, totalWords) => {
    const density = (count / totalWords) * 100
    if (density >= 2) return 'high'
    if (density >= 1) return 'medium'
    return 'low'
  }

  const filteredKeywords = useMemo(() => {
    if (keywordFilter === 'all') return keywordAnalysis.keywords
    return keywordAnalysis.keywords.filter(k => k.category === keywordFilter)
  }, [keywordAnalysis.keywords, keywordFilter])

  useEffect(() => {
    if (content) {
      analyzeSEO()
    }
  }, [content, title, metaDescription])
  
  const analyzeSEO = async () => {
    setAnalyzing(true)
    try {
      const analysis = await contentService.analyzeSEO({
        title,
        metaDescription,
        content,
        targetKeyword: project?.targetKeyword,
        entities,
      })
      setSeoScore(analysis.score)
    } catch (error) {
      console.error("SEO analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }
  
  const generateContent = async () => {
    if (!project) return
    
    setGenerating(true)
    try {
      const generatedContent = await contentService.generateContent({
        businessType: project.businessType,
        targetKeyword: project.targetKeyword,
        location: project.location,
        toneOfVoice: project.toneOfVoice,
        entities,
      })
      
      setTitle(generatedContent.title)
      setMetaDescription(generatedContent.metaDescription)
      setContent(generatedContent.body)
      setFaqSection(generatedContent.faqSection)
      
      toast.success("Content generated successfully!")
      
      if (onContentGenerated) {
        onContentGenerated(generatedContent)
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setGenerating(false)
    }
  }
  
  const saveContent = async () => {
    if (!project) return
    
    try {
      const contentData = {
        projectId: project.Id,
        title,
        metaDescription,
        body: content,
        faqSection,
        seoScore,
        entities: entities.map(e => e.name),
        createdAt: new Date().toISOString(),
      }
      
      await contentService.create(contentData)
      toast.success("Content saved successfully!")
    } catch (error) {
      toast.error("Failed to save content. Please try again.")
    }
  }
const exportWordCloud = () => {
    const cloudData = keywordAnalysis.keywords.slice(0, 25).map(k => 
      `${k.word}: ${k.count} occurrences (${k.density}% density)`
    ).join('\n')
    
    const element = document.createElement("a")
    const file = new Blob([`Keyword Density Analysis\n\nTotal Words: ${keywordAnalysis.totalWords}\n\nTop Keywords:\n${cloudData}`], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "keyword-analysis.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Keyword analysis exported!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Content Generator</h2>
          <p className="text-slate-400">Create SEO-optimized content with AI assistance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <SEOScoreRing score={seoScore} size="md" />
          
          <div className="flex space-x-2">
            <Button
              onClick={generateContent}
              disabled={generating || !project}
              variant="primary"
              className="flex items-center space-x-2"
            >
              {generating ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
              ) : (
                <ApperIcon name="Sparkles" className="w-4 h-4" />
              )}
              <span>{generating ? "Generating..." : "Generate Content"}</span>
            </Button>
            
            <Button
              onClick={saveContent}
              disabled={!content || analyzing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Save" className="w-4 h-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <FormField label="SEO Title">
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your SEO-optimized title..."
                className="min-h-[80px]"
              />
            </FormField>
          </Card>
          
          <Card className="p-6">
            <FormField label="Meta Description">
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter your meta description..."
                className="min-h-[100px]"
              />
            </FormField>
          </Card>
          
          <Card className="p-6">
            <FormField label="Article Content">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your content or click 'Generate Content' to create AI-powered content..."
                className="min-h-[400px]"
              />
            </FormField>
          </Card>
          
          {/* FAQ Section */}
          {faqSection.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
                <ApperIcon name="HelpCircle" className="w-5 h-5 text-blue-400" />
                <span>FAQ Section</span>
              </h3>
              
              <div className="space-y-4">
                {faqSection.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-lg p-4"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-blue-400" />
              <span>SEO Metrics</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Title Length</span>
                <Badge variant={title.length > 60 ? "danger" : title.length > 50 ? "warning" : "success"}>
                  {title.length}/60
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Meta Length</span>
                <Badge variant={metaDescription.length > 160 ? "danger" : metaDescription.length > 140 ? "warning" : "success"}>
                  {metaDescription.length}/160
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Word Count</span>
                <Badge variant="primary">
                  {content.split(" ").filter(word => word.length > 0).length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Reading Time</span>
                <Badge variant="primary">
                  {Math.ceil(content.split(" ").length / 200)} min
                </Badge>
              </div>
            </div>
          </Card>
          
          {/* Entity Usage */}
{/* Keyword Density Analysis */}
          {content && keywordAnalysis.totalWords > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                  <ApperIcon name="Target" className="w-5 h-5 text-blue-400" />
                  <span>Keyword Density</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWordCloud(!showWordCloud)}
                    className="text-xs"
                  >
                    <ApperIcon name={showWordCloud ? "List" : "Eye"} className="w-3 h-3 mr-1" />
                    {showWordCloud ? "List" : "Cloud"}
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 mb-4 bg-slate-800 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All', count: keywordAnalysis.keywords.length },
                  { key: 'high', label: 'High', count: keywordAnalysis.keywords.filter(k => k.category === 'high').length },
                  { key: 'medium', label: 'Medium', count: keywordAnalysis.keywords.filter(k => k.category === 'medium').length },
                  { key: 'low', label: 'Low', count: keywordAnalysis.keywords.filter(k => k.category === 'low').length }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setKeywordFilter(filter.key)}
                    className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                      keywordFilter === filter.key
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {showWordCloud ? (
                /* Word Cloud Visualization */
                <div className="relative h-64 bg-slate-800/50 rounded-lg p-4 overflow-hidden">
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-4">
                    {filteredKeywords.slice(0, 25).map((keyword, index) => (
                      <motion.div
                        key={keyword.word}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group relative cursor-pointer"
                        style={{
                          fontSize: `${keyword.size}px`,
                          transform: `rotate(${Math.random() * 20 - 10}deg)`,
                        }}
                      >
                        <span
                          className={`font-semibold transition-all duration-200 hover:scale-110 ${
                            keyword.category === 'high'
                              ? 'text-red-400 hover:text-red-300'
                              : keyword.category === 'medium'
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-blue-400 hover:text-blue-300'
                          }`}
                        >
                          {keyword.word}
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {keyword.count} uses • {keyword.density}% density
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-2 right-2 flex space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-400 rounded"></div>
                      <span className="text-slate-400">High (≥2%)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded"></div>
                      <span className="text-slate-400">Med (≥1%)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded"></div>
                      <span className="text-slate-400">Low (&lt;1%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredKeywords.slice(0, 15).map((keyword, index) => (
                    <motion.div
                      key={keyword.word}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex justify-between items-center text-sm group hover:bg-slate-800/50 rounded px-2 py-1 transition-colors"
                    >
                      <span className="text-slate-300 truncate flex-1">{keyword.word}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-xs">{keyword.count}×</span>
                        <Badge variant={
                          keyword.category === 'high' ? "danger" :
                          keyword.category === 'medium' ? "warning" : "primary"
                        }>
                          {keyword.density}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredKeywords.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No keywords found for this filter</p>
                </div>
              )}
            </Card>
          )}

          {entities.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
                <ApperIcon name="Tags" className="w-5 h-5 text-blue-400" />
                <span>Entity Usage</span>
              </h3>
              
              <div className="space-y-2">
                {entities.slice(0, 10).map((entity, index) => {
                  const mentions = (content.toLowerCase().match(new RegExp(entity.name.toLowerCase(), 'g')) || []).length
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300 truncate">{entity.name}</span>
                      <Badge variant={mentions > 0 ? "success" : "default"}>
                        {mentions}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
          
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-blue-400" />
              <span>Quick Actions</span>
            </h3>
            
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const words = content.split(" ")
                  const sentences = content.split(/[.!?]+/).filter(s => s.trim())
                  toast.info(`${words.length} words, ${sentences.length} sentences`)
                }}
              >
                <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
                Content Stats
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(content)
                  toast.success("Content copied to clipboard!")
                }}
              >
                <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const element = document.createElement("a")
                  const file = new Blob([`Title: ${title}\n\nMeta: ${metaDescription}\n\nContent:\n${content}`], {type: 'text/plain'})
                  element.href = URL.createObjectURL(file)
                  element.download = "content.txt"
                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                }}
              >
<ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export Content
              </Button>
              
              {keywordAnalysis.totalWords > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={exportWordCloud}
                >
                  <ApperIcon name="Target" className="w-4 h-4 mr-2" />
                  Export Keywords
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator