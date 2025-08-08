import classesData from "@/services/mockData/classes.json"

// In-memory data store
let classes = [...classesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const classService = {
  async getAll() {
    await delay(250)
    return [...classes]
  },

  async getById(id) {
    await delay(200)
    return classes.find(cls => cls.Id === id) || null
  },

  async create(classData) {
    await delay(400)
    const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.Id)) : 0
    const newClass = {
      Id: maxId + 1,
      ...classData
    }
    classes.push(newClass)
    return { ...newClass }
  },

  async update(id, classData) {
    await delay(350)
    const index = classes.findIndex(cls => cls.Id === id)
    if (index === -1) {
      throw new Error("Class not found")
    }
    classes[index] = { ...classes[index], ...classData }
    return { ...classes[index] }
  },

  async delete(id) {
    await delay(250)
    const index = classes.findIndex(cls => cls.Id === id)
    if (index === -1) {
      throw new Error("Class not found")
    }
    classes.splice(index, 1)
    return true
  }
}

export default classService