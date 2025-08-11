import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import GradeBadge from "@/components/molecules/GradeBadge"
import ApperIcon from "@/components/ApperIcon"
import gradeService from "@/services/api/gradeService"
import studentService from "@/services/api/studentService"
import classService from "@/services/api/classService"
import { formatDate } from "@/utils/formatters"

const Grades = () => {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [filteredGrades, setFilteredGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [isAddingGrade, setIsAddingGrade] = useState(false)
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    classId: "",
    assignmentName: "",
    score: "",
    maxScore: "100",
    category: "Assignment",
    date: new Date().toISOString().split("T")[0]
  })

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [gradesData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ])
      
      setGrades(gradesData)
      setStudents(studentsData)
      setClasses(classesData)
      setFilteredGrades(gradesData)
    } catch (err) {
      setError("Failed to load grades")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

useEffect(() => {
    let filtered = grades

    if (searchTerm) {
      filtered = filtered.filter(grade => {
        const student = students.find(s => s.Id === grade.student_id_c?.Id || grade.student_id_c)
        const classInfo = classes.find(c => c.Id === grade.class_id_c?.Id || grade.class_id_c)
        const studentName = student ? `${student.first_name_c || ''} ${student.last_name_c || ''}` : ""
        const className = classInfo ? classInfo.Name : ""
        
        return (
          (grade.assignment_name_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          className.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (selectedClass) {
      filtered = filtered.filter(grade => (grade.class_id_c?.Id || grade.class_id_c) === parseInt(selectedClass))
    }

    if (selectedStudent) {
      filtered = filtered.filter(grade => (grade.student_id_c?.Id || grade.student_id_c) === parseInt(selectedStudent))
    }

    setFilteredGrades(filtered)
  }, [searchTerm, selectedClass, selectedStudent, grades, students, classes])

const handleAddGrade = async (e) => {
    e.preventDefault()
    
    if (!newGrade.studentId || !newGrade.classId || !newGrade.assignmentName || !newGrade.score || !newGrade.maxScore) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const gradeData = {
        studentId: parseInt(newGrade.studentId),
        classId: parseInt(newGrade.classId),
        assignmentName: newGrade.assignmentName,
        score: parseFloat(newGrade.score),
        maxScore: parseFloat(newGrade.maxScore),
        date: new Date(newGrade.date).toISOString(),
        category: newGrade.category
      }

      const createdGrade = await gradeService.create(gradeData)
      setGrades(prev => [...prev, createdGrade])
      setNewGrade({
        studentId: "",
        classId: "",
        assignmentName: "",
        score: "",
        maxScore: "100",
        category: "Assignment",
        date: new Date().toISOString().split("T")[0]
      })
      setIsAddingGrade(false)
      toast.success("Grade added successfully!")
    } catch (error) {
      toast.error("Failed to add grade")
      console.error(error)
    }
  }

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId)
        setGrades(prev => prev.filter(g => g.Id !== gradeId))
        toast.success("Grade deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete grade")
        console.error(error)
      }
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Grades" />
        <div className="p-6 lg:p-8">
          <Loading type="table" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Grades" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Grades"
        search={{
          value: searchTerm,
          placeholder: "Search assignments or students..."
        }}
        onSearchChange={setSearchTerm}
        actions={
          <Button
            icon="Plus"
            onClick={() => setIsAddingGrade(true)}
          >
            Add Grade
          </Button>
        }
      />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filter by Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
{classes.map(cls => (
                <option key={cls.Id} value={cls.Id}>{cls.Name}</option>
              ))}
            </Select>
            
            <Select
              label="Filter by Student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">All Students</option>
{students.map(student => (
                <option key={student.Id} value={student.Id}>
                  {student.first_name_c || ''} {student.last_name_c || ''}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Add Grade Form */}
        {isAddingGrade && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Add New Grade
              </h3>
              <button
                onClick={() => setIsAddingGrade(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Student"
                value={newGrade.studentId}
                onChange={(e) => setNewGrade(prev => ({ ...prev, studentId: e.target.value }))}
                required
              >
                <option value="">Select Student</option>
{students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.first_name_c || ''} {student.last_name_c || ''}
                  </option>
                ))}
              </Select>

              <Select
                label="Class"
                value={newGrade.classId}
                onChange={(e) => setNewGrade(prev => ({ ...prev, classId: e.target.value }))}
                required
              >
                <option value="">Select Class</option>
{classes.map(cls => (
                  <option key={cls.Id} value={cls.Id}>{cls.Name}</option>
                ))}
              </Select>

              <Input
                label="Assignment Name"
                value={newGrade.assignmentName}
                onChange={(e) => setNewGrade(prev => ({ ...prev, assignmentName: e.target.value }))}
                required
              />

              <Input
                label="Score"
                type="number"
                min="0"
                step="0.01"
                value={newGrade.score}
                onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                required
              />

              <Input
                label="Max Score"
                type="number"
                min="1"
                step="0.01"
                value={newGrade.maxScore}
                onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                required
              />

              <Select
                label="Category"
                value={newGrade.category}
                onChange={(e) => setNewGrade(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Test">Test</option>
                <option value="Exam">Exam</option>
                <option value="Project">Project</option>
                <option value="Homework">Homework</option>
              </Select>

              <Input
                label="Date"
                type="date"
                value={newGrade.date}
                onChange={(e) => setNewGrade(prev => ({ ...prev, date: e.target.value }))}
                required
              />

              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <Button type="submit" className="w-full">
                  Add Grade
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Grades Table */}
        {filteredGrades.length === 0 ? (
          searchTerm || selectedClass || selectedStudent ? (
            <Empty
              title="No grades found"
              description="No grades match your current filters. Try adjusting your search or filters."
              icon="Search"
            />
          ) : (
            <Empty
              title="No grades recorded"
              description="Start by adding grades for your students and assignments."
              icon="GraduationCap"
              action={
                <Button
                  icon="Plus"
                  onClick={() => setIsAddingGrade(true)}
                >
                  Add First Grade
                </Button>
              }
            />
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
{filteredGrades.map((grade, index) => {
                    const student = students.find(s => s.Id === (grade.student_id_c?.Id || grade.student_id_c))
                    const classInfo = classes.find(c => c.Id === (grade.class_id_c?.Id || grade.class_id_c))
                    
                    return (
                      <motion.tr
                        key={grade.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {grade.assignment_name_c || ''}
                            </div>
                            <div className="text-sm text-gray-500">{grade.category_c || ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student ? `${student.first_name_c || ''} ${student.last_name_c || ''}` : "Unknown Student"}
                          </div>
                          {student && (
                            <div className="text-sm text-gray-500">{student.grade_c || ''}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {classInfo ? classInfo.Name : "Unknown Class"}
                          </div>
                          {classInfo && (
                            <div className="text-sm text-gray-500">{classInfo.subject_c || ''}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {grade.score_c || 0}/{grade.max_score_c || 0}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grade.max_score_c ? ((grade.score_c / grade.max_score_c) * 100).toFixed(1) : 0}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <GradeBadge score={grade.score_c} maxScore={grade.max_score_c} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.date_c ? formatDate(grade.date_c) : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteGrade(grade.Id)}
                            className="text-error hover:text-red-600 transition-colors duration-150"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Grades