"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Upload, RotateCcw, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

const initialAboutData = {
  heroImage: "/placeholder.svg?height=400&width=1200",
  vision:
    "To be a leading educational institution that nurtures innovative thinkers, compassionate leaders, and responsible global citizens who contribute meaningfully to society and drive positive change in the world.",
  mission:
    "We provide a comprehensive, student-centered education that combines academic excellence with character development, critical thinking, and practical skills preparation for higher education and life success.",
  overview:
    "Royal Academy has been a cornerstone of educational excellence for nearly four decades. Founded in 1985, we have consistently evolved to meet the changing needs of our students and the demands of a rapidly advancing world.",
  foundedYear: "1985",
  motto: "Excellence in Education, Character in Life",
}

const initialAchievements = [
  { id: 1, year: "1985", title: "School Founded", description: "Established with a vision for excellence" },
  { id: 2, year: "1995", title: "First Computer Lab", description: "Introduced technology in education" },
  {
    id: 3,
    year: "2005",
    title: "Science Excellence Award",
    description: "Recognized for outstanding science education",
  },
  { id: 4, year: "2015", title: "Digital Transformation", description: "Fully integrated digital learning" },
  { id: 5, year: "2020", title: "Online Learning Pioneer", description: "Successfully adapted to remote learning" },
  { id: 6, year: "2024", title: "AI Integration", description: "Leading in AI-assisted education" },
]

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState(initialAboutData)
  const [achievements, setAchievements] = useState(initialAchievements)
  const [isAddingAchievement, setIsAddingAchievement] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<any>(null)
  const [achievementForm, setAchievementForm] = useState({
    year: "",
    title: "",
    description: "",
  })
  const { toast } = useToast()

  const handleAboutDataChange = (field: keyof typeof aboutData, value: string) => {
    setAboutData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Success",
      description: "About page content updated successfully",
    })
  }

  const handleReset = () => {
    setAboutData(initialAboutData)
    setAchievements(initialAchievements)
    toast({
      title: "Reset Complete",
      description: "About page content has been reset to default values",
    })
  }

  // Achievement Management
  const handleAddAchievement = () => {
    if (!achievementForm.year || !achievementForm.title || !achievementForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newAchievement = {
      id: Date.now(),
      ...achievementForm,
    }

    setAchievements([...achievements, newAchievement].sort((a, b) => a.year.localeCompare(b.year)))
    setAchievementForm({ year: "", title: "", description: "" })
    setIsAddingAchievement(false)
    toast({
      title: "Success",
      description: "Achievement added successfully",
    })
  }

  const handleEditAchievement = (achievement: any) => {
    setAchievementForm({
      year: achievement.year,
      title: achievement.title,
      description: achievement.description,
    })
    setEditingAchievement(achievement)
  }

  const handleUpdateAchievement = () => {
    if (!achievementForm.year || !achievementForm.title || !achievementForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setAchievements(
      achievements
        .map((achievement) =>
          achievement.id === editingAchievement.id ? { ...achievement, ...achievementForm } : achievement,
        )
        .sort((a, b) => a.year.localeCompare(b.year)),
    )
    setEditingAchievement(null)
    setAchievementForm({ year: "", title: "", description: "" })
    toast({
      title: "Success",
      description: "Achievement updated successfully",
    })
  }

  const handleDeleteAchievement = (id: number) => {
    setAchievements(achievements.filter((achievement) => achievement.id !== id))
    toast({
      title: "Success",
      description: "Achievement deleted successfully",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">About Page Management</h1>
          <p className="text-muted-foreground">Manage about page content, vision, mission, and achievements</p>
        </div>

        {/* Hero Image */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Manage the hero image and main banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Background Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="heroImage"
                  value={aboutData.heroImage}
                  onChange={(e) => handleAboutDataChange("heroImage", e.target.value)}
                  placeholder="Enter hero image URL"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {aboutData.heroImage && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={aboutData.heroImage || "/placeholder.svg"}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">About Our School</h2>
                      <p className="text-lg">Excellence in Education Since {aboutData.foundedYear}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vision Statement</CardTitle>
              <CardDescription>School's vision for the future</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={aboutData.vision}
                onChange={(e) => handleAboutDataChange("vision", e.target.value)}
                placeholder="Enter school vision"
                rows={6}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>School's mission and purpose</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={aboutData.mission}
                onChange={(e) => handleAboutDataChange("mission", e.target.value)}
                placeholder="Enter school mission"
                rows={6}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* School Overview */}
        <Card>
          <CardHeader>
            <CardTitle>School Overview</CardTitle>
            <CardDescription>General information about the school</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overview">School Overview</Label>
              <Textarea
                id="overview"
                value={aboutData.overview}
                onChange={(e) => handleAboutDataChange("overview", e.target.value)}
                placeholder="Enter school overview"
                rows={6}
                className="min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  value={aboutData.foundedYear}
                  onChange={(e) => handleAboutDataChange("foundedYear", e.target.value)}
                  placeholder="Enter founded year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motto">School Motto (Optional)</Label>
                <Input
                  id="motto"
                  value={aboutData.motto}
                  onChange={(e) => handleAboutDataChange("motto", e.target.value)}
                  placeholder="Enter school motto"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Key Achievements Timeline</CardTitle>
                <CardDescription>Manage school milestones and achievements</CardDescription>
              </div>
              <Dialog open={isAddingAchievement} onOpenChange={setIsAddingAchievement}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Achievement</DialogTitle>
                    <DialogDescription>Add a milestone to the school timeline</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="achievementYear">Year</Label>
                      <Input
                        id="achievementYear"
                        value={achievementForm.year}
                        onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                        placeholder="Enter year (e.g., 2024)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievementTitle">Title</Label>
                      <Input
                        id="achievementTitle"
                        value={achievementForm.title}
                        onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                        placeholder="Enter achievement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievementDescription">Description</Label>
                      <Textarea
                        id="achievementDescription"
                        value={achievementForm.description}
                        onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                        placeholder="Enter achievement description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddAchievement} className="flex-1">
                      Add Achievement
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingAchievement(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">{achievement.year}</TableCell>
                    <TableCell>{achievement.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{achievement.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditAchievement(achievement)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Achievement</DialogTitle>
                              <DialogDescription>Update achievement information</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="editAchievementYear">Year</Label>
                                <Input
                                  id="editAchievementYear"
                                  value={achievementForm.year}
                                  onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                                  placeholder="Enter year (e.g., 2024)"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editAchievementTitle">Title</Label>
                                <Input
                                  id="editAchievementTitle"
                                  value={achievementForm.title}
                                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                                  placeholder="Enter achievement title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editAchievementDescription">Description</Label>
                                <Textarea
                                  id="editAchievementDescription"
                                  value={achievementForm.description}
                                  onChange={(e) =>
                                    setAchievementForm({ ...achievementForm, description: e.target.value })
                                  }
                                  placeholder="Enter achievement description"
                                  rows={3}
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button onClick={handleUpdateAchievement} className="flex-1">
                                Update Achievement
                              </Button>
                              <Button variant="outline" onClick={() => setEditingAchievement(null)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAchievement(achievement.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
