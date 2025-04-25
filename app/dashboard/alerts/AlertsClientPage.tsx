"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, Clock, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for alerts
const mockAlerts = [
  {
    id: "alert-1",
    title: "High-risk transaction detected",
    description: "A transaction of ₹45,000 from Mumbai was flagged as high risk (score: 89)",
    timestamp: "2023-05-15T08:23:45",
    severity: "high",
    status: "new",
  },
  {
    id: "alert-2",
    title: "Unusual location activity",
    description: "Multiple transactions from different locations within 30 minutes",
    timestamp: "2023-05-15T07:12:30",
    severity: "medium",
    status: "new",
  },
  {
    id: "alert-3",
    title: "Large transaction amount",
    description: "Transaction of ₹120,000 exceeds typical spending pattern",
    timestamp: "2023-05-14T22:45:12",
    severity: "medium",
    status: "in-progress",
  },
  {
    id: "alert-4",
    title: "Multiple failed authentication attempts",
    description: "5 failed login attempts from unrecognized device",
    timestamp: "2023-05-14T18:30:22",
    severity: "high",
    status: "in-progress",
  },
  {
    id: "alert-5",
    title: "Suspicious device detected",
    description: "First-time login from new device in Delhi",
    timestamp: "2023-05-14T15:10:05",
    severity: "low",
    status: "resolved",
  },
  {
    id: "alert-6",
    title: "Unusual transaction time",
    description: "Transaction at 3:15 AM outside normal activity hours",
    timestamp: "2023-05-14T03:15:45",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "alert-7",
    title: "Potential account takeover",
    description: "Password changed followed by large transaction",
    timestamp: "2023-05-13T14:22:18",
    severity: "high",
    status: "resolved",
  },
]

export default function AlertsClientPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(["high", "medium", "low"])

  const handleAlertAction = (id: string, newStatus: string) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          return { ...alert, status: newStatus }
        }
        return alert
      }),
    )
  }

  const filteredAlerts = alerts.filter((alert) => selectedSeverities.includes(alert.severity))

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="mr-1 h-3 w-3" /> Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Low
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">Fraud detection alerts and notifications</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={selectedSeverities.includes("high")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSeverities([...selectedSeverities, "high"])
                } else {
                  setSelectedSeverities(selectedSeverities.filter((s) => s !== "high"))
                }
              }}
            >
              High Severity
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSeverities.includes("medium")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSeverities([...selectedSeverities, "medium"])
                } else {
                  setSelectedSeverities(selectedSeverities.filter((s) => s !== "medium"))
                }
              }}
            >
              Medium Severity
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSeverities.includes("low")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSeverities([...selectedSeverities, "low"])
                } else {
                  setSelectedSeverities(selectedSeverities.filter((s) => s !== "low"))
                }
              }}
            >
              Low Severity
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new" className="relative">
            New
            <Badge className="ml-2 bg-red-500 text-white">{alerts.filter((a) => a.status === "new").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
        </TabsList>

        {["new", "in-progress", "resolved", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredAlerts
              .filter((alert) => tab === "all" || alert.status === tab)
              .map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <CardDescription>{formatDate(alert.timestamp)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{alert.description}</p>
                    <div className="flex justify-end gap-2">
                      {alert.status === "new" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, "in-progress")}
                          >
                            Investigate
                          </Button>
                          <Button variant="default" size="sm" onClick={() => handleAlertAction(alert.id, "resolved")}>
                            Mark as Resolved
                          </Button>
                        </>
                      )}
                      {alert.status === "in-progress" && (
                        <Button variant="default" size="sm" onClick={() => handleAlertAction(alert.id, "resolved")}>
                          Mark as Resolved
                        </Button>
                      )}
                      {alert.status === "resolved" && (
                        <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id, "new")}>
                          Reopen Alert
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            {filteredAlerts.filter((alert) => tab === "all" || alert.status === tab).length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No alerts found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
