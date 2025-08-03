class SERPService {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 5 * 60 * 1000 // 5 minutes
  }
  
  validateUrl(url) {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }
  
  async analyzeWebsite(url, keyword = null) {
    if (!this.validateUrl(url)) {
      throw new Error('Please enter a valid URL (including http:// or https://)')
    }
    
    const cacheKey = `${url}_${keyword || 'general'}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }
    
    // Simulate real website analysis with progressive loading
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      const analysis = await this.performWebsiteAnalysis(url, keyword)
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      })
      
      return analysis
    } catch (error) {
      throw new Error(`Failed to analyze website: ${error.message}`)
    }
  }
  
  async performWebsiteAnalysis(url, keyword) {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    
    // Simulate real SEO analysis metrics
    const seoScore = this.calculateSEOScore(url, keyword)
    const pageSpeed = Math.floor(Math.random() * 40) + 60 // 60-100
    const mobileScore = Math.floor(Math.random() * 30) + 70 // 70-100
    
    return {
      url,
      domain,
      seoScore,
      keyword: keyword || this.extractMainKeyword(domain),
      metrics: {
        pageSpeed,
        mobileScore,
        accessibility: Math.floor(Math.random() * 20) + 80,
        bestPractices: Math.floor(Math.random() * 25) + 75,
        performance: pageSpeed,
        seo: seoScore
      },
      technicalSEO: {
        metaTitle: this.generateMetaTitle(domain, keyword),
        metaDescription: this.generateMetaDescription(domain, keyword),
        headings: this.analyzeHeadings(domain, keyword),
        images: {
          total: Math.floor(Math.random() * 50) + 10,
          withAlt: Math.floor(Math.random() * 30) + 20,
          optimized: Math.floor(Math.random() * 25) + 15
        },
        links: {
          internal: Math.floor(Math.random() * 100) + 20,
          external: Math.floor(Math.random() * 30) + 5,
          broken: Math.floor(Math.random() * 5)
        }
      },
      contentAnalysis: {
        wordCount: Math.floor(Math.random() * 2000) + 500,
        readabilityScore: Math.floor(Math.random() * 30) + 70,
        keywordDensity: keyword ? (Math.random() * 3 + 0.5).toFixed(2) : 'N/A',
        headingsStructure: this.analyzeHeadingStructure()
      },
      competitorAnalysis: await this.getCompetitorData(domain, keyword),
      recommendations: this.generateRecommendations(seoScore, keyword),
      lastAnalyzed: new Date().toISOString()
    }
  }
  
  calculateSEOScore(url, keyword) {
    const urlObj = new URL(url)
    let score = 50 // Base score
    
    // URL structure analysis
    if (urlObj.pathname.includes(keyword?.toLowerCase())) score += 10
    if (urlObj.pathname.split('/').length <= 4) score += 5
    if (!urlObj.pathname.includes('_')) score += 5
    
    // Domain analysis
    if (urlObj.hostname.includes(keyword?.toLowerCase())) score += 15
    if (urlObj.protocol === 'https:') score += 10
    
    // Random factors for realistic variation
    score += Math.floor(Math.random() * 20) - 10
    
    return Math.max(30, Math.min(100, score))
  }
  
  extractMainKeyword(domain) {
    const words = domain.replace(/\.(com|org|net|io|co|uk)$/i, '')
      .split(/[-.]/)
      .filter(word => word.length > 2)
    
    return words.join(' ') || domain
  }
  
  generateMetaTitle(domain, keyword) {
    const business = domain.split('.')[0]
    const templates = [
      `${keyword ? keyword + ' | ' : ''}${business} - Professional Services`,
      `Best ${keyword || 'Solutions'} from ${business}`,
      `${business} - Your ${keyword || 'Business'} Partner`,
      `${keyword ? keyword + ' Experts' : 'Professional Services'} | ${business}`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  generateMetaDescription(domain, keyword) {
    const business = domain.split('.')[0]
    const templates = [
      `Discover ${keyword || 'professional services'} with ${business}. Expert solutions, proven results, and exceptional customer service.`,
      `${business} provides top-quality ${keyword || 'services'} with a focus on innovation and customer satisfaction.`,
      `Get the best ${keyword || 'solutions'} from ${business}. Trusted by thousands of customers worldwide.`,
      `Professional ${keyword || 'services'} by ${business}. Contact us today for a free consultation and quote.`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  analyzeHeadings(domain, keyword) {
    return {
      h1: Math.floor(Math.random() * 3) + 1,
      h2: Math.floor(Math.random() * 8) + 2,
      h3: Math.floor(Math.random() * 15) + 5,
      h4: Math.floor(Math.random() * 10) + 2,
      keywordInH1: keyword ? Math.random() > 0.3 : false,
      keywordInH2: keyword ? Math.random() > 0.5 : false
    }
  }
  
  analyzeHeadingStructure() {
    const structures = [
      'Well structured with proper hierarchy',
      'Good structure with minor improvements needed',
      'Needs improvement in heading hierarchy',
      'Excellent heading structure and organization'
    ]
    
    return structures[Math.floor(Math.random() * structures.length)]
  }
  
  async getCompetitorData(domain, keyword) {
    // Simulate competitor analysis
    const competitors = [
      'competitor1.com', 'competitor2.com', 'competitor3.com'
    ].map(comp => ({
      domain: comp,
      seoScore: Math.floor(Math.random() * 40) + 60,
      estimatedTraffic: Math.floor(Math.random() * 50000) + 10000,
      backlinks: Math.floor(Math.random() * 5000) + 1000
    }))
    
    return competitors
  }
  
  generateRecommendations(seoScore, keyword) {
    const recommendations = []
    
    if (seoScore < 70) {
      recommendations.push({
        priority: 'high',
        category: 'Technical SEO',
        title: 'Improve page load speed',
        description: 'Optimize images and reduce server response time to improve user experience and search rankings.'
      })
    }
    
    if (keyword) {
      recommendations.push({
        priority: 'medium',
        category: 'Content',
        title: `Optimize content for "${keyword}"`,
        description: 'Improve keyword density and semantic relevance in your content.'
      })
    }
    
    recommendations.push({
      priority: seoScore < 60 ? 'high' : 'low',
      category: 'Meta Tags',
      title: 'Optimize meta descriptions',
      description: 'Write compelling meta descriptions that include target keywords and encourage clicks.'
    })
    
    return recommendations
  }
  
  async analyzeSERP(keyword, url = null) {
    // For backward compatibility with existing code
    if (url) {
      return this.analyzeWebsite(url, keyword)
    }
    
    // Original SERP analysis functionality
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const results = Array.from({ length: 10 }, (_, index) => ({
      Id: index + 1,
      position: index + 1,
      title: this.generateTitle(keyword, `Example Site ${index + 1}`),
      description: this.generateDescription(keyword, 'Professional services and solutions.'),
      url: `https://example${index + 1}.com`,
      domain: `example${index + 1}.com`,
      keywords: this.generateKeywords(keyword),
      entities: this.generateEntities(keyword),
      seoScore: Math.floor(Math.random() * 40) + 60
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