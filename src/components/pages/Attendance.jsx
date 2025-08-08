import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import AttendanceStatus from "@/components/molecules/AttendanceStatus"
import ApperIcon from "@/components/ApperIcon"
import attendanceService from "@/services/api/attendanceService"
import studentService from "@/services/api/studentService"
import classService from "@/services/api/classService"
import { formatDate } from "@/utils/formatters"

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isTakingAttendance, setIsTakingAttendance] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState({})

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [attendanceData, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ])
      
      setAttendance(attendanceData)
      setStudents(studentsData)
      setClasses(classesData)
    } catch (err) {
      setError("Failed to load attendance data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Load existing attendance for selected date and class
    if (selectedClass && selectedDate) {
      const existingAttendance = attendance.filter(a => 
        a.classId === parseInt(selectedClass) && 
        new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
      )
      
      const attendanceMap = {}
      existingAttendance.forEach(record => {
        attendanceMap[record.studentId] = record.status
      })
      
      setTodayAttendance(attendanceMap)
    }
  }, [selectedClass, selectedDate, attendance])

  const getClassStudents = () => {
    if (!selectedClass) return []
    
    // Get students who have grades or attendance in this class
    const classGrades = attendance.filter(a => a.classId === parseInt(selectedClass))
    const studentIds = new Set(classGrades.map(a => a.studentId))
    
    // If no students found in attendance, return all active students
    if (studentIds.size === 0) {
      return students.filter(s => s.status === "Active").slice(0, 10) // Limit to first 10 for demo
    }
    
    return students.filter(s => studentIds.has(s.Id))
  }

  const handleAttendanceChange = (studentId, status) => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass || Object.keys(todayAttendance).length === 0) {
      toast.error("Please select a class and mark attendance for students")
      return
    }

    try {
      const promises = Object.entries(todayAttendance).map(async ([studentId, status]) => {
        // Check if attendance already exists
        const existing = attendance.find(a => 
          a.studentId === parseInt(studentId) && 
          a.classId === parseInt(selectedClass) &&
          new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
        )

        const attendanceData = {
          studentId: parseInt(studentId),
          classId: parseInt(selectedClass),
          date: new Date(selectedDate).toISOString(),
          status: status,
          notes: ""
        }

        if (existing) {
          return attendanceService.update(existing.Id, attendanceData)
        } else {
          return attendanceService.create(attendanceData)
        }
      })

      await Promise.all(promises)
      await loadData() // Refresh data
      setIsTakingAttendance(false)
      toast.success("Attendance saved successfully!")
    } catch (error) {
      toast.error("Failed to save attendance")
      console.error(error)
    }
  }

  const getAttendanceStats = () => {
    const todayRecords = attendance.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString()
    )
    
    const totalToday = todayRecords.length
    const presentToday = todayRecords.filter(a => a.status === "Present").length
    const absentToday = todayRecords.filter(a => a.status === "Absent").length
    const lateToday = todayRecords.filter(a => a.status === "Late").length
    
    return { totalToday, presentToday, absentToday, lateToday }
  }

  const classStudents = getClassStudents()
  const stats = getAttendanceStats()

  if (loading) {
    return (
      <div>
        <Header title="Attendance" />
        <div className="p-6 lg:p-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Attendance" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Attendance"
        actions={
          <Button
            icon="Calendar"
            onClick={() => setIsTakingAttendance(!isTakingAttendance)}
            variant={isTakingAttendance ? "secondary" : "primary"}
          >
            {isTakingAttendance ? "Cancel" : "Take Attendance"}
          </Button>
        }
      />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Present</p>
                <p className="text-2xl font-bold text-success">{stats.presentToday}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Check" size={24} className="text-success" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Absent</p>
                <p className="text-2xl font-bold text-error">{stats.absentToday}</p>
              </div>
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="X" size={24} className="text-error" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Late</p>
                <p className="text-2xl font-bold text-warning">{stats.lateToday}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Take Attendance Section */}
        {isTakingAttendance && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Take Attendance
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select
                label="Select Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Choose a class</option>
                {classes.map(cls => (
                  <option key={cls.Id} value={cls.Id}>{cls.name}</option>
                ))}
              </Select>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {selectedClass && classStudents.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  {classStudents.map((student, index) => (
                    <motion.div
                      key={student.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.grade}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {["Present", "Absent", "Late"].map(status => (
                          <button
                            key={status}
                            onClick={() => handleAttendanceChange(student.Id, status)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                              todayAttendance[student.Id] === status
                                ? status === "Present" ? "bg-success text-white" :
                                  status === "Absent" ? "bg-error text-white" :
                                  "bg-warning text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsTakingAttendance(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAttendance}
                    disabled={Object.keys(todayAttendance).length === 0}
                  >
                    Save Attendance
                  </Button>
                </div>
              </>
            )}

            {selectedClass && classStudents.length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students found for this class</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Recent Attendance Records
            </h3>
          </div>

          {attendance.length === 0 ? (
            <Empty
              title="No attendance records"
              description="Start by taking attendance for your classes."
              icon="Calendar"
              action={
                <Button
                  icon="Calendar"
                  onClick={() => setIsTakingAttendance(true)}
                >
                  Take First Attendance
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.slice().reverse().slice(0, 20).map((record, index) => {
                    const student = students.find(s => s.Id === record.studentId)
                    const classInfo = classes.find(c => c.Id === record.classId)
                    
                    return (
                      <motion.tr
                        key={record.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {student ? `${student.firstName[0]}${student.lastName[0]}` : "?"}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                              </div>
                              {student && (
                                <div className="text-sm text-gray-500">{student.grade}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {classInfo ? classInfo.name : "Unknown Class"}
                          </div>
                          {classInfo && (
                            <div className="text-sm text-gray-500">{classInfo.subject}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AttendanceStatus status={record.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.notes || "-"}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Attendance