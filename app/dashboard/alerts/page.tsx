import type { Metadata } from "next"
import AlertsClientPage from "./AlertsClientPage"

export const metadata: Metadata = {
  title: "Alerts - FraudGuard AI",
  description: "Fraud detection alerts and notifications",
}

export default function AlertsPage() {
  return <AlertsClientPage />
}
