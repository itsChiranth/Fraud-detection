import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Admin",
      email: "rahul.sharma@fraudguard.com",
      avatar: "/abstract-rs.png",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Analyst",
      email: "priya.patel@fraudguard.com",
      avatar: "/Intersecting Paths.png",
      status: "active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Analyst",
      email: "amit.kumar@fraudguard.com",
      avatar: "/alaskan-landscape.png",
      status: "active",
    },
    {
      id: 4,
      name: "Neha Singh",
      role: "Data Scientist",
      email: "neha.singh@fraudguard.com",
      avatar: "/night-sky-stars.png",
      status: "active",
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      role: "Security Specialist",
      email: "vikram.malhotra@fraudguard.com",
      avatar: "/virtual-meeting-diversity.png",
      status: "away",
    },
    {
      id: 6,
      name: "Deepa Reddy",
      role: "Analyst",
      email: "deepa.reddy@fraudguard.com",
      avatar: "/placeholder.svg?height=40&width=40&query=DR",
      status: "inactive",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "away":
        return <Badge className="bg-amber-100 text-amber-800">Away</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">Manage your team members and their access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View and manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{member.role}</Badge>
                  {getStatusBadge(member.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
