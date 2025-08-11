import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import StatCard from "@/components/molecules/StatCard"
import QuickAction from "@/components/molecules/QuickAction"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import classService from "@/services/api/classService"
import gradeService from "@/services/api/gradeService"
import attendanceService from "@/services/api/attendanceService"
import { formatDate } from "@/utils/formatters"
import { calculateLetterGrade } from "@/utils/gradeUtils"

const Dashboard = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, classesData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudents(studentsData)
      setClasses(classesData)
      setGrades(gradesData)
      setAttendance(attendanceData)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <Header title="Dashboard" />
        <div className="mt-6">
          <Loading type="dashboard" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Header title="Dashboard" />
        <div className="mt-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    )
  }

// Calculate statistics
  const activeStudents = students.filter(s => s.status_c === "Active").length
  const totalClasses = classes.length
  const averageGrade = grades.length > 0 ? 
    grades.reduce((sum, grade) => sum + ((grade.score_c || 0) / (grade.max_score_c || 1) * 100), 0) / grades.length : 0
  const todayAttendance = attendance.filter(a => 
    new Date(a.date_c || a.date).toDateString() === new Date().toDateString()
  )
  const attendanceRate = todayAttendance.length > 0 ?
    (todayAttendance.filter(a => a.status_c === "Present" || a.status === "Present").length / todayAttendance.length * 100) : 0
  // Recent activities
  const recentStudents = students.slice(-5).reverse()
  const recentGrades = grades.slice(-5).reverse()

  const quickActions = [
    {
      title: "Take Attendance",
      description: "Mark today's attendance for all classes",
      icon: "Calendar",
      color: "primary",
      action: () => navigate("/attendance")
    },
    {
      title: "Enter Grades",
      description: "Add or update student grades",
      icon: "GraduationCap",
      color: "success",
      action: () => navigate("/grades")
    },
    {
      title: "Add Student",
      description: "Enroll a new student",
      icon: "UserPlus",
      color: "warning",
      action: () => navigate("/students")
    },
    {
      title: "Manage Classes",
      description: "Create or edit class information",
      icon: "BookOpen",
      color: "error",
      action: () => navigate("/classes")
    }
  ]

  return (
    <div>
      <Header title="Dashboard" />
      
      <div className="p-6 lg:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Students"
            value={activeStudents}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+12% from last month"
          />
          <StatCard
            title="Total Classes"
            value={totalClasses}
            icon="BookOpen"
            color="success"
          />
          <StatCard
            title="Average Grade"
            value={`${averageGrade.toFixed(1)}%`}
            icon="GraduationCap"
            color="warning"
            trend={averageGrade > 75 ? "up" : "down"}
            trendValue={`${calculateLetterGrade(averageGrade)} average`}
          />
          <StatCard
            title="Today's Attendance"
            value={`${attendanceRate.toFixed(0)}%`}
            icon="Calendar"
            color="error"
            trend={attendanceRate > 80 ? "up" : "down"}
            trendValue={`${todayAttendance.length} students`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuickAction
                      title={action.title}
                      description={action.description}
                      icon={action.icon}
                      color={action.color}
                      onClick={action.action}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Students */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">
                    Recent Students
                  </h3>
                  <button
                    onClick={() => navigate("/students")}
                    className="text-primary hover:text-blue-600 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentStudents.map((student, index) => (
<motion.div
                      key={student.Id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/students/${student.Id}`)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {(student.first_name_c || '')[0]}{(student.last_name_c || '')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.first_name_c || ''} {student.last_name_c || ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.grade_c || ''} • {student.enrollment_date_c ? formatDate(student.enrollment_date_c) : ''}
                        </p>
                      </div>
                      <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
                    </motion.div>
                  ))}
                  {recentStudents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No students enrolled yet
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Grades */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">
                    Recent Grades
                  </h3>
                  <button
                    onClick={() => navigate("/grades")}
                    className="text-primary hover:text-blue-600 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
{recentGrades.map((grade, index) => {
                    const student = students.find(s => s.Id === (grade.student_id_c?.Id || grade.student_id_c))
                    const percentage = ((grade.score_c || 0) / (grade.max_score_c || 1)) * 100
                    const letterGrade = calculateLetterGrade(percentage)
                    
                    return (
                      <motion.div
                        key={grade.Id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {grade.assignment_name_c || ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student ? `${student.first_name_c || ''} ${student.last_name_c || ''}` : "Unknown Student"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {grade.score_c || 0}/{grade.max_score_c || 0}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            letterGrade === "A" ? "bg-green-100 text-green-700" :
                            letterGrade === "B" ? "bg-blue-100 text-blue-700" :
                            letterGrade === "C" ? "bg-yellow-100 text-yellow-700" :
                            letterGrade === "D" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {letterGrade}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {recentGrades.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No grades recorded yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Classes */}
        {classes.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              Today's Classes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{classes.slice(0, 6).map((classItem, index) => (
                <motion.div
                  key={classItem.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => navigate(`/classes/${classItem.Id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{classItem.Name || ''}</h4>
                      <p className="text-sm text-gray-600">{classItem.subject_c || ''}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <ApperIcon name="Clock" size={12} className="mr-1" />
                        {classItem.period_c || ''}
                        <span className="mx-2">•</span>
                        <ApperIcon name="MapPin" size={12} className="mr-1" />
                        {classItem.room_c || ''}
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard