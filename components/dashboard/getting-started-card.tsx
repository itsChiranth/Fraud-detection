import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Settings } from "lucide-react"

export default function GettingStartedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription>Complete these steps to set up your fraud detection system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">Connect gateway</h3>
            <p className="text-sm text-muted-foreground">
              Connect your payment gateway to start monitoring transactions
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">Configure rules</h3>
            <p className="text-sm text-muted-foreground">Set up custom rules and thresholds for fraud detection</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">Process transaction</h3>
            <p className="text-sm text-muted-foreground">
              Start processing transactions with AI-powered fraud detection
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
