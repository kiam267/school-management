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
import { Plus, Edit, Trash2, Upload, Calendar, User, Eye } from "lucide-react"
import Image from "next/image"

const categories = ["Events", "Infrastructure", "Achievements", "Sports", "Academic"]

const initialNews = [
  {
    id: 1,
    title: "Annual Science Fair 2024 - Outstanding Student Innovations",
    excerpt: "Our students showcased remarkable scientific projects and innovations at this year's science fair...",
    content:
      "The Annual Science Fair 2024 was a tremendous success, featuring over 50 innovative projects from students across all grades. The event highlighted the creativity and scientific thinking of our students, with projects ranging from renewable energy solutions to advanced robotics. Winners were awarded scholarships and recognition for their outstanding contributions to science and technology.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Dr. Emily Carter",
    date: "2024-01-15",
    category: "Events",
    published: true,
  },
  {
    id: 2,
    title: "New Computer Lab Inauguration with Latest Technology",
    excerpt:
      "State-of-the-art computer laboratory equipped with the latest hardware and software for enhanced learning...",
    content:
      "We are excited to announce the inauguration of our new computer laboratory, featuring 30 high-performance computers with the latest software for programming, design, and digital learning. This facility will enhance our students' technological skills and prepare them for the digital future.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Prof. Michael Johnson",
    date: "2024-01-10",
    category: "Infrastructure",
    published: true,
  },
]

export default function NewsManagement() {
  const [news, setNews] = useState(initialNews)
  const [isAddingNews, setIsAddingNews] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [viewingNews, setViewingNews] = useState<any>(null)
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    date: "",
    category: "",
  })
  const { toast } = useToast()

  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.content || !newsForm.author || !newsForm.date || !newsForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newNews = {
      id: Date.now(),
      ...newsForm,
      excerpt: newsForm.excerpt || newsForm.content.substring(0, 150) + "...",
      image: newsForm.image || "/placeholder.svg?height=200&width=300",
      published: true,
    }

    setNews([newNews, ...news])
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: "",
      date: "",
      category: "",
    })
    setIsAddingNews(false)
    toast({
      title: "Success",
      description: "News article added successfully",
    })
  }

  const handleEditNews = (article: any) => {
    setNewsForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      author: article.author,
      date: article.date,
      category: article.category,
    })
    setEditingNews(article)
  }

  const handleUpdateNews = () => {
    if (!newsForm.title || !newsForm.content || !newsForm.author || !newsForm.date || !newsForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setNews(
      news.map((article) =>
        article.id === editingNews.id
          ? {
              ...article,
              ...newsForm,
              excerpt: newsForm.excerpt || newsForm.content.substring(0, 150) + "...",
            }
          : article,
      ),
    )
    setEditingNews(null)
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: "",
      date: "",
      category: "",
    })
    toast({
      title: "Success",
      description: "News article updated successfully",
    })
  }

  const handleDeleteNews = (id: number) => {
    setNews(news.filter((article) => article.id !== id))
    toast({
      title: "Success",
      description: "News article deleted successfully",
    })
  }

  const togglePublished = (id: number) => {
    setNews(news.map((article) => (article.id === id ? { ...article, published: !article.published } : article)))
    toast({
      title: "Success",
      description: "Article status updated",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Manage school news articles and announcements</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>News Articles</CardTitle>
                <CardDescription>Create, edit, and manage news articles</CardDescription>
              </div>
              <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New News Article</DialogTitle>
                    <DialogDescription>Create a new news article or announcement</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        placeholder="Enter news title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        placeholder="Enter author name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newsForm.category}
                        onValueChange={(value) => setNewsForm({ ...newsForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image"
                          value={newsForm.image}
                          onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                          placeholder="Enter image URL"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                        placeholder="Brief description (optional - will be auto-generated from content)"
                        rows={3}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        placeholder="Enter full article content"
                        rows={8}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddNews} className="flex-1">
                      Add Article
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingNews(false)} className="flex-1">
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
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{article.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{article.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={article.published ? "default" : "secondary"}
                        size="sm"
                        onClick={() => togglePublished(article.id)}
                      >
                        {article.published ? "Published" : "Draft"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setViewingNews(article)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Preview Article</DialogTitle>
                            </DialogHeader>
                            {viewingNews && (
                              <div className="space-y-4">
                                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                                  <Image
                                    src={viewingNews.image || "/placeholder.svg"}
                                    alt={viewingNews.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <Badge>{viewingNews.category}</Badge>
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{viewingNews.author}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(viewingNews.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <h1 className="text-2xl font-bold">{viewingNews.title}</h1>
                                <p className="text-muted-foreground italic">{viewingNews.excerpt}</p>
                                <div className="prose max-w-none">
                                  <p className="whitespace-pre-wrap">{viewingNews.content}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditNews(article)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit News Article</DialogTitle>
                              <DialogDescription>Update article information</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editTitle">Title *</Label>
                                <Input
                                  id="editTitle"
                                  value={newsForm.title}
                                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                                  placeholder="Enter news title"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editAuthor">Author *</Label>
                                <Input
                                  id="editAuthor"
                                  value={newsForm.author}
                                  onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                                  placeholder="Enter author name"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editDate">Date *</Label>
                                <Input
                                  id="editDate"
                                  type="date"
                                  value={newsForm.date}
                                  onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editCategory">Category *</Label>
                                <Select
                                  value={newsForm.category}
                                  onValueChange={(value) => setNewsForm({ ...newsForm, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editImage">Image URL</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="editImage"
                                    value={newsForm.image}
                                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                                    placeholder="Enter image URL"
                                  />
                                  <Button variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editExcerpt">Excerpt</Label>
                                <Textarea
                                  id="editExcerpt"
                                  value={newsForm.excerpt}
                                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                                  placeholder="Brief description (optional - will be auto-generated from content)"
                                  rows={3}
                                />
                              </div>

                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editContent">Content *</Label>
                                <Textarea
                                  id="editContent"
                                  value={newsForm.content}
                                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                  placeholder="Enter full article content"
                                  rows={8}
                                  className="min-h-[200px]"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button onClick={handleUpdateNews} className="flex-1">
                                Update Article
                              </Button>
                              <Button variant="outline" onClick={() => setEditingNews(null)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNews(article.id)}
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
