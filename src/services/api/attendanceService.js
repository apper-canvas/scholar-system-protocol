const attendanceService = {
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      }

      const response = await apperClient.fetchRecords("attendance_c", params)
      
      if (!response.success) {
        console.error("Error fetching attendance:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message)
      } else {
        console.error("Error fetching attendance:", error.message)
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      }

      const response = await apperClient.getRecordById("attendance_c", id, params)

      if (!response.success) {
        console.error("Error fetching attendance record:", response.message)
        throw new Error(response.message)
      }

      return response.data || null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance record:", error?.response?.data?.message)
      } else {
        console.error("Error fetching attendance record:", error.message)
      }
      throw error
    }
  },

  async create(attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields - convert lookup fields to IDs
      const params = {
        records: [{
          Name: `Attendance - ${attendanceData.date}`,
          student_id_c: parseInt(attendanceData.studentId),
          class_id_c: parseInt(attendanceData.classId),
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          notes_c: attendanceData.notes || ""
        }]
      }

      const response = await apperClient.createRecord("attendance_c", params)

      if (!response.success) {
        console.error("Error creating attendance:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error creating attendance:", error?.response?.data?.message)
      } else {
        console.error("Error creating attendance:", error.message)
      }
      throw error
    }
  },

  async update(id, attendanceData) {
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
          Name: `Attendance - ${attendanceData.date}`,
          student_id_c: parseInt(attendanceData.studentId),
          class_id_c: parseInt(attendanceData.classId),
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          notes_c: attendanceData.notes || ""
        }]
      }

      const response = await apperClient.updateRecord("attendance_c", params)

      if (!response.success) {
        console.error("Error updating attendance:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`)
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
        console.error("Error updating attendance:", error?.response?.data?.message)
      } else {
        console.error("Error updating attendance:", error.message)
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

      const response = await apperClient.deleteRecord("attendance_c", params)

      if (!response.success) {
        console.error("Error deleting attendance:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message)
          })
        }
        
        return failedRecords.length === 0
      }

      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message)
      } else {
        console.error("Error deleting attendance:", error.message)
      }
      throw error
    }
  }
}

export default attendanceService