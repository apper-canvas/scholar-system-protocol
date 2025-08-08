export const calculateLetterGrade = (percentage) => {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "B"
  if (percentage >= 70) return "C"
  if (percentage >= 60) return "D"
  return "F"
}

export const getGradeColor = (grade) => {
  const colors = {
    "A": "grade-a",
    "B": "grade-b", 
    "C": "grade-c",
    "D": "grade-d",
    "F": "grade-f"
  }
  return colors[grade] || "grade-f"
}

export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0
  
  const gradePoints = {
    "A": 4.0,
    "B": 3.0,
    "C": 2.0,
    "D": 1.0,
    "F": 0.0
  }
  
  const total = grades.reduce((sum, grade) => {
    const percentage = (grade.score / grade.maxScore) * 100
    const letter = calculateLetterGrade(percentage)
    return sum + gradePoints[letter]
  }, 0)
  
  return (total / grades.length).toFixed(2)
}

export const getAttendanceStatus = (status) => {
  const statusClasses = {
    "Present": "attendance-present",
    "Absent": "attendance-absent",
    "Late": "attendance-late"
  }
  return statusClasses[status] || "attendance-absent"
}