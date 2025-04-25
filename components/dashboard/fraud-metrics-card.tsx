import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

async function getMetrics() {
  // In a real app, this would fetch from your API
  return {
    falsePositives: 23,
    falseNegatives: 12,
    avgResponseTime: 187,
    modelConfidence: {
      low: 15,
      medium: 35,
      high: 78,
    },
  }
}

export default async function FraudMetricsCard() {
  const metrics = await getMetrics()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Detection Metrics</CardTitle>
        <CardDescription>Key performance indicators for your fraud detection system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">False Positives</p>
            <p className="text-2xl font-bold">{metrics.falsePositives}</p>
          </div>
          <div>
            <p className="text-sm font-medium">False Negatives</p>
            <p className="text-2xl font-bold">{metrics.falseNegatives}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Avg. Response Time</p>
            <p className="text-2xl font-bold">{metrics.avgResponseTime} ms</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Model Confidence</p>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Low Risk</span>
                <span>{metrics.modelConfidence.low}%</span>
              </div>
              <Progress
                value={metrics.modelConfidence.low}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-green-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Medium Risk</span>
                <span>{metrics.modelConfidence.medium}%</span>
              </div>
              <Progress
                value={metrics.modelConfidence.medium}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-amber-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>High Risk</span>
                <span>{metrics.modelConfidence.high}%</span>
              </div>
              <Progress
                value={metrics.modelConfidence.high}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-red-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
