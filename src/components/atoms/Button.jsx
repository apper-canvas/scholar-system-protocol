import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary hover:bg-blue-600 text-white focus:ring-primary/50 hover:shadow-lg hover:shadow-primary/25",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500/50 hover:shadow-md",
    success: "bg-success hover:bg-green-600 text-white focus:ring-success/50 hover:shadow-lg hover:shadow-success/25",
    danger: "bg-error hover:bg-red-600 text-white focus:ring-error/50 hover:shadow-lg hover:shadow-error/25",
    outline: "border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500/50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500/50"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      ) : icon ? (
        <ApperIcon name={icon} size={16} className="mr-2" />
      ) : null}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button