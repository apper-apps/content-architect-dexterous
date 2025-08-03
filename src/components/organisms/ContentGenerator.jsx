import { useState, useEffect } from "react"
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator