import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export const metadata: Metadata = {
  title: "Analytics - FraudGuard AI",
  description: "Detailed analytics for fraud detection",
}

// Mock data for analytics
const fraudByLocation = [
  { name: "Mumbai", fraudulent: 45, legitimate: 320 },
  { name: "Delhi", fraudulent: 52, legitimate: 280 },
  { name: "Bangalore", fraudulent: 28, legitimate: 410 },
  { name: "Hyderabad", fraudulent: 32, legitimate: 350 },
  { name: "Chennai", fraudulent: 25, legitimate: 290 },
  { name: "Kolkata", fraudulent: 38, legitimate: 260 },
]

const fraudByTime = [
  { name: "Morning", fraudulent: 18, legitimate: 320 },
  { name: "Afternoon", fraudulent: 25, legitimate: 280 },
  { name: "Evening", fraudulent: 35, legitimate: 240 },
  { name: "Night", fraudulent: 48, legitimate: 180 },
  { name: "Late Night", fraudulent: 62, legitimate: 120 },
]

const fraudByDevice = [
  { name: "Mobile Android", value: 38 },
  { name: "Mobile iOS", value: 25 },
  { name: "Desktop Windows", value: 18 },
  { name: "Desktop Mac", value: 12 },
  { name: "Tablet", value: 7 },
]

const fraudTrend = [
  { name: "Jan", fraudRate: 2.3 },
  { name: "Feb", fraudRate: 2.1 },
  { name: "Mar", fraudRate: 2.5 },
  { name: "Apr", fraudRate: 2.8 },
  { name: "May", fraudRate: 2.4 },
  { name: "Jun", fraudRate: 2.2 },
  { name: "Jul", fraudRate: 2.6 },
  { name: "Aug", fraudRate: 2.9 },
  { name: "Sep", fraudRate: 3.1 },
  { name: "Oct", fraudRate: 2.7 },
  { name: "Nov", fraudRate: 2.5 },
  { name: "Dec", fraudRate: 2.8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed analysis of fraud detection patterns</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Rate Trend</CardTitle>
            <CardDescription>Monthly fraud rate percentage over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={fraudTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Fraud Rate"]} />
                  <Legend />
                  <Line type="monotone" dataKey="fraudRate" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fraud by Location</CardTitle>
              <CardDescription>Distribution of fraudulent transactions by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fraudByLocation}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fraudulent" fill="#ef4444" />
                    <Bar dataKey="legitimate" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud by Time of Day</CardTitle>
              <CardDescription>Distribution of fraudulent transactions by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fraudByTime}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fraudulent" fill="#ef4444" />
                    <Bar dataKey="legitimate" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fraud by Device Type</CardTitle>
            <CardDescription>Distribution of fraudulent transactions by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fraudByDevice}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fraudByDevice.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} fraudulent transactions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
