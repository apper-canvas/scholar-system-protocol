import studentsData from "@/services/mockData/students.json"

// In-memory data store
let students = [...studentsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const studentService = {
  async getAll() {
    await delay(300)
    return [...students]
  },

  async getById(id) {
    await delay(200)
    return students.find(student => student.Id === id) || null
  },

  async create(studentData) {
    await delay(400)
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0
    const newStudent = {
      Id: maxId + 1,
      ...studentData
    }
    students.push(newStudent)
    return { ...newStudent }
  },

  async update(id, studentData) {
    await delay(350)
    const index = students.findIndex(student => student.Id === id)
    if (index === -1) {
      throw new Error("Student not found")
    }
    students[index] = { ...students[index], ...studentData }
    return { ...students[index] }
  },

  async delete(id) {
    await delay(250)
    const index = students.findIndex(student => student.Id === id)
    if (index === -1) {
      throw new Error("Student not found")
    }
    students.splice(index, 1)
    return true
  }
}

export default studentService