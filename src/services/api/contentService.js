// Apper Content Service - Database Integration
class ContentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'content';
    
    // Define lookup fields for special handling
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy', 'projectId'];
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "metaDescription" } },
          { field: { Name: "body" } },
          { field: { Name: "faqSection" } },
          { field: { Name: "seoScore" } },
          { field: { Name: "entities" } },
          { field: { Name: "wordCount" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "projectId" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contents:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "metaDescription" } },
          { field: { Name: "body" } },
          { field: { Name: "faqSection" } },
          { field: { Name: "seoScore" } },
          { field: { Name: "entities" } },
          { field: { Name: "wordCount" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "projectId" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error(`Content with Id ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching content with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async getByProjectId(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "metaDescription" } },
          { field: { Name: "body" } },
          { field: { Name: "faqSection" } },
          { field: { Name: "seoScore" } },
          { field: { Name: "entities" } },
          { field: { Name: "wordCount" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "projectId" } }
        ],
        where: [
          {
            FieldName: "projectId",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contents by project ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
  
  async create(contentData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        Name: contentData.Name || contentData.title || 'New Content',
        Tags: contentData.Tags || '',
        title: contentData.title,
        metaDescription: contentData.metaDescription,
        body: contentData.body,
        faqSection: JSON.stringify(contentData.faqSection || []),
        seoScore: contentData.seoScore || 0,
        entities: typeof contentData.entities === 'string' ? contentData.entities : (Array.isArray(contentData.entities) ? contentData.entities.join(',') : ''),
        wordCount: contentData.wordCount || (contentData.body ? contentData.body.split(" ").length : 0),
        status: contentData.status || 'Draft',
        createdAt: new Date().toISOString(),
        projectId: parseInt(contentData.projectId)
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contents ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create content');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async update(id, updateData) {
    try {
      // Only include Updateable fields in update operation
      const updateFields = {
        Id: id,
        Name: updateData.Name,
        Tags: updateData.Tags,
        title: updateData.title,
        metaDescription: updateData.metaDescription,
        body: updateData.body,
        faqSection: updateData.faqSection ? JSON.stringify(updateData.faqSection) : undefined,
        seoScore: updateData.seoScore,
        entities: typeof updateData.entities === 'string' ? updateData.entities : (Array.isArray(updateData.entities) ? updateData.entities.join(',') : undefined),
        wordCount: updateData.wordCount,
        status: updateData.status,
        createdAt: updateData.createdAt,
        projectId: updateData.projectId ? parseInt(updateData.projectId) : undefined
      };
      
      // Remove undefined fields
      Object.keys(updateFields).forEach(key => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });
      
      const params = {
        records: [updateFields]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update contents ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update content');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete contents ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting content:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async generateContent({ businessType, targetKeyword, location, toneOfVoice, entities }) {
    // Generate high-quality, specific content without artificial delays
    
    const locationText = location ? ` in ${location}` : ''
    const currentYear = new Date().getFullYear()
    const businessTypeFormatted = businessType.toLowerCase()
    
    const templates = {
      title: `${targetKeyword} for ${businessType}: Complete ${currentYear} Strategy Guide`,
      metaDescription: `Master ${targetKeyword} strategies for your ${businessType} business${locationText}. Expert insights, actionable tips, and proven methods for ${currentYear} success.`,
      body: this.generateDetailedContent(targetKeyword, businessType, location, toneOfVoice, entities, currentYear),
      faqSection: this.generateRelevantFAQs(targetKeyword, businessType, location)
    }
    
    return templates
  }
  
  generateDetailedContent(targetKeyword, businessType, location, toneOfVoice, entities, currentYear) {
    const locationText = location ? ` in ${location}` : ''
    const businessTypeFormatted = businessType.toLowerCase()
    const tone = toneOfVoice === "Professional" ? "professional" : "approachable"
    
    return `# ${targetKeyword}: The Complete ${businessType} Strategy Guide for ${currentYear}

## Executive Summary

${targetKeyword} has become a cornerstone of successful ${businessTypeFormatted} operations${locationText}. This comprehensive guide provides actionable strategies, industry insights, and proven methodologies to help your business excel in this critical area.

## What is ${targetKeyword}?

${targetKeyword} encompasses the strategic approaches and tactical implementations that enable ${businessTypeFormatted} organizations to achieve their operational goals. For businesses${locationText}, understanding and mastering ${targetKeyword} is essential for sustainable growth and competitive advantage.

### Core Components

1. **Strategic Planning**: Developing comprehensive ${targetKeyword} frameworks
2. **Implementation Excellence**: Executing strategies with precision and efficiency  
3. **Performance Optimization**: Continuous improvement and refinement
4. **Technology Integration**: Leveraging modern tools and platforms
5. **Stakeholder Alignment**: Ensuring organizational buy-in and support

## Industry-Specific Applications for ${businessType}

### Primary Applications
${entities.map(entity => `- **${entity.name}**: Strategic implementation for enhanced ${businessTypeFormatted} operations`).join('\n')}

### Implementation Framework

#### Phase 1: Assessment and Planning
- Comprehensive analysis of current ${targetKeyword} capabilities
- Identification of optimization opportunities
- Development of strategic roadmap

#### Phase 2: Strategy Development  
- Creation of tailored ${targetKeyword} frameworks
- Integration with existing ${businessTypeFormatted} processes
- Risk assessment and mitigation planning

#### Phase 3: Implementation and Execution
- Systematic deployment of ${targetKeyword} strategies
- Team training and capability development
- Performance monitoring and adjustment

## Best Practices for ${businessType} Organizations

### 1. Strategic Approach
${tone === "professional" ? 
  "Develop a comprehensive strategic framework that aligns with organizational objectives and market dynamics." :
  "Start with a clear strategy that fits your business goals and market situation."
}

### 2. Technology Integration
Modern ${targetKeyword} success requires leveraging appropriate technology solutions. Consider:
- Automation tools for efficiency gains
- Analytics platforms for data-driven decisions
- Integration systems for seamless operations

### 3. Performance Measurement
Establish clear KPIs to measure ${targetKeyword} success:
- Operational efficiency metrics
- Customer satisfaction indicators
- ROI and financial performance measures
- Quality and compliance standards

## Common Challenges and Solutions

### Challenge: Resource Constraints
**Solution**: Prioritize high-impact initiatives and implement phased approaches to optimize resource utilization.

### Challenge: Change Management
**Solution**: Develop comprehensive change management strategies including stakeholder communication, training programs, and gradual implementation.

### Challenge: Technology Integration
**Solution**: Conduct thorough system assessments and implement integration solutions that minimize disruption while maximizing benefits.

### Challenge: Performance Measurement
**Solution**: Establish baseline metrics, implement robust tracking systems, and create regular reporting processes.

## ${location ? `Regional Considerations for ${location}` : 'Market Considerations'}

${location ? 
  `Businesses operating in ${location} should consider local market dynamics, regulatory requirements, and cultural factors that impact ${targetKeyword} implementation.` :
  'Consider local market dynamics, regulatory requirements, and industry-specific factors that influence strategic decisions.'
}

### Key Factors:
- Market maturity and competitive landscape
- Regulatory compliance requirements
- Cultural and operational preferences
- Technology infrastructure considerations

## Implementation Roadmap

### Months 1-2: Foundation Building
- Conduct comprehensive assessment
- Develop strategic framework
- Secure stakeholder alignment

### Months 3-4: Initial Implementation  
- Deploy core ${targetKeyword} capabilities
- Implement training programs
- Establish measurement systems

### Months 5-6: Optimization and Scaling
- Analyze performance data
- Refine processes and procedures
- Scale successful initiatives

## Measuring Success

### Key Performance Indicators
- **Efficiency Metrics**: Process improvements and resource optimization
- **Quality Indicators**: Service delivery and customer satisfaction
- **Financial Performance**: ROI, cost reduction, and revenue impact
- **Strategic Alignment**: Progress toward organizational objectives

### Reporting and Analysis
Regular performance reviews should include:
- Monthly operational metrics
- Quarterly strategic assessments  
- Annual comprehensive evaluations
- Continuous improvement recommendations

## Future Trends and Considerations

The ${targetKeyword} landscape continues to evolve, with emerging trends including:
- Increased automation and AI integration
- Enhanced data analytics capabilities
- Greater focus on sustainability and social responsibility
- Expanded digital transformation initiatives

## Conclusion

Successful ${targetKeyword} implementation requires a strategic approach, comprehensive planning, and continuous optimization. ${businessType} organizations that invest in developing robust ${targetKeyword} capabilities will be better positioned for long-term success and competitive advantage.

${tone === "professional" ? 
  "We recommend engaging with experienced professionals to ensure optimal implementation and results." :
  "Ready to get started? Consider working with experts who can help you implement these strategies effectively."
}

---

*This guide provides foundational insights for ${targetKeyword} success. For customized strategies tailored to your specific ${businessTypeFormatted} needs${locationText}, consider consulting with industry experts.*`
  }
  
  generateRelevantFAQs(targetKeyword, businessType, location) {
    const locationText = location ? ` in ${location}` : ''
    const businessTypeFormatted = businessType.toLowerCase()
    
    return [
      {
        question: `What is ${targetKeyword} and why is it crucial for ${businessType} success?`,
        answer: `${targetKeyword} refers to the strategic approaches and operational methodologies that enable ${businessTypeFormatted} organizations to achieve their objectives efficiently. It's crucial because it directly impacts operational efficiency, customer satisfaction, and competitive positioning${locationText}.`
      },
      {
        question: `How long does it typically take to see results from ${targetKeyword} implementation?`,
        answer: `Most ${businessTypeFormatted} organizations begin seeing measurable improvements within 60-90 days of implementation. However, significant transformational results typically emerge after 6-12 months of consistent application and optimization.`
      },
      {
        question: `What are the most critical success factors for ${targetKeyword} in ${businessType}?`,
        answer: `Key success factors include strategic alignment, stakeholder buy-in, appropriate technology infrastructure, comprehensive training programs, and robust performance measurement systems. Organizations${locationText} should also consider local market dynamics and regulatory requirements.`
      },
      {
        question: `How can I measure the ROI of ${targetKeyword} initiatives?`,
        answer: `ROI measurement should include both quantitative metrics (cost savings, revenue increases, efficiency gains) and qualitative benefits (customer satisfaction, employee engagement, competitive advantage). Establish baseline measurements before implementation and track progress using defined KPIs.`
      },
      {
        question: `What resources are needed to successfully implement ${targetKeyword} strategies?`,
        answer: `Essential resources include dedicated project leadership, cross-functional team participation, appropriate technology tools and platforms, training and development budget, and ongoing operational support. The specific requirements vary based on organization size, complexity, and existing capabilities.`
      },
      {
        question: `How does ${targetKeyword} differ for ${businessType} compared to other industries?`,
        answer: `${businessType} organizations have unique requirements including specific regulatory considerations, operational complexities, and customer expectations. ${targetKeyword} strategies must be tailored to address these industry-specific factors while leveraging best practices from other sectors where applicable.`
      }
    ]
  }
  
  async analyzeSEO({ title, metaDescription, content, targetKeyword, entities }) {
    // Perform comprehensive SEO analysis without artificial delays
    
    let score = 0
    const analysis = {
      titleAnalysis: this.analyzeTitleSEO(title, targetKeyword),
      metaAnalysis: this.analyzeMetaDescriptionSEO(metaDescription, targetKeyword),
      contentAnalysis: this.analyzeContentSEO(content, targetKeyword, entities),
      structureAnalysis: this.analyzeContentStructure(content),
      keywordAnalysis: this.analyzeKeywordUsage(content, targetKeyword)
    }
    
    // Calculate total score based on detailed analysis
    score += analysis.titleAnalysis.score
    score += analysis.metaAnalysis.score  
    score += analysis.contentAnalysis.score
    score += analysis.structureAnalysis.score
    score += analysis.keywordAnalysis.score
    
    return {
      score: Math.min(score, 100),
      details: {
        titleScore: analysis.titleAnalysis.score,
        metaScore: analysis.metaAnalysis.score,
        contentScore: analysis.contentAnalysis.score,
        structureScore: analysis.structureAnalysis.score,
        keywordScore: analysis.keywordAnalysis.score
      },
      recommendations: this.generateSEORecommendations(analysis, targetKeyword),
      analysis
    }
  }
  
  analyzeTitleSEO(title, targetKeyword) {
    const analysis = {
      hasKeyword: title.toLowerCase().includes(targetKeyword.toLowerCase()),
      length: title.length,
      isOptimalLength: title.length >= 30 && title.length <= 60,
      keywordPosition: title.toLowerCase().indexOf(targetKeyword.toLowerCase())
    }
    
    let score = 0
    if (analysis.hasKeyword) score += 15
    if (analysis.isOptimalLength) score += 10
    if (analysis.keywordPosition <= 10) score += 5 // Keyword near beginning
    
    return { ...analysis, score }
  }
  
  analyzeMetaDescriptionSEO(metaDescription, targetKeyword) {
    const analysis = {
      hasKeyword: metaDescription.toLowerCase().includes(targetKeyword.toLowerCase()),
      length: metaDescription.length,
      isOptimalLength: metaDescription.length >= 120 && metaDescription.length <= 160,
      isCompelling: this.hasCompellingWords(metaDescription)
    }
    
    let score = 0
    if (analysis.hasKeyword) score += 10
    if (analysis.isOptimalLength) score += 8
    if (analysis.isCompelling) score += 7
    
    return { ...analysis, score }
  }
  
  analyzeContentSEO(content, targetKeyword, entities) {
    const wordCount = content.split(/\s+/).length
    const keywordDensity = this.calculateKeywordDensity(content, targetKeyword)
    const entityUsage = entities.filter(entity => 
      content.toLowerCase().includes(entity.name.toLowerCase())
    ).length
    
    const analysis = {
      wordCount,
      keywordDensity,
      entityUsage,
      hasAdequateLength: wordCount >= 800,
      hasOptimalKeywordDensity: keywordDensity >= 0.5 && keywordDensity <= 3.0,
      entityCoverage: (entityUsage / entities.length) * 100
    }
    
    let score = 0
    if (analysis.hasAdequateLength) score += 15
    if (analysis.hasOptimalKeywordDensity) score += 10
    score += Math.min(entityUsage * 2, 15) // Entity usage bonus
    
    return { ...analysis, score }
  }
  
  analyzeContentStructure(content) {
    const analysis = {
      hasH1: /^#\s/.test(content.trim()),
      hasH2: /^##\s/m.test(content),
      hasH3: /^###\s/m.test(content),
      hasLists: /^[-*]\s/m.test(content),
      hasBoldText: /\*\*.*?\*\*/.test(content),
      paragraphCount: content.split(/\n\s*\n/).length
    }
    
    let score = 0
    if (analysis.hasH1) score += 5
    if (analysis.hasH2) score += 8
    if (analysis.hasH3) score += 5
    if (analysis.hasLists) score += 5
    if (analysis.hasBoldText) score += 2
    if (analysis.paragraphCount >= 5) score += 5
    
    return { ...analysis, score }
  }
  
  analyzeKeywordUsage(content, targetKeyword) {
    const contentLower = content.toLowerCase()
    const keywordLower = targetKeyword.toLowerCase()
    const keywordWords = keywordLower.split(' ')
    
    const analysis = {
      exactMatches: (contentLower.match(new RegExp(keywordLower, 'g')) || []).length,
      partialMatches: keywordWords.reduce((sum, word) => 
        sum + (contentLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0),
      inHeadings: /^#{1,3}\s.*${keywordLower}/m.test(contentLower),
      inFirstParagraph: contentLower.substring(0, 200).includes(keywordLower)
    }
    
    let score = 0
    if (analysis.exactMatches >= 3 && analysis.exactMatches <= 8) score += 10
    if (analysis.inHeadings) score += 5
    if (analysis.inFirstParagraph) score += 5
    
    return { ...analysis, score }
  }
  
  calculateKeywordDensity(content, keyword) {
    const words = content.toLowerCase().split(/\s+/)
    const keywordOccurrences = words.filter(word => 
      word.includes(keyword.toLowerCase().replace(/\s+/g, ''))
    ).length
    return ((keywordOccurrences / words.length) * 100).toFixed(2)
  }
  
  hasCompellingWords(text) {
    const compellingWords = ['discover', 'learn', 'master', 'expert', 'proven', 'complete', 'ultimate', 'essential', 'comprehensive', 'exclusive']
    return compellingWords.some(word => text.toLowerCase().includes(word))
  }
  
  generateSEORecommendations(analysis, targetKeyword) {
    const recommendations = []
    
    if (!analysis.titleAnalysis.hasKeyword) {
      recommendations.push({
        type: 'title',
        priority: 'high',
        message: `Include "${targetKeyword}" in your page title for better relevance.`
      })
    }
    
    if (!analysis.titleAnalysis.isOptimalLength) {
      recommendations.push({
        type: 'title',
        priority: 'medium', 
        message: `Optimize title length to 30-60 characters (currently ${analysis.titleAnalysis.length}).`
      })
    }
    
    if (!analysis.metaAnalysis.hasKeyword) {
      recommendations.push({
        type: 'meta',
        priority: 'high',
        message: `Include "${targetKeyword}" in your meta description.`
      })
    }
    
    if (!analysis.contentAnalysis.hasAdequateLength) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        message: `Increase content length to at least 800 words (currently ${analysis.contentAnalysis.wordCount}).`
      })
    }
    
    if (!analysis.contentAnalysis.hasOptimalKeywordDensity) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        message: `Optimize keyword density to 0.5-3.0% (currently ${analysis.contentAnalysis.keywordDensity}%).`
      })
    }
    
    if (!analysis.structureAnalysis.hasH2) {
      recommendations.push({
        type: 'structure',
        priority: 'medium',
        message: 'Add H2 headings to improve content structure and readability.'
      })
    }
    
    return recommendations
  }
}

export const contentService = new ContentService();