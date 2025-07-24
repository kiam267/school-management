import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  Building,
  Monitor,
  ImageIcon,
  MessageSquare,
  Newspaper,
  Info,
  Settings,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { title: "Total Students", value: "1,250", icon: Users, color: "text-blue-600" },
  { title: "Teachers", value: "85", icon: GraduationCap, color: "text-green-600" },
  { title: "Rooms", value: "45", icon: Building, color: "text-purple-600" },
  { title: "Computers", value: "120", icon: Monitor, color: "text-orange-600" },
]

const managementSections = [
  {
    title: "Hero Section",
    description: "Manage homepage hero slider",
    icon: ImageIcon,
    href: "/admin/hero",
    color: "bg-blue-500",
  },
  {
    title: "Testimonials",
    description: "Manage student testimonials",
    icon: MessageSquare,
    href: "/admin/testimonials",
    color: "bg-green-500",
  },
  {
    title: "Teachers",
    description: "Manage teacher profiles",
    icon: GraduationCap,
    href: "/admin/teachers",
    color: "bg-purple-500",
  },
  {
    title: "Statistics",
    description: "Manage homepage statistics",
    icon: BarChart3,
    href: "/admin/statistics",
    color: "bg-indigo-500",
  },
  {
    title: "News",
    description: "Manage news articles",
    icon: Newspaper,
    href: "/admin/news",
    color: "bg-orange-500",
  },
  {
    title: "About",
    description: "Manage about page content",
    icon: Info,
    href: "/admin/about",
    color: "bg-cyan-500",
  },
  {
    title: "Settings",
    description: "School branding, theme & configuration",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-gray-500",
  },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Royal Academy admin panel</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-4`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={section.href}>Manage</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
