import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Button from "@/components/atoms/Button"
import GradeBadge from "@/components/molecules/GradeBadge"
import AttendanceStatus from "@/components/molecules/AttendanceStatus"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import gradeService from "@/services/api/gradeService"
import attendanceService from "@/services/api/attendanceService"
import classService from "@/services/api/classService"
import { formatDate, formatPercentage } from "@/utils/formatters"
import { calculateGPA } from "@/utils/gradeUtils"

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadStudentData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentData, gradesData, attendanceData, classesData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll(),
        classService.getAll()
      ])
      
      if (!studentData) {
        setError("Student not found")
        return
      }
      
      setStudent(studentData)
      setGrades(gradesData.filter(g => g.studentId === parseInt(id)))
      setAttendance(attendanceData.filter(a => a.studentId === parseInt(id)))
      setClasses(classesData)
    } catch (err) {
      setError("Failed to load student data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadStudentData()
    }
  }, [id])

  if (loading) {
    return (
      <div>
        <Header title="Student Details" />
        <div className="p-6 lg:p-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Student Details" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadStudentData} />
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div>
        <Header title="Student Details" />
        <div className="p-6 lg:p-8">
          <Error message="Student not found" />
        </div>
      </div>
    )
  }

  const studentGPA = calculateGPA(grades)
  const recentAttendance = attendance.slice(-10).reverse()
  const recentGrades = grades.slice(-5).reverse()

  // Calculate attendance statistics
  const totalAttendance = attendance.length
  const presentCount = attendance.filter(a => a.status === "Present").length
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

  return (
    <div>
      <Header
        title="Student Details"
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon="ArrowLeft"
              onClick={() => navigate("/students")}
            >
              Back to Students
            </Button>
          </div>
        }
      />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Student Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-gray-600 text-lg">{student.email}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>Grade: {student.grade}</span>
                    <span>•</span>
                    <span>Enrolled: {formatDate(student.enrollmentDate)}</span>
                    <span>•</span>
                    <span className={`font-medium ${
                      student.status === "Active" ? "text-success" : "text-error"
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Current GPA</div>
                  <div className="text-3xl font-bold text-primary font-display">
                    {studentGPA}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-primary" />
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
                <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(attendanceRate)}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-success" />
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
                <p className="text-sm text-gray-600 mb-1">Days Present</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="User" size={24} className="text-warning" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Recent Grades
              </h3>
              <Button
                variant="secondary"
                size="sm"
                icon="Plus"
                onClick={() => navigate("/grades")}
              >
                Add Grade
              </Button>
            </div>
            
            {recentGrades.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="GraduationCap" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No grades recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentGrades.map((grade, index) => {
                  const classInfo = classes.find(c => c.Id === grade.classId)
                  return (
                    <motion.div
                      key={grade.Id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{grade.assignmentName}</h4>
                        <p className="text-sm text-gray-600">
                          {classInfo ? classInfo.name : "Unknown Class"} • {formatDate(grade.date)}
                        </p>
                        <p className="text-sm text-gray-500">{grade.category}</p>
                      </div>
                      <div className="text-right">
                        <GradeBadge score={grade.score} maxScore={grade.maxScore} showPercentage />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Recent Attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Recent Attendance
              </h3>
              <Button
                variant="secondary"
                size="sm"
                icon="Calendar"
                onClick={() => navigate("/attendance")}
              >
                View All
              </Button>
            </div>
            
            {recentAttendance.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No attendance recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttendance.map((record, index) => {
                  const classInfo = classes.find(c => c.Id === record.classId)
                  return (
                    <motion.div
                      key={record.Id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {classInfo ? classInfo.name : "Unknown Class"}
                        </h4>
                        <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                        {record.notes && (
                          <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                        )}
                      </div>
                      <AttendanceStatus status={record.status} />
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetail