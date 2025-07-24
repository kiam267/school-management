"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react"
import Image from "next/image"

const initialSlides = [
  {
    id: 1,
    title: "Excellence in Education",
    subtitle: "Empowering minds, shaping futures since 1985",
    image: "/placeholder.svg?height=400&width=800",
    order: 1,
    active: true,
  },
  {
    id: 2,
    title: "Innovative Learning",
    subtitle: "Modern teaching methods for tomorrow's leaders",
    image: "/placeholder.svg?height=400&width=800",
    order: 2,
    active: true,
  },
  {
    id: 3,
    title: "Knowledge & Growth",
    subtitle: "Building strong foundations for lifelong success",
    image: "/placeholder.svg?height=400&width=800",
    order: 3,
    active: true,
  },
]

export default function HeroManagement() {
  const [slides, setSlides] = useState(initialSlides)
  const [isAddingSlide, setIsAddingSlide] = useState(false)
  const [editingSlide, setEditingSlide] = useState<any>(null)
  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    image: "",
  })
  const { toast } = useToast()

  const handleAddSlide = () => {
    if (!slideForm.title || !slideForm.subtitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newSlide = {
      id: Date.now(),
      ...slideForm,
      image: slideForm.image || "/placeholder.svg?height=400&width=800",
      order: slides.length + 1,
      active: true,
    }

    setSlides([...slides, newSlide])
    setSlideForm({ title: "", subtitle: "", image: "" })
    setIsAddingSlide(false)
    toast({
      title: "Success",
      description: "Hero slide added successfully",
    })
  }

  const handleEditSlide = (slide: any) => {
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
    })
    setEditingSlide(slide)
  }

  const handleUpdateSlide = () => {
    if (!slideForm.title || !slideForm.subtitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSlides(
      slides.map((slide) =>
        slide.id === editingSlide.id
          ? {
              ...slide,
              ...slideForm,
            }
          : slide,
      ),
    )
    setEditingSlide(null)
    setSlideForm({ title: "", subtitle: "", image: "" })
    toast({
      title: "Success",
      description: "Hero slide updated successfully",
    })
  }

  const handleDeleteSlide = (id: number) => {
    setSlides(slides.filter((slide) => slide.id !== id))
    toast({
      title: "Success",
      description: "Hero slide deleted successfully",
    })
  }

  const toggleSlideActive = (id: number) => {
    setSlides(slides.map((slide) => (slide.id === id ? { ...slide, active: !slide.active } : slide)))
    toast({
      title: "Success",
      description: "Slide status updated",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Hero Section Management</h1>
          <p className="text-muted-foreground">Manage homepage hero slider content</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hero Slides</CardTitle>
                <CardDescription>Manage hero section slides and content</CardDescription>
              </div>
              <Dialog open={isAddingSlide} onOpenChange={setIsAddingSlide}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slide
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Hero Slide</DialogTitle>
                    <DialogDescription>Create a new slide for the hero section</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={slideForm.title}
                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                        placeholder="Enter slide title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle *</Label>
                      <Textarea
                        id="subtitle"
                        value={slideForm.subtitle}
                        onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                        placeholder="Enter slide subtitle"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Background Image URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image"
                          value={slideForm.image}
                          onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                          placeholder="Enter image URL"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {slideForm.image && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="relative h-32 w-full rounded-lg overflow-hidden">
                          <Image
                            src={slideForm.image || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddSlide} className="flex-1">
                      Add Slide
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingSlide(false)} className="flex-1">
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
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="relative h-16 w-24 rounded overflow-hidden">
                        <Image
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{slide.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{slide.subtitle}</TableCell>
                    <TableCell>
                      <Button
                        variant={slide.active ? "default" : "secondary"}
                        size="sm"
                        onClick={() => toggleSlideActive(slide.id)}
                      >
                        {slide.active ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Preview Slide</DialogTitle>
                            </DialogHeader>
                            <div className="relative h-64 w-full rounded-lg overflow-hidden">
                              <Image
                                src={slide.image || "/placeholder.svg"}
                                alt={slide.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center">
                                <div>
                                  <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                                  <p className="text-lg">{slide.subtitle}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditSlide(slide)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Hero Slide</DialogTitle>
                              <DialogDescription>Update slide content</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="editTitle">Title *</Label>
                                <Input
                                  id="editTitle"
                                  value={slideForm.title}
                                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                  placeholder="Enter slide title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editSubtitle">Subtitle *</Label>
                                <Textarea
                                  id="editSubtitle"
                                  value={slideForm.subtitle}
                                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                  placeholder="Enter slide subtitle"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editImage">Background Image URL</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="editImage"
                                    value={slideForm.image}
                                    onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                                    placeholder="Enter image URL"
                                  />
                                  <Button variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {slideForm.image && (
                                <div className="space-y-2">
                                  <Label>Preview</Label>
                                  <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                    <Image
                                      src={slideForm.image || "/placeholder.svg"}
                                      alt="Preview"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button onClick={handleUpdateSlide} className="flex-1">
                                Update Slide
                              </Button>
                              <Button variant="outline" onClick={() => setEditingSlide(null)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSlide(slide.id)}
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
      </div>
    </AdminLayout>
  )
}
