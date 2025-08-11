const studentService = {
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      }

      const response = await apperClient.fetchRecords("student_c", params)
      
      if (!response.success) {
        console.error("Error fetching students:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message)
      } else {
        console.error("Error fetching students:", error.message)
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ]
      }

      const response = await apperClient.getRecordById("student_c", id, params)

      if (!response.success) {
        console.error("Error fetching student:", response.message)
        throw new Error(response.message)
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching student:", error?.response?.data?.message)
      } else {
        console.error("Error fetching student:", error.message)
      }
      throw error
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          grade_c: studentData.grade,
          date_of_birth_c: studentData.dateOfBirth,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status || "Active"
        }]
      }

      const response = await apperClient.createRecord("student_c", params)

      if (!response.success) {
        console.error("Error creating student:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} student records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error creating student:", error?.response?.data?.message)
      } else {
        console.error("Error creating student:", error.message)
      }
      throw error
    }
  },

  async update(id, studentData) {
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
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          grade_c: studentData.grade,
          date_of_birth_c: studentData.dateOfBirth,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status || "Active"
        }]
      }

      const response = await apperClient.updateRecord("student_c", params)

      if (!response.success) {
        console.error("Error updating student:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} student records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error updating student:", error?.response?.data?.message)
      } else {
        console.error("Error updating student:", error.message)
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

      const response = await apperClient.deleteRecord("student_c", params)

      if (!response.success) {
        console.error("Error deleting student:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} student records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return failedRecords.length === 0
      }

      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message)
      } else {
        console.error("Error deleting student:", error.message)
      }
      throw error
    }
  }
}

export default studentService