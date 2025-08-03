import contentsData from "@/services/mockData/contents.json"

class ContentService {
  constructor() {
    this.contents = [...contentsData]
  }
  
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.contents]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const content = this.contents.find(c => c.Id === id)
    if (!content) {
      throw new Error(`Content with Id ${id} not found`)
    }
    return { ...content }
  }
  
  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.contents.filter(c => c.projectId === projectId)
  }
  
  async create(contentData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newContent = {
      Id: Math.max(...this.contents.map(c => c.Id), 0) + 1,
      ...contentData,
      createdAt: new Date().toISOString(),
      status: "Draft",
      wordCount: contentData.body ? contentData.body.split(" ").length : 0,
    }
    
    this.contents.unshift(newContent)
    return { ...newContent }
  }
  
  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.contents.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error(`Content with Id ${id} not found`)
    }
    
    this.contents[index] = { 
      ...this.contents[index], 
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    return { ...this.contents[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.contents.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error(`Content with Id ${id} not found`)
    }
    
    this.contents.splice(index, 1)
    return true
  }
  
  async generateContent({ businessType, targetKeyword, location, toneOfVoice, entities }) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate AI content generation
    const templates = {
      title: `Ultimate Guide to ${targetKeyword}: ${businessType} Best Practices for ${new Date().getFullYear()}`,
      metaDescription: `Discover the best ${targetKeyword} strategies for ${businessType} businesses. Expert insights, practical tips, and proven methods to boost your success.`,
      body: `# ${targetKeyword}: The Complete ${businessType} Guide

## Introduction

In today's competitive digital landscape, mastering ${targetKeyword} is crucial for ${businessType} success. This comprehensive guide will walk you through everything you need to know to excel in this area.

## Understanding ${targetKeyword}

${targetKeyword} represents a critical aspect of modern ${businessType} operations. Whether you're just starting out or looking to optimize your existing approach, this guide provides the insights you need.

### Key Benefits

- Improved efficiency and productivity
- Better customer satisfaction
- Enhanced competitive advantage
- Measurable ROI improvements

## Best Practices for ${businessType}

### 1. Strategy Development
Creating a solid foundation is essential for long-term success. Focus on understanding your target audience and their specific needs.

### 2. Implementation Guidelines
Follow proven methodologies to ensure successful deployment of your ${targetKeyword} strategy.

### 3. Performance Monitoring
Regular assessment and optimization are key to maintaining excellent results.

## Common Challenges and Solutions

Many ${businessType} organizations face similar obstacles when implementing ${targetKeyword} strategies. Here are the most effective solutions:

- **Challenge 1**: Resource allocation
  - Solution: Prioritize high-impact activities
- **Challenge 2**: Team coordination
  - Solution: Implement clear communication protocols
- **Challenge 3**: Measuring success
  - Solution: Define KPIs early and track consistently

## Industry-Specific Considerations

For ${businessType} businesses${location ? ` in ${location}` : ""}, specific factors should be considered:

${entities.map(entity => `- ${entity.name}: Critical for understanding market dynamics`).join("\n")}

## ${toneOfVoice === "Professional" ? "Professional Recommendations" : "Key Takeaways"}

Success with ${targetKeyword} requires dedication, proper planning, and consistent execution. By following the strategies outlined in this guide, ${businessType} organizations can achieve significant improvements in their operations.

## Conclusion

Implementing effective ${targetKeyword} strategies is not just about following best practices—it's about creating sustainable competitive advantages for your ${businessType} business. Start with the fundamentals, measure your progress, and continuously optimize your approach.

Ready to take your ${targetKeyword} strategy to the next level? Contact our team of experts for personalized guidance tailored to your ${businessType} needs.`,
      faqSection: [
        {
          question: `What is ${targetKeyword} and why is it important for ${businessType}?`,
          answer: `${targetKeyword} is a critical strategy that helps ${businessType} organizations improve their operations, increase efficiency, and deliver better results. It's important because it directly impacts business growth and customer satisfaction.`
        },
        {
          question: `How long does it take to see results from ${targetKeyword} implementation?`,
          answer: `Most ${businessType} organizations begin seeing initial results within 30-90 days of implementation. However, significant improvements typically become apparent after 3-6 months of consistent application.`
        },
        {
          question: `What are the most common mistakes to avoid with ${targetKeyword}?`,
          answer: `Common mistakes include rushing implementation without proper planning, neglecting to train team members adequately, and failing to establish clear metrics for success measurement.`
        },
        {
          question: `How do I know if ${targetKeyword} is working for my ${businessType} business?`,
          answer: `Key indicators include improved efficiency metrics, better customer feedback, increased revenue, and achievement of predefined KPIs. Regular monitoring and analysis are essential for accurate assessment.`
        },
        {
          question: `What resources do I need to get started with ${targetKeyword}?`,
          answer: `Essential resources include dedicated team members, appropriate tools and technology, sufficient budget allocation, and commitment from leadership. The specific requirements may vary based on your ${businessType} organization's size and goals.`
        }
      ]
    }
    
    return templates
  }
  
  async analyzeSEO({ title, metaDescription, content, targetKeyword, entities }) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let score = 0
    
    // Title analysis (20 points)
    if (title.includes(targetKeyword)) score += 10
    if (title.length >= 30 && title.length <= 60) score += 10
    
    // Meta description analysis (15 points)
    if (metaDescription.includes(targetKeyword)) score += 8
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 7
    
    // Content analysis (65 points)
    if (content.length > 1000) score += 15
    if (content.toLowerCase().includes(targetKeyword.toLowerCase())) score += 15
    
    // Entity usage analysis
    const entityUsage = entities.filter(entity => 
      content.toLowerCase().includes(entity.name.toLowerCase())
    ).length
    score += Math.min(entityUsage * 2, 20)
    
    // Structure analysis
    if (content.includes("#")) score += 10 // Has headings
    if (content.includes("- ") || content.includes("* ")) score += 5 // Has lists
    
    return {
      score: Math.min(score, 100),
      details: {
        titleScore: title.includes(targetKeyword) ? 10 : 0,
        metaScore: metaDescription.includes(targetKeyword) ? 8 : 0,
        contentScore: Math.min(35 + entityUsage * 2, 50),
        structureScore: 15,
      }
    }
  }
}

export const contentService = new ContentService()