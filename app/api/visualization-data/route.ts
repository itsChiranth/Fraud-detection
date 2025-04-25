import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "predictions.json")

    let data = []

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8")
      data = JSON.parse(fileContent)
    } else {
      // If file doesn't exist, return mock data
      data = getMockTransactions(100) // Generate 100 mock transactions for better visualization
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching visualization data:", error)
    return NextResponse.json({ error: "Failed to fetch visualization data" }, { status: 500 })
  }
}

function getMockTransactions(count = 100) {
  // Indian cities
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur"]

  // Time periods
  const times = ["Morning", "Afternoon", "Evening", "Night", "Late Night"]

  // Devices
  const devices = ["Mobile Android", "Mobile iOS", "Desktop Windows", "Desktop Mac", "Tablet"]

  // Generate mock transactions over the last 30 days
  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const location = cities[Math.floor(Math.random() * cities.length)]
    const time = times[Math.floor(Math.random() * times.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]

    // Make fraud scores more realistic with a distribution
    let fraudScore
    const rand = Math.random()
    if (rand < 0.6) {
      // 60% low risk
      fraudScore = Math.floor(Math.random() * 30)
    } else if (rand < 0.9) {
      // 30% medium risk
      fraudScore = Math.floor(Math.random() * 40) + 30
    } else {
      // 10% high risk
      fraudScore = Math.floor(Math.random() * 30) + 70
    }

    // Generate a random timestamp within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    const timestamp = date.toISOString()

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
