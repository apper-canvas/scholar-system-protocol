import gradesData from "@/services/mockData/grades.json"

// In-memory data store
let grades = [...gradesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const gradeService = {
  async getAll() {
    await delay(300)
    return [...grades]
  },

  async getById(id) {
    await delay(200)
    return grades.find(grade => grade.Id === id) || null
  },

  async create(gradeData) {
    await delay(400)
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    }
    grades.push(newGrade)
    return { ...newGrade }
  },

  async update(id, gradeData) {
    await delay(350)
    const index = grades.findIndex(grade => grade.Id === id)
    if (index === -1) {
      throw new Error("Grade not found")
    }
    grades[index] = { ...grades[index], ...gradeData }
    return { ...grades[index] }
  },

  async delete(id) {
    await delay(250)
    const index = grades.findIndex(grade => grade.Id === id)
    if (index === -1) {
      throw new Error("Grade not found")
    }
    grades.splice(index, 1)
    return true
  }
}

export default gradeService