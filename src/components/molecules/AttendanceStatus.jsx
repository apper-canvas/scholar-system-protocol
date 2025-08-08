import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { getAttendanceStatus } from "@/utils/gradeUtils"

const AttendanceStatus = ({ status }) => {
  const statusConfig = {
    "Present": {
      icon: "Check",
      color: "text-success"
    },
    "Absent": {
      icon: "X",
      color: "text-error"
    },
    "Late": {
      icon: "Clock",
      color: "text-warning"
    }
  }

  const config = statusConfig[status] || statusConfig["Absent"]
  const statusClass = getAttendanceStatus(status)

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
      <ApperIcon name={config.icon} size={14} className="mr-1" />
      {status}
    </div>
  )
}

export default AttendanceStatus