"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette } from "lucide-react"

export default function ThemeRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/admin/settings")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleRedirect = () => {
    router.push("/admin/settings")
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Palette className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle>Theme Settings Moved</CardTitle>
            <CardDescription>
              Theme customization is now part of the Settings page for better organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You will be automatically redirected to the Settings page in a few seconds.
            </p>
            <Button onClick={handleRedirect} className="w-full">
              Go to Settings
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
