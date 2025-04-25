"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, MapPin, Smartphone, CreditCard } from "lucide-react"

type Transaction = {
  amount: number
  location: string
  time: string
  device: string
  fraudScore: number
  timestamp: string
  id?: string
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!transaction) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date)
  }

  const getFraudRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low", color: "text-green-600", icon: CheckCircle }
    if (score < 70) return { level: "Medium", color: "text-amber-600", icon: Clock }
    return { level: "High", color: "text-red-600", icon: AlertTriangle }
  }

  const risk = getFraudRiskLevel(transaction.fraudScore)
  const RiskIcon = risk.icon

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about the transaction processed on {formatDate(transaction.timestamp)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Transaction Overview */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">₹{transaction.amount.toLocaleString()}</h3>
              <p className="text-muted-foreground">Transaction Amount</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <RiskIcon className={`h-5 w-5 ${risk.color}`} />
                <span className={`font-medium ${risk.color}`}>{risk.level} Risk</span>
              </div>
              <Badge
                variant="outline"
                className={
                  transaction.fraudScore < 30
                    ? "bg-green-100 text-green-800 border-green-200"
                    : transaction.fraudScore < 70
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-red-100 text-red-800 border-red-200"
                }
              >
                Fraud Score: {transaction.fraudScore}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p>{transaction.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Time</h4>
                  <p>{transaction.time}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Device</h4>
                  <p>{transaction.device}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Transaction ID</h4>
                  <p className="text-sm font-mono">{transaction.id || `TX${Math.floor(Math.random() * 1000000)}`}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Analysis */}
          <div>
            <h3 className="font-medium mb-2">Risk Analysis</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Fraud Score</span>
                  <span>{transaction.fraudScore}/100</span>
                </div>
                <Progress
                  value={transaction.fraudScore}
                  className="h-2 bg-gray-200"
                  indicatorClassName={
                    transaction.fraudScore < 30
                      ? "bg-green-500"
                      : transaction.fraudScore < 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Location Risk:</span>{" "}
                  <span className="font-medium">
                    {transaction.location === "Mumbai" || transaction.location === "Delhi"
                      ? "Medium"
                      : transaction.location === "Bangalore" || transaction.location === "Pune"
                        ? "Low"
                        : "Standard"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time Risk:</span>{" "}
                  <span className="font-medium">
                    {transaction.time === "Night" || transaction.time === "Late Night"
                      ? "High"
                      : transaction.time === "Evening"
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Device Risk:</span>{" "}
                  <span className="font-medium">
                    {transaction.device === "Mobile Android"
                      ? "Medium"
                      : transaction.device === "Desktop Mac"
                        ? "Low"
                        : "Standard"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount Risk:</span>{" "}
                  <span className="font-medium">
                    {transaction.amount > 20000 ? "High" : transaction.amount > 5000 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
