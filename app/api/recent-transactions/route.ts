import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "predictions.json")
    const searchParams = request.nextUrl.searchParams

    // Get pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    // Get sorting parameters
    const sortBy = searchParams.get("sortBy") || "timestamp"
    const sortDirection = searchParams.get("sortDirection") || "desc"

    let predictions = []

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8")
      predictions = JSON.parse(fileContent)
    } else {
      // If file doesn't exist, return mock data
      predictions = getMockTransactions(30) // Generate 30 mock transactions
    }

    // Add IDs if they don't exist
    predictions = predictions.map((pred: any, index: number) => ({
      ...pred,
      id: pred.id || `tx-${index}-${Date.now()}`,
    }))

    // Sort the predictions
    predictions.sort((a: any, b: any) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      // Handle special cases for sorting
      if (sortBy === "timestamp") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Calculate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedPredictions = predictions.slice(startIndex, endIndex)

    return NextResponse.json({
      transactions: paginatedPredictions,
      total: predictions.length,
      page,
      pageSize,
      totalPages: Math.ceil(predictions.length / pageSize),
    })
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return NextResponse.json({ error: "Failed to fetch recent transactions" }, { status: 500 })
  }
}

function getMockTransactions(count = 10) {
  // Indian cities
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur"]

  // Time periods
  const times = ["Morning", "Afternoon", "Evening", "Night", "Late Night"]

  // Devices
  const devices = ["Mobile Android", "Mobile iOS", "Desktop Windows", "Desktop Mac", "Tablet"]

  // Generate mock transactions
  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const location = cities[Math.floor(Math.random() * cities.length)]
    const time = times[Math.floor(Math.random() * times.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]
    const fraudScore = Math.floor(Math.random() * 100)

    // Generate a random timestamp within the last 30 days
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()

    return {
      id: `tx-${i}-${Date.now()}`,
      amount,
      location,
      time,
      device,
      fraudScore,
      timestamp,
    }
  })
}
