import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import GradeBadge from "@/components/molecules/GradeBadge"
import ApperIcon from "@/components/ApperIcon"
import classService from "@/services/api/classService"
import studentService from "@/services/api/studentService"
import gradeService from "@/services/api/gradeService"
import attendanceService from "@/services/api/attendanceService"
import { formatDate } from "@/utils/formatters"

const ClassDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadClassData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [classInfo, allStudents, allGrades, allAttendance] = await Promise.all([
        classService.getById(parseInt(id)),
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      
      if (!classInfo) {
        setError("Class not found")
        return
      }
      
      const classGrades = allGrades.filter(g => g.classId === parseInt(id))
      const classAttendance = allAttendance.filter(a => a.classId === parseInt(id))
      const enrolledStudentIds = new Set([
        ...classGrades.map(g => g.studentId),
        ...classAttendance.map(a => a.studentId)
      ])
      
      const enrolled = allStudents.filter(s => enrolledStudentIds.has(s.Id))
      
      setClassData(classInfo)
      setStudents(allStudents)
      setEnrolledStudents(enrolled)
      setGrades(classGrades)
      setAttendance(classAttendance)
    } catch (err) {
      setError("Failed to load class data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadClassData()
    }
  }, [id])

  if (loading) {
    return (
      <div>
        <Header title="Class Details" />
        <div className="p-6 lg:p-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Class Details" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadClassData} />
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div>
        <Header title="Class Details" />
        <div className="p-6 lg:p-8">
          <Error message="Class not found" />
        </div>
      </div>
    )
  }

  const averageGrade = grades.length > 0 ? 
    grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / grades.length : 0

  const totalAttendance = attendance.length
  const presentCount = attendance.filter(a => a.status === "Present").length
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

  const getStudentGrades = (studentId) => {
    return grades.filter(g => g.studentId === studentId)
  }

  const getStudentAttendanceRate = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId)
    if (studentAttendance.length === 0) return 0
    const present = studentAttendance.filter(a => a.status === "Present").length
    return (present / studentAttendance.length) * 100
  }

  return (
    <div>
      <Header
        title="Class Details"
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon="ArrowLeft"
              onClick={() => navigate("/classes")}
            >
              Back to Classes
            </Button>
          </div>
        }
      />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Class Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {classData.name}
                </h2>
                <p className="text-lg text-gray-600 mt-1">{classData.subject}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ApperIcon name="Clock" size={16} className="mr-1" />
                    {classData.period}
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <ApperIcon name="MapPin" size={16} className="mr-1" />
                    {classData.room}
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" size={16} className="mr-1" />
                    {classData.semester} {classData.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enrolled Students</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledStudents.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Class Average</p>
                <p className="text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-success" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" size={24} className="text-warning" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceRate.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-error" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Student Roster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Student Roster
              </h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Calendar"
                  onClick={() => navigate("/attendance")}
                >
                  Take Attendance
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Plus"
                  onClick={() => navigate("/grades")}
                >
                  Add Grades
                </Button>
              </div>
            </div>
          </div>

          {enrolledStudents.length === 0 ? (
            <div className="p-12 text-center">
              <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No students enrolled</h4>
              <p className="text-gray-600">Students will appear here once they have grades or attendance recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Average Grade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assignments
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Attendance Rate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((student, index) => {
                    const studentGrades = getStudentGrades(student.Id)
                    const studentAverage = studentGrades.length > 0 ?
                      studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / studentGrades.length : 0
                    const attendanceRate = getStudentAttendanceRate(student.Id)

                    return (
                      <motion.tr
                        key={student.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{student.grade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {studentGrades.length > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {studentAverage.toFixed(1)}%
                              </span>
                              <GradeBadge score={studentAverage} maxScore={100} />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No grades</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{studentGrades.length}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{attendanceRate.toFixed(0)}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/students/${student.Id}`)}
                            className="text-primary hover:text-blue-600 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ClassDetail