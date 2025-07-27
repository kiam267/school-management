'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Calendar,
  User,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { useNews } from '@/hooks/use-news';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const categories = [
  'Events',
  'Infrastructure',
  'Achievements',
  'Sports',
  'Academic',
];

export default function NewsManagement() {
  const { news, loading, addNews, updateNews, deleteNews } =
    useNews();
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [viewingNews, setViewingNews] = useState<any>(null);
  const [editingDialogOpen, setEditingDialogOpen] =
    useState(false);
  const [publishingStates, setPublishingStates] = useState<
    Record<number, boolean>
  >({});
  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    date: '',
    category: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Dropzone logic for image upload
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0)
        return;
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);
      try {
        const res = await fetch('/api/hero/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setNewsForm(prev => ({
            ...prev,
            image: data.url,
          }));
          toast({
            title: 'Success',
            description: 'Image uploaded',
          });
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description:
            error.message || 'Failed to upload image',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, open } = useDropzone(
    {
      onDrop,
      accept: { 'image/*': [] },
      multiple: false,
      noClick: true,
      noKeyboard: true,
    }
  );

  const handleAddNews = async () => {
    console.log('Adding news with form data:', newsForm);
    if (
      !newsForm.title ||
      !newsForm.content ||
      !newsForm.author ||
      !newsForm.date ||
      !newsForm.category
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const newNews = {
      ...newsForm,
      excerpt:
        newsForm.excerpt ||
        newsForm.content.substring(0, 150) + '...',
      image:
        newsForm.image ||
        '/placeholder.svg?height=200&width=300',
      published: true,
    };

    const success = await addNews(newNews);
    setSaving(false);
    if (success) {
      setNewsForm({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        date: '',
        category: '',
      });
      setIsAddingNews(false);
    }
  };

  const handleEditNews = (article: any) => {
    setNewsForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      author: article.author,
      date: article.date,
      category: article.category,
    });
    setEditingNews(article);
    setEditingDialogOpen(true);
  };

  const handleUpdateNews = async () => {
    if (
      !newsForm.title ||
      !newsForm.content ||
      !newsForm.author ||
      !newsForm.date ||
      !newsForm.category
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const updated = {
      ...editingNews,
      ...newsForm,
      excerpt:
        newsForm.excerpt ||
        newsForm.content.substring(0, 150) + '...',
    };

    const success = await updateNews(updated);
    setSaving(false);
    if (success) {
      setEditingNews(null);
      setEditingDialogOpen(false);
      setNewsForm({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        date: '',
        category: '',
      });
    }
  };

  const handleDeleteNews = async (id: number) => {
    await deleteNews(id);
  };

  const togglePublished = async (id: number) => {
    const article = news.find(n => n.id === id);
    if (article) {
      // Set loading state for this specific article
      setPublishingStates(prev => ({
        ...prev,
        [id]: true,
      }));

      try {
        const success = await updateNews({
          ...article,
          published: !article.published,
        });

        if (success) {
          toast({
            title: 'Success',
            description: `Article ${
              !article.published
                ? 'published'
                : 'moved to draft'
            }`,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update article status',
          variant: 'destructive',
        });
      } finally {
        // Remove loading state for this article
        setPublishingStates(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }
    }
  };

  const PublishButton = ({ article }: { article: any }) => {
    const isLoading = publishingStates[article.id];
    const isPublished = article.published;

    return (
      <Button
        variant={isPublished ? 'default' : 'secondary'}
        size="sm"
        onClick={() => togglePublished(article.id)}
        disabled={isLoading}
        className={`
          min-w-[100px] transition-all duration-200 ease-in-out
          ${isLoading ? 'animate-pulse' : ''}
         
        `}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {isPublished
                ? 'Unpublishing...'
                : 'Publishing...'}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {isPublished ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Published</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>Draft</span>
              </>
            )}
          </div>
        )}
      </Button>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            News Management
          </h1>
          <p className="text-muted-foreground">
            Manage school news articles and announcements
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>News Articles</CardTitle>
                <CardDescription>
                  Create, edit, and manage news articles
                </CardDescription>
              </div>
              <Dialog
                open={isAddingNews}
                onOpenChange={setIsAddingNews}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Add New News Article
                    </DialogTitle>
                    <DialogDescription>
                      Create a new news article or
                      announcement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newsForm.title}
                        onChange={e =>
                          setNewsForm({
                            ...newsForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter news title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">
                        Author *
                      </Label>
                      <Input
                        id="author"
                        value={newsForm.author}
                        onChange={e =>
                          setNewsForm({
                            ...newsForm,
                            author: e.target.value,
                          })
                        }
                        placeholder="Enter author name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newsForm.date}
                        onChange={e =>
                          setNewsForm({
                            ...newsForm,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category *
                      </Label>
                      <Select
                        value={newsForm.category}
                        onValueChange={value =>
                          setNewsForm({
                            ...newsForm,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem
                              key={category}
                              value={category}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div
                      {...getRootProps()}
                      className="space-y-2"
                    >
                      <Label htmlFor="image">Image</Label>
                      <input {...getInputProps()} />
                      <div className="flex space-x-2 items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={open}
                          disabled={uploading || saving}
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                        {newsForm.image && (
                          <div className="relative h-12 w-16 rounded overflow-hidden">
                            <Image
                              src={
                                newsForm.image ||
                                '/placeholder.svg'
                              }
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {uploading && (
                          <span className="text-xs text-muted-foreground animate-pulse">
                            Uploading...
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="excerpt">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={newsForm.excerpt}
                        onChange={e =>
                          setNewsForm({
                            ...newsForm,
                            excerpt: e.target.value,
                          })
                        }
                        placeholder="Brief description (optional - will be auto-generated from content)"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="content">
                        Content *
                      </Label>
                      <Textarea
                        id="content"
                        value={newsForm.content}
                        onChange={e =>
                          setNewsForm({
                            ...newsForm,
                            content: e.target.value,
                          })
                        }
                        placeholder="Enter full article content"
                        rows={8}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleAddNews}
                      className="flex-1"
                      disabled={uploading || saving}
                    >
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Add Article'
                      )}
                    </Button>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsAddingNews(false)
                        }
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
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
                {news.map(article => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image
                          src={
                            article.image ||
                            '/placeholder.svg'
                          }
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">
                        {article.title}
                      </div>
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
                        <span>
                          {new Date(
                            article.date || ''
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PublishButton article={article} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setViewingNews(article)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Preview Article
                              </DialogTitle>
                            </DialogHeader>
                            {viewingNews && (
                              <div className="space-y-4">
                                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                                  <Image
                                    src={
                                      viewingNews.image ||
                                      '/placeholder.svg'
                                    }
                                    alt={viewingNews.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <Badge>
                                    {viewingNews.category}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>
                                      {viewingNews.author}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {new Date(
                                        viewingNews.date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <h1 className="text-2xl font-bold">
                                  {viewingNews.title}
                                </h1>
                                <p className="text-muted-foreground italic">
                                  {viewingNews.excerpt}
                                </p>
                                <div className="prose max-w-none">
                                  <p className="whitespace-pre-wrap">
                                    {viewingNews.content}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={editingDialogOpen}
                          onOpenChange={open => {
                            if (!open)
                              setEditingDialogOpen(false);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditNews(article)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Edit News Article
                              </DialogTitle>
                              <DialogDescription>
                                Update article information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editTitle">
                                  Title *
                                </Label>
                                <Input
                                  id="editTitle"
                                  value={newsForm.title}
                                  onChange={e =>
                                    setNewsForm({
                                      ...newsForm,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Enter news title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editAuthor">
                                  Author *
                                </Label>
                                <Input
                                  id="editAuthor"
                                  value={newsForm.author}
                                  onChange={e =>
                                    setNewsForm({
                                      ...newsForm,
                                      author:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Enter author name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editDate">
                                  Date *
                                </Label>
                                <Input
                                  id="editDate"
                                  type="date"
                                  value={newsForm.date}
                                  onChange={e =>
                                    setNewsForm({
                                      ...newsForm,
                                      date: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editCategory">
                                  Category *
                                </Label>
                                <Select
                                  value={newsForm.category}
                                  onValueChange={value =>
                                    setNewsForm({
                                      ...newsForm,
                                      category: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map(
                                      category => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div
                                {...getRootProps()}
                                className="space-y-2"
                              >
                                <Label htmlFor="editImage">
                                  Image
                                </Label>
                                <input
                                  {...getInputProps()}
                                />
                                <div className="flex space-x-2 items-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={open}
                                    disabled={
                                      uploading || saving
                                    }
                                  >
                                    {uploading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4" />
                                    )}
                                  </Button>
                                  {newsForm.image && (
                                    <div className="relative h-12 w-16 rounded overflow-hidden">
                                      <Image
                                        src={
                                          newsForm.image ||
                                          '/placeholder.svg'
                                        }
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  {uploading && (
                                    <span className="text-xs text-muted-foreground animate-pulse">
                                      Uploading...
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editExcerpt">
                                  Excerpt
                                </Label>
                                <Textarea
                                  id="editExcerpt"
                                  value={newsForm.excerpt}
                                  onChange={e =>
                                    setNewsForm({
                                      ...newsForm,
                                      excerpt:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Brief description (optional - will be auto-generated from content)"
                                  rows={3}
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editContent">
                                  Content *
                                </Label>
                                <Textarea
                                  id="editContent"
                                  value={newsForm.content}
                                  onChange={e =>
                                    setNewsForm({
                                      ...newsForm,
                                      content:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Enter full article content"
                                  rows={8}
                                  className="min-h-[200px]"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={handleUpdateNews}
                                className="flex-1"
                                disabled={
                                  uploading || saving
                                }
                              >
                                {saving ? (
                                  <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                  </div>
                                ) : (
                                  'Update Article'
                                )}
                              </Button>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingNews(null);
                                    setEditingDialogOpen(
                                      false
                                    );
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteNews(article.id)
                          }
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
  );
}
