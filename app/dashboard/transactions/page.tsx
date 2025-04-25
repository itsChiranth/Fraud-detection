import type { Metadata } from "next"
import TransactionsClientPage from "./TransactionsClientPage"

export const metadata: Metadata = {
  title: "Transactions - FraudGuard AI",
  description: "View and manage all transactions",
}

export default function TransactionsPage() {
  return <TransactionsClientPage />
}
