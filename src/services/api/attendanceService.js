import attendanceData from "@/services/mockData/attendance.json"

// In-memory data store
let attendance = [...attendanceData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const attendanceService = {
  async getAll() {
    await delay(300)
    return [...attendance]
  },

  async getById(id) {
    await delay(200)
    return attendance.find(record => record.Id === id) || null
  },

  async create(attendanceData) {
    await delay(400)
    const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData
    }
    attendance.push(newRecord)
    return { ...newRecord }
  },

  async update(id, attendanceData) {
    await delay(350)
    const index = attendance.findIndex(record => record.Id === id)
    if (index === -1) {
      throw new Error("Attendance record not found")
    }
    attendance[index] = { ...attendance[index], ...attendanceData }
    return { ...attendance[index] }
  },

  async delete(id) {
    await delay(250)
    const index = attendance.findIndex(record => record.Id === id)
    if (index === -1) {
      throw new Error("Attendance record not found")
    }
    attendance.splice(index, 1)
    return true
  }
}

export default attendanceService