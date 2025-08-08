import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const QuickAction = ({ title, description, icon, onClick, color = "primary" }) => {
  const colorClasses = {
    primary: "hover:bg-primary/5 border-primary/20",
    success: "hover:bg-success/5 border-success/20",
    warning: "hover:bg-warning/5 border-warning/20",
    error: "hover:bg-error/5 border-error/20"
  }

  const iconColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error"
  }

  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-4 border-2 border-dashed rounded-xl text-left transition-all duration-200 ${colorClasses[color]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${iconColors[color]}`}>
          <ApperIcon name={icon} size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
      </div>
    </motion.button>
  )
}

export default QuickAction