import React from "react"
import Badge from "@/components/atoms/Badge"
import { calculateLetterGrade, getGradeColor } from "@/utils/gradeUtils"

const GradeBadge = ({ score, maxScore, showPercentage = false }) => {
  if (!score || !maxScore) {
    return (
      <Badge variant="default" size="sm">
        N/A
      </Badge>
    )
  }

  const percentage = (score / maxScore) * 100
  const letterGrade = calculateLetterGrade(percentage)
  const colorClass = getGradeColor(letterGrade)

  return (
    <div className="flex items-center space-x-2">
      <div className={`grade-badge ${colorClass}`}>
        {letterGrade}
      </div>
      {showPercentage && (
        <span className="text-sm text-gray-600">
          {percentage.toFixed(1)}%
        </span>
      )}
    </div>
  )
}

export default GradeBadge