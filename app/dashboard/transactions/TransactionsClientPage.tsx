"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ArrowUpDown, Info, Filter, Download } from "lucide-react"
import TransactionDetailsModal from "@/components/dashboard/transaction-details-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default function TransactionsClientPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "timestamp", direction: "desc" })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string[]>(["high", "medium", "low"])

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
  useEffect(() => {
    fetchTransactions()
  }, [currentPage, pageSize, sortConfig])

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
  }

  // Handle row click to show details
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Filter transactions by risk level
  const getRiskLevel = (score: number) => {
    if (score < 30) return "low"
    if (score < 70) return "medium"
    return "high"
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === "" ||
      tx.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm)

    const matchesRisk = riskFilter.includes(getRiskLevel(tx.fraudScore))

    return matchesSearch && matchesRisk
  })

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
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and manage all transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/add-transaction")}>
              Add Transaction
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Risk Level
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={riskFilter.includes("high")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRiskFilter([...riskFilter, "high"])
                        } else {
                          setRiskFilter(riskFilter.filter((r) => r !== "high"))
                        }
                      }}
                    >
                      High Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={riskFilter.includes("medium")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRiskFilter([...riskFilter, "medium"])
                        } else {
                          setRiskFilter(riskFilter.filter((r) => r !== "medium"))
                        }
                      }}
                    >
                      Medium Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={riskFilter.includes("low")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRiskFilter([...riskFilter, "low"])
                        } else {
                          setRiskFilter(riskFilter.filter((r) => r !== "low"))
                        }
                      }}
                    >
                      Low Risk
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx, i) => (
                      <TableRow key={tx.id || i} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">₹{tx.amount.toLocaleString()}</TableCell>
                        <TableCell>{tx.location}</TableCell>
                        <TableCell>{tx.time}</TableCell>
                        <TableCell>{tx.device}</TableCell>
                        <TableCell>{getFraudBadge(tx.fraudScore)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
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
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  )
}
