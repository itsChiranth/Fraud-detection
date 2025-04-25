"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import TransactionDetailsModal from "./transaction-details-modal"

type Transaction = {
  amount: number
  location: string
  time: string
  device: string
  fraudScore: number
  timestamp: string
  id?: string
}

type SortConfig = {
  key: keyof Transaction
  direction: "asc" | "desc"
}

export default function TransactionsTable({ initialTransactions = [] }: { initialTransactions?: Transaction[] }) {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "timestamp", direction: "desc" })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch transactions with sorting and pagination
  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/recent-transactions?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortConfig.key}&sortDirection=${sortConfig.direction}`,
      )
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data.transactions)
      setTotalPages(Math.ceil(data.total / pageSize))
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch on mount
  useState(() => {
    if (initialTransactions.length === 0) {
      fetchTransactions()
    }
  })

  // Handle sorting
  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
    fetchTransactions()
  }

  // Handle row click to show details
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  // Pagination
  const [totalPages, setTotalPages] = useState(Math.ceil(transactions.length / pageSize))

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      fetchTransactions()
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      fetchTransactions()
    }
  }

  function getFraudBadge(score: number) {
    if (score < 30) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
    } else if (score < 70) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A list of recent transactions processed by the system</CardDescription>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/add-transaction")}>
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("amount")}>
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("location")}>
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("time")}>
                      Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("device")}>
                      Device
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("fraudScore")}>
                      Fraud Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("timestamp")}>
                      Timestamp
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <TableRow key={tx.id || i} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">₹{tx.amount.toLocaleString()}</TableCell>
                      <TableCell>{tx.location}</TableCell>
                      <TableCell>{tx.time}</TableCell>
                      <TableCell>{tx.device}</TableCell>
                      <TableCell>{getFraudBadge(tx.fraudScore)}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(tx)
                          }}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  )
}
