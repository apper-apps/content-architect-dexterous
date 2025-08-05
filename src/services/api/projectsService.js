// Apper Projects Service - Database Integration
class ProjectsService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'project';
    
    // Define lookup fields for special handling
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy'];
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "businessType" } },
          { field: { Name: "websiteUrl" } },
          { field: { Name: "targetKeyword" } },
          { field: { Name: "location" } },
          { field: { Name: "language" } },
          { field: { Name: "toneOfVoice" } },
          { field: { Name: "additionalInfo" } },
          { field: { Name: "status" } },
          { field: { Name: "seoScore" } },
          { field: { Name: "contentCount" } },
          { field: { Name: "createdAt" } }
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
        console.error("Error fetching projects:", error?.response?.data?.message);
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
          { field: { Name: "businessType" } },
          { field: { Name: "websiteUrl" } },
          { field: { Name: "targetKeyword" } },
          { field: { Name: "location" } },
          { field: { Name: "language" } },
          { field: { Name: "toneOfVoice" } },
          { field: { Name: "additionalInfo" } },
          { field: { Name: "status" } },
          { field: { Name: "seoScore" } },
          { field: { Name: "contentCount" } },
          { field: { Name: "createdAt" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error(`Project with Id ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async create(projectData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        Name: projectData.Name || projectData.targetKeyword || 'New Project',
        Tags: projectData.Tags || '',
        businessType: projectData.businessType,
        websiteUrl: projectData.websiteUrl,
        targetKeyword: projectData.targetKeyword,
        location: projectData.location,
        language: projectData.language,
        toneOfVoice: projectData.toneOfVoice,
        additionalInfo: projectData.additionalInfo,
        status: projectData.status || 'Active',
        seoScore: projectData.seoScore || 0,
        contentCount: projectData.contentCount || 0,
        createdAt: new Date().toISOString()
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
          console.error(`Failed to create projects ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
      
      throw new Error('Failed to create project');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
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
        businessType: updateData.businessType,
        websiteUrl: updateData.websiteUrl,
        targetKeyword: updateData.targetKeyword,
        location: updateData.location,
        language: updateData.language,
        toneOfVoice: updateData.toneOfVoice,
        additionalInfo: updateData.additionalInfo,
        status: updateData.status,
        seoScore: updateData.seoScore,
        contentCount: updateData.contentCount,
        createdAt: updateData.createdAt
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
          console.error(`Failed to update projects ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
      
      throw new Error('Failed to update project');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
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
          console.error(`Failed to delete projects ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async updateSeoScore(id, score) {
    return this.update(id, { seoScore: score });
  }
  
  async incrementContentCount(id) {
    try {
      const project = await this.getById(id);
      return this.update(id, { contentCount: (project.contentCount || 0) + 1 });
    } catch (error) {
      console.error("Error incrementing content count:", error);
      throw error;
    }
  }
}

export const projectsService = new ProjectsService();