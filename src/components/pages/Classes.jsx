import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import classService from "@/services/api/classService"
import studentService from "@/services/api/studentService"
import gradeService from "@/services/api/gradeService"

const Classes = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [classesData, studentsData, gradesData] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        gradeService.getAll()
      ])
      
      setClasses(classesData)
      setStudents(studentsData)
      setGrades(gradesData)
    } catch (err) {
      setError("Failed to load classes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.period.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getClassStats = (classId) => {
    const classGrades = grades.filter(g => g.classId === classId)
    const uniqueStudents = new Set(classGrades.map(g => g.studentId))
    const enrollmentCount = uniqueStudents.size
    
    const averageGrade = classGrades.length > 0 ? 
      classGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / classGrades.length : 0

    return {
      enrollmentCount,
      averageGrade: averageGrade.toFixed(1),
      totalAssignments: classGrades.length
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Classes" />
        <div className="p-6 lg:p-8">
          <Loading type="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Classes" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

const handleCreateClass = () => {
    toast.success("Create Class functionality would open here")
  }

  return (
    <div>
      <Header
        title="Classes"
        search={{
          value: searchTerm,
          placeholder: "Search classes..."
        }}
        onSearchChange={setSearchTerm}
        action={
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleCreateClass}
          >
            Create Class
          </Button>
        }
      />
      <div className="p-6 lg:p-8">
        {filteredClasses.length === 0 ? (
          searchTerm ? (
            <Empty
              title="No classes found"
              description={`No classes match "${searchTerm}". Try adjusting your search.`}
              icon="Search"
            />
          ) : (
            <Empty
              title="No classes created"
              description="Classes will appear here once they are created in the system."
              icon="BookOpen"
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem, index) => {
              const stats = getClassStats(classItem.Id)
              
              return (
                <motion.div
                  key={classItem.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => navigate(`/classes/${classItem.Id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 font-display mb-1">
                        {classItem.name}
                      </h3>
                      <p className="text-gray-600">{classItem.subject}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" size={24} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" size={16} className="mr-2" />
                      <span>{classItem.period}</span>
                      <span className="mx-2">•</span>
                      <ApperIcon name="MapPin" size={16} className="mr-2" />
                      <span>{classItem.room}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Calendar" size={16} className="mr-2" />
                      <span>{classItem.semester} {classItem.year}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{stats.enrollmentCount}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{stats.averageGrade}%</div>
                      <div className="text-xs text-gray-500">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{stats.totalAssignments}</div>
                      <div className="text-xs text-gray-500">Assignments</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Classes