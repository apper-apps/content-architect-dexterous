import serpData from "@/services/mockData/serpResults.json"

class SERPService {
  constructor() {
    this.serpResults = [...serpData]
  }
  
  async analyzeSERP(keyword) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate keyword-specific SERP results
    const results = this.serpResults.map((result, index) => ({
      ...result,
      Id: index + 1,
      position: index + 1,
      title: this.generateTitle(keyword, result.title),
      description: this.generateDescription(keyword, result.description),
      keywords: this.generateKeywords(keyword),
      entities: this.generateEntities(keyword),
    }))
    
    return results
  }
  
  generateTitle(keyword, baseTitle) {
    const templates = [
      `${keyword} - Complete Guide | ${baseTitle}`,
      `Best ${keyword} Solutions for 2024 | ${baseTitle}`,
      `${keyword}: Expert Tips & Strategies | ${baseTitle}`,
      `How to Master ${keyword} | ${baseTitle}`,
      `${keyword} Made Simple | ${baseTitle}`,
      `Ultimate ${keyword} Resource | ${baseTitle}`,
      `${keyword} Best Practices | ${baseTitle}`,
      `Professional ${keyword} Services | ${baseTitle}`,
      `${keyword} for Beginners | ${baseTitle}`,
      `Advanced ${keyword} Techniques | ${baseTitle}`,
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  generateDescription(keyword, baseDescription) {
    const templates = [
      `Discover the best ${keyword} strategies and techniques. ${baseDescription}`,
      `Learn ${keyword} from experts. ${baseDescription}`,
      `Master ${keyword} with our comprehensive guide. ${baseDescription}`,
      `Get started with ${keyword} today. ${baseDescription}`,
      `Professional ${keyword} solutions and services. ${baseDescription}`,
      `Everything you need to know about ${keyword}. ${baseDescription}`,
      `${keyword} made easy with step-by-step instructions. ${baseDescription}`,
      `Transform your approach to ${keyword}. ${baseDescription}`,
      `Unlock the power of ${keyword} for better results. ${baseDescription}`,
      `Expert ${keyword} advice and best practices. ${baseDescription}`,
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  generateKeywords(keyword) {
    const baseKeywords = keyword.toLowerCase().split(" ")
    const relatedTerms = [
      "best", "guide", "tips", "strategies", "solutions", "services",
      "expert", "professional", "advanced", "beginner", "tutorial",
      "how to", "complete", "ultimate", "comprehensive", "effective"
    ]
    
    const keywords = [
      keyword,
      `best ${keyword}`,
      `${keyword} guide`,
      `${keyword} tips`,
      `how to ${keyword}`,
      ...baseKeywords.map(term => `${term} solutions`),
      ...relatedTerms.slice(0, 5).map(term => `${term} ${keyword}`),
    ]
    
    return keywords.slice(0, 8)
  }
  
  generateEntities(keyword) {
    const keywordWords = keyword.toLowerCase().split(" ")
    const commonEntities = [
      "strategy", "implementation", "optimization", "analysis", "planning",
      "management", "development", "performance", "efficiency", "innovation",
      "technology", "automation", "integration", "scalability", "ROI",
      "KPI", "metrics", "analytics", "insights", "trends"
    ]
    
    const entities = [
      ...keywordWords,
      ...commonEntities.slice(0, Math.floor(Math.random() * 8) + 5)
    ]
    
    return entities.slice(0, 12)
  }
}

export const serpService = new SERPService()