import ProjectWizard from "@/components/organisms/ProjectWizard"

const NewProject = () => {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Create New Project</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Set up your SEO content project with our intelligent wizard. We'll analyze your target keywords and generate optimized content tailored to your business.
          </p>
        </div>
        
        <ProjectWizard />
      </div>
    </div>
  )
}

export default NewProject