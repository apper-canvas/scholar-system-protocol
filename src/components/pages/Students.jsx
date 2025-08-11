import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import StudentTable from "@/components/organisms/StudentTable"
import StudentModal from "@/components/organisms/StudentModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import { exportToCSV } from "@/utils/formatters"

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

const loadStudents = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await studentService.getAll()
      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      setError("Failed to load students")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        `${student.first_name_c || ''} ${student.last_name_c || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.grade_c || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [searchTerm, students])

  const handleAddStudent = () => {
    setEditingStudent(null)
    setIsModalOpen(true)
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setIsModalOpen(true)
  }

const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          grade: studentData.grade,
          dateOfBirth: studentData.dateOfBirth,
          enrollmentDate: studentData.enrollmentDate,
          status: studentData.status
        })
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s))
        toast.success("Student updated successfully!")
      } else {
        const newStudent = await studentService.create({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          grade: studentData.grade,
          dateOfBirth: studentData.dateOfBirth,
          enrollmentDate: studentData.enrollmentDate || new Date().toISOString(),
          status: studentData.status || "Active"
        })
        setStudents(prev => [...prev, newStudent])
        toast.success("Student added successfully!")
      }
    } catch (error) {
      toast.error("Failed to save student")
      console.error(error)
      throw error
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId)
        setStudents(prev => prev.filter(s => s.Id !== studentId))
        toast.success("Student deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete student")
        console.error(error)
      }
    }
  }

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      toast.info("No students to export")
      return
    }

const exportData = filteredStudents.map(student => ({
      "First Name": student.first_name_c || '',
      "Last Name": student.last_name_c || '',
      "Email": student.email_c || '',
      "Grade": student.grade_c || '',
      "Date of Birth": student.date_of_birth_c ? new Date(student.date_of_birth_c).toLocaleDateString() : '',
      "Enrollment Date": student.enrollment_date_c ? new Date(student.enrollment_date_c).toLocaleDateString() : '',
      "Status": student.status_c || ''
    }))

    exportToCSV(exportData, "students.csv")
    toast.success("Students exported successfully!")
  }

  if (loading) {
    return (
      <div>
        <Header title="Students" />
        <div className="p-6 lg:p-8">
          <Loading type="table" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Students" />
        <div className="p-6 lg:p-8">
          <Error message={error} onRetry={loadStudents} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Students"
        search={{
          value: searchTerm,
          placeholder: "Search students..."
        }}
        onSearchChange={setSearchTerm}
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon="Download"
              onClick={handleExport}
              disabled={filteredStudents.length === 0}
            >
              Export
            </Button>
            <Button
              icon="UserPlus"
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        {filteredStudents.length === 0 ? (
          searchTerm ? (
            <Empty
              title="No students found"
              description={`No students match "${searchTerm}". Try adjusting your search.`}
              icon="Search"
            />
          ) : (
            <Empty
              title="No students enrolled"
              description="Start by adding your first student to the system."
              icon="Users"
              action={
                <Button
                  icon="UserPlus"
                  onClick={handleAddStudent}
                >
                  Add First Student
                </Button>
              }
            />
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </motion.div>
        )}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStudent(null)
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  )
}

export default Students