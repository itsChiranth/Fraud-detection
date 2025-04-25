"use client"

import { Home, BarChart2, AlertTriangle, Settings, Users, CreditCard, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navigation = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          icon: Home,
          href: "/dashboard",
        },
        {
          title: "Analytics",
          icon: BarChart2,
          href: "/dashboard/analytics",
        },
        {
          title: "Alerts",
          icon: AlertTriangle,
          href: "/dashboard/alerts",
        },
        {
          title: "Transactions",
          icon: CreditCard,
          href: "/dashboard/transactions",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "General",
          icon: Settings,
          href: "/dashboard/settings",
        },
        {
          title: "Team",
          icon: Users,
          href: "/dashboard/team",
        },
      ],
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>FraudGuard AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarInput placeholder="Search..." />
          </SidebarGroupContent>
        </SidebarGroup>

        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={pathname === item.href} onClick={() => handleNavigation(item.href)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "Guest User"}</p>
              <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
