import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import GradeBadge from "@/components/molecules/GradeBadge"
import { formatDate } from "@/utils/formatters"

const StudentTable = ({ students, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleRowClick = (studentId) => {
    navigate(`/students/${studentId}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Grade Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Enrollment Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{students.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(student.Id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {(student.first_name_c || '')[0]}{(student.last_name_c || '')[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.first_name_c || ''} {student.last_name_c || ''}
                      </div>
                      <div className="text-sm text-gray-500">{student.email_c || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{student.grade_c || ''}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {student.enrollment_date_c ? formatDate(student.enrollment_date_c) : ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    student.status_c === "Active" 
                      ? "bg-success/10 text-success" 
                      : "bg-error/10 text-error"
                  }`}>
                    {student.status_c || ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit({
                          ...student,
                          firstName: student.first_name_c,
                          lastName: student.last_name_c,
                          email: student.email_c,
                          grade: student.grade_c,
                          dateOfBirth: student.date_of_birth_c,
                          enrollmentDate: student.enrollment_date_c,
                          status: student.status_c
                        })
                      }}
                      className="text-primary hover:text-blue-600 transition-colors duration-150"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(student.Id)
                      }}
                      className="text-error hover:text-red-600 transition-colors duration-150"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentTable