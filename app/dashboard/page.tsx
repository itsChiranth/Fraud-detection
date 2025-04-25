import DashboardHeader from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="flex-1 p-6 md:p-8">
      <DashboardHeader />
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
        <p className="text-muted-foreground">Your fraud detection system is active and monitoring transactions.</p>
      </div>
    </div>
  )
}
