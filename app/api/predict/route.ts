import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.amount || !data.location || !data.time || !data.device) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Call the Python FastAPI model
    let result
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction from model")
      }

      result = await response.json()
    } catch (error) {
      console.error("Error calling prediction model:", error)

      // Fallback to local prediction if model is unavailable
      const fraudScore = calculateFallbackFraudScore(data)
      result = {
        fraudScore,
        riskFactors: getFallbackRiskFactors(data, fraudScore),
        timestamp: new Date().toISOString(),
      }
    }

    // Create prediction record
    const prediction = {
      ...data,
      id: uuidv4(),
      fraudScore: result.fraudScore,
      riskFactors: result.riskFactors || {},
      timestamp: new Date().toISOString(),
    }

    // Save to predictions.json
    const filePath = path.join(process.cwd(), "predictions.json")
    let predictions = []

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8")
        predictions = JSON.parse(fileContent)
      }
    } catch (error) {
      console.error("Error reading predictions file:", error)
    }

    predictions.unshift(prediction)
    fs.writeFileSync(filePath, JSON.stringify(predictions, null, 2))

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error processing prediction:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}

// Fallback fraud score calculation if model is unavailable
function calculateFallbackFraudScore(data: any): number {
  let score = 0

  // Amount factor
  const amount = Number(data.amount)
  if (amount > 50000) score += 40
  else if (amount > 20000) score += 25
  else if (amount > 5000) score += 10

  // Location factor
  if (data.location === "Delhi" || data.location === "Mumbai") score += 15
  else if (data.location === "Kolkata" || data.location === "Jaipur") score += 10

  // Time factor
  if (data.time === "Night" || data.time === "Late Night") score += 30
  else if (data.time === "Evening") score += 15

  // Device factor
  if (data.device === "Mobile Android") score += 15
  else if (data.device === "Tablet") score += 10

  // Add some randomness
  score += Math.floor(Math.random() * 10)

  // Ensure score is between 0 and 100
  return Math.min(100, Math.max(0, score))
}

// Fallback risk factors if model is unavailable
function getFallbackRiskFactors(data: any, fraudScore: number): Record<string, string> {
  const riskFactors: Record<string, string> = {}

  // Amount risk
  const amount = Number(data.amount)
  if (amount > 20000) riskFactors.amount = "High"
  else if (amount > 5000) riskFactors.amount = "Medium"
  else riskFactors.amount = "Low"

  // Location risk
  if (data.location === "Delhi" || data.location === "Mumbai") {
    riskFactors.location = "Medium"
  } else if (data.location === "Kolkata" || data.location === "Jaipur") {
    riskFactors.location = "Medium"
  } else {
    riskFactors.location = "Low"
  }

  // Time risk
  if (data.time === "Night" || data.time === "Late Night") {
    riskFactors.time = "High"
  } else if (data.time === "Evening") {
    riskFactors.time = "Medium"
  } else {
    riskFactors.time = "Low"
  }

  // Device risk
  if (data.device === "Mobile Android") {
    riskFactors.device = "Medium"
  } else if (data.device === "Tablet") {
    riskFactors.device = "Medium"
  } else {
    riskFactors.device = "Low"
  }

  return riskFactors
}
