import { format, parseISO } from "date-fns"

export const formatDate = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMM dd, yyyy")
}

export const formatDateTime = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMM dd, yyyy 'at' h:mm a")
}

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

export const formatGrade = (score, maxScore) => {
  if (!score || !maxScore) return "N/A"
  return `${score}/${maxScore} (${formatPercentage((score / maxScore) * 100)})`
}

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      return typeof value === "string" && value.includes(",") 
        ? `"${value}"` 
        : value
    }).join(","))
  ].join("\n")
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}