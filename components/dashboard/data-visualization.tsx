"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

type FraudData = {
  fraudScore: number
  timestamp: string
  amount: number
  location: string
}

export default function DataVisualization() {
  const [data, setData] = useState<FraudData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/visualization-data")
        if (!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching visualization data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare data for fraud score distribution chart
  const fraudScoreDistribution = [
    { name: "Low Risk (0-30)", value: 0 },
    { name: "Medium Risk (31-70)", value: 0 },
    { name: "High Risk (71-100)", value: 0 },
  ]

  data.forEach((item) => {
    if (item.fraudScore <= 30) {
      fraudScoreDistribution[0].value++
    } else if (item.fraudScore <= 70) {
      fraudScoreDistribution[1].value++
    } else {
      fraudScoreDistribution[2].value++
    }
  })

  // Prepare data for location-based fraud chart
  const locationData: Record<string, { total: number; fraudulent: number }> = {}
  data.forEach((item) => {
    if (!locationData[item.location]) {
      locationData[item.location] = { total: 0, fraudulent: 0 }
    }
    locationData[item.location].total++
    if (item.fraudScore > 70) {
      locationData[item.location].fraudulent++
    }
  })

  const locationChartData = Object.entries(locationData).map(([location, stats]) => ({
    location,
    total: stats.total,
    fraudulent: stats.fraudulent,
    fraudRate: stats.total > 0 ? (stats.fraudulent / stats.total) * 100 : 0,
  }))

  // Prepare data for fraud trend over time
  const timeData: Record<string, { date: string; count: number; fraudulent: number }> = {}
  data.forEach((item) => {
    const date = new Date(item.timestamp).toLocaleDateString()
    if (!timeData[date]) {
      timeData[date] = { date, count: 0, fraudulent: 0 }
    }
    timeData[date].count++
    if (item.fraudScore > 70) {
      timeData[date].fraudulent++
    }
  })

  const trendChartData = Object.values(timeData).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Colors for pie chart
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Analytics</CardTitle>
        <CardDescription>Visual representation of fraud detection metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <p>Loading visualization data...</p>
          </div>
        ) : (
          <Tabs defaultValue="distribution">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribution">Fraud Score Distribution</TabsTrigger>
              <TabsTrigger value="location">Location Analysis</TabsTrigger>
              <TabsTrigger value="trend">Fraud Trend</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fraudScoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fraudScoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} labelFormatter={() => ""} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="location" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="Total Transactions" />
                    <Bar yAxisId="right" dataKey="fraudulent" fill="#ef4444" name="Fraudulent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="trend" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Total Transactions" />
                    <Line type="monotone" dataKey="fraudulent" stroke="#ef4444" name="Fraudulent Transactions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
