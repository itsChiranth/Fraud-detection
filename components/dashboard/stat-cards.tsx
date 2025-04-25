import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, BarChart3, CheckCircle } from "lucide-react"

async function getStats() {
  // In a real app, this would fetch from your API
  return {
    totalTransactions: 12487,
    flaggedAsFraud: 247,
    modelAccuracy: 98.7,
    systemStatus: "Online",
  }
}

export default async function StatCards() {
  const stats = await getStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            {stats.totalTransactions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flagged as Fraud</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {stats.flaggedAsFraud.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">-0.7% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
          <BarChart3 className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            {stats.modelAccuracy}%
          </div>
          <p className="text-xs text-muted-foreground">+0.2% from last training</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              {stats.systemStatus}
            </div>
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground">99.9% uptime this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
