import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import { addProject } from "@/store/slices/projectsSlice"
import { projectsService } from "@/services/api/projectsService"

const ProjectWizard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessType: "",
    websiteUrl: "",
    targetKeyword: "",
    location: "",
    language: "English",
    toneOfVoice: "Professional",
    additionalInfo: "",
  })
  
  const steps = [
    { id: 1, title: "Business Info", icon: "Building2" },
    { id: 2, title: "Target Keywords", icon: "Target" },
    { id: 3, title: "Preferences", icon: "Settings" },
    { id: 4, title: "Review", icon: "CheckCircle" },
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const projectData = {
        ...formData,
        status: "Active",
        createdAt: new Date().toISOString(),
        seoScore: 0,
        contentCount: 0,
      }
      
      const newProject = await projectsService.create(projectData)
      dispatch(addProject(newProject))
      
      toast.success("Project created successfully!")
      navigate(`/project/${newProject.Id}/analyzer`)
    } catch (error) {
      toast.error("Failed to create project. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold gradient-text mb-2">Business Information</h2>
              <p className="text-slate-400">Tell us about your business and website</p>
            </div>
            
            <FormField label="Business Type" required>
              <Select
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
              >
                <option value="">Select business type</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Agency">Marketing Agency</option>
                <option value="Blog">Blog/Content Site</option>
                <option value="Local Business">Local Business</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Other">Other</option>
              </Select>
            </FormField>
            
            <FormField label="Website URL" required>
              <Input
                type="url"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
              />
            </FormField>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold gradient-text mb-2">Target Keywords</h2>
              <p className="text-slate-400">Define your primary keyword and location</p>
            </div>
            
            <FormField label="Primary Target Keyword" required>
              <Input
                placeholder="e.g., best project management software"
                value={formData.targetKeyword}
                onChange={(e) => handleInputChange("targetKeyword", e.target.value)}
              />
            </FormField>
            
            <FormField label="Target Location">
              <Input
                placeholder="e.g., United States, New York, Worldwide"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </FormField>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold gradient-text mb-2">Content Preferences</h2>
              <p className="text-slate-400">Set your content style and language</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Language">
                <Select
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Italian">Italian</option>
                </Select>
              </FormField>
              
              <FormField label="Tone of Voice">
                <Select
                  value={formData.toneOfVoice}
                  onChange={(e) => handleInputChange("toneOfVoice", e.target.value)}
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Authority">Authority</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Technical">Technical</option>
                  <option value="Creative">Creative</option>
                </Select>
              </FormField>
            </div>
            
            <FormField label="Additional Information">
              <Textarea
                placeholder="Any specific requirements, competitor info, or content guidelines..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              />
            </FormField>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold gradient-text mb-2">Review & Confirm</h2>
              <p className="text-slate-400">Please review your project settings</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-lg p-4">
                  <h3 className="font-semibold text-slate-200 mb-2">Business Details</h3>
                  <p className="text-sm text-slate-400 mb-1">Type: {formData.businessType}</p>
                  <p className="text-sm text-slate-400">Website: {formData.websiteUrl}</p>
                </div>
                
                <div className="glass-panel rounded-lg p-4">
                  <h3 className="font-semibold text-slate-200 mb-2">Keywords & Location</h3>
                  <p className="text-sm text-slate-400 mb-1">Keyword: {formData.targetKeyword}</p>
                  <p className="text-sm text-slate-400">Location: {formData.location || "Worldwide"}</p>
                </div>
              </div>
              
              <div className="glass-panel rounded-lg p-4">
                <h3 className="font-semibold text-slate-200 mb-2">Content Preferences</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-slate-400">Language: {formData.language}</p>
                  <p className="text-slate-400">Tone: {formData.toneOfVoice}</p>
                </div>
                {formData.additionalInfo && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-400">{formData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white"
                    : "border-slate-600 text-slate-400"
                }`}>
                  <ApperIcon name={step.icon} className="w-5 h-5" />
                </div>
                <span className={`text-sm mt-2 transition-colors ${
                  currentStep >= step.id ? "text-blue-400" : "text-slate-400"
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-colors ${
                  currentStep > step.id ? "bg-blue-500" : "bg-slate-600"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      <Card className="p-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        {currentStep < 4 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <ApperIcon name="Rocket" className="w-4 h-4" />
            )}
            <span>{loading ? "Creating..." : "Create Project"}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProjectWizard