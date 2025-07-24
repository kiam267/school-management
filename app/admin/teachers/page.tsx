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

const teacherTags = [
  { id: 1, name: "Head Teacher", color: "bg-red-500" },
  { id: 2, name: "Staff Teacher", color: "bg-blue-500" },
  { id: 3, name: "Kirani", color: "bg-green-500" },
  { id: 4, name: "Assistant Teacher", color: "bg-yellow-500" },
]

const initialTeachers = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    age: 45,
    education: "PhD in Mathematics",
    subject: "Mathematics & Physics",
    experience: 15,
    tag: "Head Teacher",
    description: "Experienced educator with a passion for mathematics and physics.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Prof. Michael Johnson",
    age: 42,
    education: "MSc in Chemistry",
    subject: "Chemistry & Biology",
    experience: 12,
    tag: "Staff Teacher",
    description: "Dedicated chemistry teacher with extensive research background.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [tags, setTags] = useState(teacherTags)
  const [isAddingTeacher, setIsAddingTeacher] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<any>(null)
  const [newTag, setNewTag] = useState("")
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    age: "",
    education: "",
    subject: "",
    experience: "",
    tag: "",
    description: "",
    image: "",
  })
  const { toast } = useToast()

  const handleAddTeacher = () => {
    if (!teacherForm.name || !teacherForm.description || !teacherForm.tag) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newTeacher = {
      id: Date.now(),
      ...teacherForm,
      age: Number.parseInt(teacherForm.age) || undefined,
      experience: Number.parseInt(teacherForm.experience) || undefined,
      image: teacherForm.image || "/placeholder.svg?height=100&width=100",
    }

    setTeachers([...teachers, newTeacher])
    setTeacherForm({
      name: "",
      age: "",
      education: "",
      subject: "",
      experience: "",
      tag: "",
      description: "",
      image: "",
    })
    setIsAddingTeacher(false)
    toast({
      title: "Success",
      description: "Teacher added successfully",
    })
  }

  const handleEditTeacher = (teacher: any) => {
    setTeacherForm({
      name: teacher.name,
      age: teacher.age?.toString() || "",
      education: teacher.education || "",
      subject: teacher.subject || "",
      experience: teacher.experience?.toString() || "",
      tag: teacher.tag,
      description: teacher.description,
      image: teacher.image,
    })
    setEditingTeacher(teacher)
  }

  const handleUpdateTeacher = () => {
    if (!teacherForm.name || !teacherForm.description || !teacherForm.tag) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setTeachers(
      teachers.map((teacher) =>
        teacher.id === editingTeacher.id
          ? {
              ...teacher,
              ...teacherForm,
              age: Number.parseInt(teacherForm.age) || undefined,
              experience: Number.parseInt(teacherForm.experience) || undefined,
            }
          : teacher,
      ),
    )
    setEditingTeacher(null)
    setTeacherForm({
      name: "",
      age: "",
      education: "",
      subject: "",
      experience: "",
      tag: "",
      description: "",
      image: "",
    })
    toast({
      title: "Success",
      description: "Teacher updated successfully",
    })
  }

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id))
    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    })
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return

    const tag = {
      id: Date.now(),
      name: newTag,
      color: `bg-${["red", "blue", "green", "yellow", "purple", "pink"][Math.floor(Math.random() * 6)]}-500`,
    }

    setTags([...tags, tag])
    setNewTag("")
    setIsAddingTag(false)
    toast({
      title: "Success",
      description: "Tag added successfully",
    })
  }

  const handleDeleteTag = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id))
    toast({
      title: "Success",
      description: "Tag deleted successfully",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage teachers and their tags</p>
        </div>

        {/* Teacher Tags Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teacher Tags</CardTitle>
                <CardDescription>Manage teacher categories and tags</CardDescription>
              </div>
              <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogDescription>Create a new teacher tag</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagName">Tag Name</Label>
                      <Input
                        id="tagName"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter tag name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddTag} className="flex-1">
                        Add Tag
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingTag(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Badge className={`${tag.color} text-white`}>{tag.name}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teachers Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Manage teacher profiles and information</CardDescription>
              </div>
              <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>Fill in the teacher information</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                        placeholder="Teacher name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={teacherForm.age}
                        onChange={(e) => setTeacherForm({ ...teacherForm, age: e.target.value })}
                        placeholder="Age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level</Label>
                      <Input
                        id="education"
                        value={teacherForm.education}
                        onChange={(e) => setTeacherForm({ ...teacherForm, education: e.target.value })}
                        placeholder="Education qualification"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Expertise</Label>
                      <Input
                        id="subject"
                        value={teacherForm.subject}
                        onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                        placeholder="Subject areas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={teacherForm.experience}
                        onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                        placeholder="Years"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag">Tag *</Label>
                      <Select
                        value={teacherForm.tag}
                        onValueChange={(value) => setTeacherForm({ ...teacherForm, tag: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.name}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={teacherForm.description}
                        onChange={(e) => setTeacherForm({ ...teacherForm, description: e.target.value })}
                        placeholder="Teacher description"
                        className="max-h-24"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="image">Profile Image URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image"
                          value={teacherForm.image}
                          onChange={(e) => setTeacherForm({ ...teacherForm, image: e.target.value })}
                          placeholder="Image URL"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddTeacher} className="flex-1">
                      Add Teacher
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingTeacher(false)} className="flex-1">
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
                  <TableHead>Tag</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.tag}</Badge>
                    </TableCell>
                    <TableCell>{teacher.subject || "N/A"}</TableCell>
                    <TableCell>{teacher.experience ? `${teacher.experience} years` : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditTeacher(teacher)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Teacher</DialogTitle>
                              <DialogDescription>Update teacher information</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="editName">Name *</Label>
                                <Input
                                  id="editName"
                                  value={teacherForm.name}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                                  placeholder="Teacher name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editAge">Age</Label>
                                <Input
                                  id="editAge"
                                  type="number"
                                  value={teacherForm.age}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, age: e.target.value })}
                                  placeholder="Age"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editEducation">Education Level</Label>
                                <Input
                                  id="editEducation"
                                  value={teacherForm.education}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, education: e.target.value })}
                                  placeholder="Education qualification"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editSubject">Subject Expertise</Label>
                                <Input
                                  id="editSubject"
                                  value={teacherForm.subject}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                                  placeholder="Subject areas"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editExperience">Years of Experience</Label>
                                <Input
                                  id="editExperience"
                                  type="number"
                                  value={teacherForm.experience}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                                  placeholder="Years"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editTag">Tag *</Label>
                                <Select
                                  value={teacherForm.tag}
                                  onValueChange={(value) => setTeacherForm({ ...teacherForm, tag: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tag" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tags.map((tag) => (
                                      <SelectItem key={tag.id} value={tag.name}>
                                        {tag.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editDescription">Description *</Label>
                                <Textarea
                                  id="editDescription"
                                  value={teacherForm.description}
                                  onChange={(e) => setTeacherForm({ ...teacherForm, description: e.target.value })}
                                  placeholder="Teacher description"
                                  className="max-h-24"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editImage">Profile Image URL</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="editImage"
                                    value={teacherForm.image}
                                    onChange={(e) => setTeacherForm({ ...teacherForm, image: e.target.value })}
                                    placeholder="Image URL"
                                  />
                                  <Button variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button onClick={handleUpdateTeacher} className="flex-1">
                                Update Teacher
                              </Button>
                              <Button variant="outline" onClick={() => setEditingTeacher(null)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
