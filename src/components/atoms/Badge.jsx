import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    grade: "grade-badge"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        variant !== "grade" && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge