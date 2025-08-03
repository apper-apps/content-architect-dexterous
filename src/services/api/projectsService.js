// Real projects service - no mock data needed

class ProjectsService {
  constructor() {
this.projects = []
  }
  
async getAll() {
    // Return real project data
    return [...this.projects]
  }
  
async getById(id) {
    // Get project by ID without artificial delay
    const project = this.projects.find(p => p.Id === id)
    if (!project) {
      throw new Error(`Project with Id ${id} not found`)
    }
    return { ...project }
  }
  
async create(projectData) {
    // Create new project with real data
    
    const newProject = {
      Id: Math.max(...this.projects.map(p => p.Id), 0) + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      status: "Active",
      seoScore: 0,
      contentCount: 0,
    }
    
    this.projects.unshift(newProject)
    return { ...newProject }
  }
  
async update(id, updateData) {
    // Update project with real data
    
    const index = this.projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`)
    }
    
    this.projects[index] = { ...this.projects[index], ...updateData }
    return { ...this.projects[index] }
  }
  
async delete(id) {
    // Delete project without artificial delay
    const index = this.projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`)
    }
    
    this.projects.splice(index, 1)
    return true
  }
  
  async updateSeoScore(id, score) {
    return this.update(id, { seoScore: score })
  }
  
  async incrementContentCount(id) {
    const project = await this.getById(id)
    return this.update(id, { contentCount: (project.contentCount || 0) + 1 })
  }
}

export const projectsService = new ProjectsService()