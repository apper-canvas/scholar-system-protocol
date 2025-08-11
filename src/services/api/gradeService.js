const gradeService = {
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
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      }

      const response = await apperClient.fetchRecords("grade_c", params)
      
      if (!response.success) {
        console.error("Error fetching grades:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message)
      } else {
        console.error("Error fetching grades:", error.message)
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
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ]
      }

      const response = await apperClient.getRecordById("grade_c", id, params)

      if (!response.success) {
        console.error("Error fetching grade:", response.message)
        throw new Error(response.message)
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade:", error?.response?.data?.message)
      } else {
        console.error("Error fetching grade:", error.message)
      }
      throw error
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields - convert lookup fields to IDs
      const params = {
        records: [{
          Name: gradeData.assignmentName,
          student_id_c: parseInt(gradeData.studentId),
          class_id_c: parseInt(gradeData.classId),
          assignment_name_c: gradeData.assignmentName,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          date_c: gradeData.date,
          category_c: gradeData.category
        }]
      }

      const response = await apperClient.createRecord("grade_c", params)

      if (!response.success) {
        console.error("Error creating grade:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error creating grade:", error?.response?.data?.message)
      } else {
        console.error("Error creating grade:", error.message)
      }
      throw error
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields - convert lookup fields to IDs
      const params = {
        records: [{
          Id: id,
          Name: gradeData.assignmentName,
          student_id_c: parseInt(gradeData.studentId),
          class_id_c: parseInt(gradeData.classId),
          assignment_name_c: gradeData.assignmentName,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          date_c: gradeData.date,
          category_c: gradeData.category
        }]
      }

      const response = await apperClient.updateRecord("grade_c", params)

      if (!response.success) {
        console.error("Error updating grade:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error updating grade:", error?.response?.data?.message)
      } else {
        console.error("Error updating grade:", error.message)
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

      const response = await apperClient.deleteRecord("grade_c", params)

      if (!response.success) {
        console.error("Error deleting grade:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return failedRecords.length === 0
      }

      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message)
      } else {
        console.error("Error deleting grade:", error.message)
      }
      throw error
    }
  }
}

export default gradeService