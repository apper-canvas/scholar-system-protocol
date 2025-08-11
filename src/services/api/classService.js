const classService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "year_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      }

      const response = await apperClient.fetchRecords("class_c", params)
      
      if (!response.success) {
        console.error("Error fetching classes:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message)
      } else {
        console.error("Error fetching classes:", error.message)
      }
      throw error
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "year_c" } }
        ]
      }

      const response = await apperClient.getRecordById("class_c", id, params)

      if (!response.success) {
        console.error("Error fetching class:", response.message)
        throw new Error(response.message)
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching class:", error?.response?.data?.message)
      } else {
        console.error("Error fetching class:", error.message)
      }
      throw error
    }
  },

  async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: classData.name,
          subject_c: classData.subject,
          period_c: classData.period,
          room_c: classData.room,
          semester_c: classData.semester,
          year_c: parseInt(classData.year)
        }]
      }

      const response = await apperClient.createRecord("class_c", params)

      if (!response.success) {
        console.error("Error creating class:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} class records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`)
            })
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating class:", error?.response?.data?.message)
      } else {
        console.error("Error creating class:", error.message)
      }
      throw error
    }
  },

  async update(id, classData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: classData.name,
          subject_c: classData.subject,
          period_c: classData.period,
          room_c: classData.room,
          semester_c: classData.semester,
          year_c: parseInt(classData.year)
        }]
      }

      const response = await apperClient.updateRecord("class_c", params)

      if (!response.success) {
        console.error("Error updating class:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} class records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`)
            })
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating class:", error?.response?.data?.message)
      } else {
        console.error("Error updating class:", error.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord("class_c", params)

      if (!response.success) {
        console.error("Error deleting class:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} class records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return failedRecords.length === 0
      }

      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message)
      } else {
        console.error("Error deleting class:", error.message)
      }
      throw error
    }
  }
}

export default classService