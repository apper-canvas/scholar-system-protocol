import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className = ""
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    secondary: "bg-secondary/10 text-secondary"
  }

  return (
    <motion.div 
      className={`card p-6 hover:shadow-lg transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 font-display">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={trend === "up" ? "text-success mr-1" : "text-error mr-1"} 
              />
              <span 
                className={`text-sm font-medium ${
                  trend === "up" ? "text-success" : "text-error"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard