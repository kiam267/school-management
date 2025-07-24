"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const initialStreams = [
  { id: 1, name: "Science", description: "Science stream testimonials", active: true },
  { id: 2, name: "General", description: "General stream testimonials", active: true },
  { id: 3, name: "Commerce", description: "Commerce stream testimonials", active: true },
]

const initialTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    class: "Grade 12 - Science",
    quote: "The science program here opened my eyes to the wonders of research and discovery.",
    avatar: "/placeholder.svg?height=60&width=60",
    stream: "Science",
  },
  {
    id: 2,
    name: "Michael Chen",
    class: "Grade 11 - Science",
    quote: "Amazing lab facilities and supportive teachers made learning chemistry so engaging.",
    avatar: "/placeholder.svg?height=60&width=60",
    stream: "Science",
  },
  {
    id: 3,
    name: "Alex Thompson",
    class: "Grade 12 - General",
    quote: "The well-rounded education prepared me for university and beyond.",
    avatar: "/placeholder.svg?height=60&width=60",
    stream: "General",
  },
  {
    id: 4,
    name: "Rachel Green",
    class: "Grade 12 - Commerce",
    quote: "The business studies program gave me real-world skills and knowledge.",
    avatar: "/placeholder.svg?height=60&width=60",
    stream: "Commerce",
  },
]

export default function TestimonialManagement() {
  const [streams, setStreams] = useState(initialStreams)
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [isAddingStream, setIsAddingStream] = useState(false)
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false)
  const [editingStream, setEditingStream] = useState<any>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [streamForm, setStreamForm] = useState({ name: "", description: "" })
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    class: "",
    quote: "",
    avatar: "",
    stream: "",
  })
  const { toast } = useToast()

  // Stream Management
  const handleAddStream = () => {
    if (!streamForm.name) {
      toast({
        title: "Error",
        description: "Please enter stream name",
        variant: "destructive",
      })
      return
    }

    const newStream = {
      id: Date.now(),
      ...streamForm,
      active: true,
    }

    setStreams([...streams, newStream])
    setStreamForm({ name: "", description: "" })
    setIsAddingStream(false)
    toast({
      title: "Success",
      description: "Stream added successfully",
    })
  }

  const handleUpdateStream = () => {
    if (!streamForm.name) {
      toast({
        title: "Error",
        description: "Please enter stream name",
        variant: "destructive",
      })
      return
    }

    setStreams(streams.map((stream) => (stream.id === editingStream.id ? { ...stream, ...streamForm } : stream)))
    setEditingStream(null)
    setStreamForm({ name: "", description: "" })
    toast({
      title: "Success",
      description: "Stream updated successfully",
    })
  }

  const handleDeleteStream = (id: number) => {
    setStreams(streams.filter((stream) => stream.id !== id))
    // Also remove testimonials for this stream
    const streamName = streams.find((s) => s.id === id)?.name
    if (streamName) {
      setTestimonials(testimonials.filter((t) => t.stream !== streamName))
    }
    toast({
      title: "Success",
      description: "Stream deleted successfully",
    })
  }

  // Testimonial Management
  const handleAddTestimonial = () => {
    if (!testimonialForm.name || !testimonialForm.class || !testimonialForm.quote || !testimonialForm.stream) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newTestimonial = {
      id: Date.now(),
      ...testimonialForm,
      avatar: testimonialForm.avatar || "/placeholder.svg?height=60&width=60",
    }

    setTestimonials([...testimonials, newTestimonial])
    setTestimonialForm({ name: "", class: "", quote: "", avatar: "", stream: "" })
    setIsAddingTestimonial(false)
    toast({
      title: "Success",
      description: "Testimonial added successfully",
    })
  }

  const handleEditTestimonial = (testimonial: any) => {
    setTestimonialForm({
      name: testimonial.name,
      class: testimonial.class,
      quote: testimonial.quote,
      avatar: testimonial.avatar,
      stream: testimonial.stream,
    })
    setEditingTestimonial(testimonial)
  }

  const handleUpdateTestimonial = () => {
    if (!testimonialForm.name || !testimonialForm.class || !testimonialForm.quote || !testimonialForm.stream) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setTestimonials(
      testimonials.map((testimonial) =>
        testimonial.id === editingTestimonial.id ? { ...testimonial, ...testimonialForm } : testimonial,
      ),
    )
    setEditingTestimonial(null)
    setTestimonialForm({ name: "", class: "", quote: "", avatar: "", stream: "" })
    toast({
      title: "Success",
      description: "Testimonial updated successfully",
    })
  }

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id))
    toast({
      title: "Success",
      description: "Testimonial deleted successfully",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonial Management</h1>
          <p className="text-muted-foreground">Manage testimonial streams and student testimonials</p>
        </div>

        <Tabs defaultValue="streams" className="space-y-6">
          <TabsList>
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Streams Tab */}
          <TabsContent value="streams">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Testimonial Streams</CardTitle>
                    <CardDescription>Manage testimonial categories (Science, Commerce, General)</CardDescription>
                  </div>
                  <Dialog open={isAddingStream} onOpenChange={setIsAddingStream}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stream
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Stream</DialogTitle>
                        <DialogDescription>Create a new testimonial stream</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="streamName">Stream Name *</Label>
                          <Input
                            id="streamName"
                            value={streamForm.name}
                            onChange={(e) => setStreamForm({ ...streamForm, name: e.target.value })}
                            placeholder="Enter stream name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="streamDescription">Description</Label>
                          <Textarea
                            id="streamDescription"
                            value={streamForm.description}
                            onChange={(e) => setStreamForm({ ...streamForm, description: e.target.value })}
                            placeholder="Enter stream description"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleAddStream} className="flex-1">
                          Add Stream
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingStream(false)} className="flex-1">
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
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Testimonials</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {streams.map((stream) => (
                      <TableRow key={stream.id}>
                        <TableCell className="font-medium">{stream.name}</TableCell>
                        <TableCell>{stream.description}</TableCell>
                        <TableCell>
                          <Badge variant={stream.active ? "default" : "secondary"}>
                            {stream.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{testimonials.filter((t) => t.stream === stream.name).length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setStreamForm({ name: stream.name, description: stream.description })
                                    setEditingStream(stream)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Stream</DialogTitle>
                                  <DialogDescription>Update stream information</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editStreamName">Stream Name *</Label>
                                    <Input
                                      id="editStreamName"
                                      value={streamForm.name}
                                      onChange={(e) => setStreamForm({ ...streamForm, name: e.target.value })}
                                      placeholder="Enter stream name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editStreamDescription">Description</Label>
                                    <Textarea
                                      id="editStreamDescription"
                                      value={streamForm.description}
                                      onChange={(e) => setStreamForm({ ...streamForm, description: e.target.value })}
                                      placeholder="Enter stream description"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2 pt-4">
                                  <Button onClick={handleUpdateStream} className="flex-1">
                                    Update Stream
                                  </Button>
                                  <Button variant="outline" onClick={() => setEditingStream(null)} className="flex-1">
                                    Cancel
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStream(stream.id)}
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
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Testimonials</CardTitle>
                    <CardDescription>Manage student testimonials for each stream</CardDescription>
                  </div>
                  <Dialog open={isAddingTestimonial} onOpenChange={setIsAddingTestimonial}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Testimonial
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Testimonial</DialogTitle>
                        <DialogDescription>Add a student testimonial</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Name *</Label>
                          <Input
                            id="studentName"
                            value={testimonialForm.name}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                            placeholder="Enter student name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentClass">Class *</Label>
                          <Input
                            id="studentClass"
                            value={testimonialForm.class}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, class: e.target.value })}
                            placeholder="e.g., Grade 12 - Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="testimonialStream">Stream *</Label>
                          <Select
                            value={testimonialForm.stream}
                            onValueChange={(value) => setTestimonialForm({ ...testimonialForm, stream: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select stream" />
                            </SelectTrigger>
                            <SelectContent>
                              {streams.map((stream) => (
                                <SelectItem key={stream.id} value={stream.name}>
                                  {stream.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="avatar"
                              value={testimonialForm.avatar}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                              placeholder="Enter avatar URL"
                            />
                            <Button variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="quote">Quote *</Label>
                          <Textarea
                            id="quote"
                            value={testimonialForm.quote}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                            placeholder="Enter testimonial quote"
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleAddTestimonial} className="flex-1">
                          Add Testimonial
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingTestimonial(false)} className="flex-1">
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
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                              <AvatarFallback>
                                {testimonial.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{testimonial.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{testimonial.class}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{testimonial.stream}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">"{testimonial.quote}"</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => handleEditTestimonial(testimonial)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Testimonial</DialogTitle>
                                  <DialogDescription>Update testimonial information</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editStudentName">Student Name *</Label>
                                    <Input
                                      id="editStudentName"
                                      value={testimonialForm.name}
                                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                                      placeholder="Enter student name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editStudentClass">Class *</Label>
                                    <Input
                                      id="editStudentClass"
                                      value={testimonialForm.class}
                                      onChange={(e) =>
                                        setTestimonialForm({ ...testimonialForm, class: e.target.value })
                                      }
                                      placeholder="e.g., Grade 12 - Science"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editTestimonialStream">Stream *</Label>
                                    <Select
                                      value={testimonialForm.stream}
                                      onValueChange={(value) =>
                                        setTestimonialForm({ ...testimonialForm, stream: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select stream" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {streams.map((stream) => (
                                          <SelectItem key={stream.id} value={stream.name}>
                                            {stream.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editAvatar">Avatar URL</Label>
                                    <div className="flex space-x-2">
                                      <Input
                                        id="editAvatar"
                                        value={testimonialForm.avatar}
                                        onChange={(e) =>
                                          setTestimonialForm({ ...testimonialForm, avatar: e.target.value })
                                        }
                                        placeholder="Enter avatar URL"
                                      />
                                      <Button variant="outline" size="icon">
                                        <Upload className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="editQuote">Quote *</Label>
                                    <Textarea
                                      id="editQuote"
                                      value={testimonialForm.quote}
                                      onChange={(e) =>
                                        setTestimonialForm({ ...testimonialForm, quote: e.target.value })
                                      }
                                      placeholder="Enter testimonial quote"
                                      rows={4}
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2 pt-4">
                                  <Button onClick={handleUpdateTestimonial} className="flex-1">
                                    Update Testimonial
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingTestimonial(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
