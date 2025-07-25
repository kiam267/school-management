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
import { useDropzone } from 'react-dropzone';
function DropzoneInput({
  value,
  onChange,
  setImageLoading,
}: {
  value: string;
  onChange: (url: string) => void;
  setImageLoading: (loading: boolean) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: { 'image/*': [] },
      multiple: false,
      onDrop: async acceptedFiles => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        setImageLoading(true);
        // Upload to backend (Vercel Blob)
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/hero/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) onChange(data.url);
        setImageLoading(false);
      },
    });
  return (
    <div
      {...getRootProps()}
      className={`border rounded-lg p-2 flex items-center justify-center cursor-pointer bg-muted/50 relative h-32 w-full ${
        isDragActive ? 'border-primary' : 'border-muted'
      }`}
    >
      <input {...getInputProps()} />
      {value ? (
        <Image
          src={value}
          alt="Preview"
          fill
          className="object-cover rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-muted-foreground">
            Drag & drop or click to upload image
          </span>
        </div>
      )}
    </div>
  );
}
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
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
  Eye,
} from 'lucide-react';
import Image from 'next/image';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export type Slide = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
};

export default function HeroManagement() {
  const [slides, setSlides] = useState<Slide[]>([]);
  // Fetch slides from backend on mount
  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSlides(data);
      });
  }, []);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlide, setEditingSlide] =
    useState<any>(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    image: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<
    number | null
  >(null);
  const [addImageLoading, setAddImageLoading] =
    useState(false);
  const [editImageLoading, setEditImageLoading] =
    useState(false);
  const { toast } = useToast();

  const handleAddSlide = async () => {
    if (!slideForm.title || !slideForm.subtitle) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    const newSlide = {
      ...slideForm,
      image:
        slideForm.image ||
        '/placeholder.svg?height=400&width=800',
      order: slides.length + 1,
      active: true,
    };
    setAddLoading(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlide),
      });
      const saved = await res.json();
      setSlides([...slides, saved]);
      setSlideForm({ title: '', subtitle: '', image: '' });
      setIsAddingSlide(false);
      toast({
        title: 'Success',
        description: 'Hero slide added successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add slide',
        variant: 'destructive',
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSlide = (slide: any) => {
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
    });
    setEditingSlide(slide);
  };

  const handleUpdateSlide = async () => {
    if (!slideForm.title || !slideForm.subtitle) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setUpdateLoading(true);
    try {
      const updated = {
        ...editingSlide,
        ...slideForm,
      };
      await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setSlides(
        slides.map(slide =>
          slide.id === editingSlide.id ? updated : slide
        )
      );
      setSlideForm({ title: '', subtitle: '', image: '' });
      toast({
        title: 'Success',
        description: 'Hero slide updated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update slide',
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
      setEditingSlide(null); // auto-close dialog after update
    }
  };

  const handleDeleteSlide = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch('/api/hero', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSlides(slides.filter(slide => slide.id !== id));
      toast({
        title: 'Success',
        description: 'Hero slide deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete slide',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSlideActive = async (id: number) => {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;
    setActionLoading(id);
    try {
      const updated = { ...slide, active: !slide.active };
      await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setSlides(
        slides.map(s => (s.id === id ? updated : s))
      );
      toast({
        title: 'Success',
        description: 'Slide status updated',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Hero Section Management
          </h1>
          <p className="text-muted-foreground">
            Manage homepage hero slider content
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hero Slides</CardTitle>
                <CardDescription>
                  Manage hero section slides and content
                </CardDescription>
              </div>
              <Dialog
                open={isAddingSlide}
                onOpenChange={setIsAddingSlide}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slide
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Add New Hero Slide
                    </DialogTitle>
                    <DialogDescription>
                      Create a new slide for the hero
                      section
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={slideForm.title}
                        onChange={e =>
                          setSlideForm({
                            ...slideForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter slide title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">
                        Subtitle *
                      </Label>
                      <Textarea
                        id="subtitle"
                        value={slideForm.subtitle}
                        onChange={e =>
                          setSlideForm({
                            ...slideForm,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Enter slide subtitle"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Image</Label>
                      <DropzoneInput
                        value={slideForm.image}
                        onChange={url =>
                          setSlideForm({
                            ...slideForm,
                            image: url,
                          })
                        }
                        setImageLoading={setAddImageLoading}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleAddSlide}
                      className="flex-1"
                      disabled={
                        addLoading || addImageLoading
                      }
                    >
                      {addLoading || addImageLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Add Slide
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setIsAddingSlide(false)
                      }
                      className="flex-1"
                    >
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
                {slides.map(slide => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="relative h-16 w-24 rounded overflow-hidden">
                        <Image
                          src={
                            slide.image ||
                            '/placeholder.svg'
                          }
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {slide.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {slide.subtitle}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={
                          slide.active
                            ? 'default'
                            : 'secondary'
                        }
                        size="sm"
                        onClick={() =>
                          toggleSlideActive(slide.id)
                        }
                        disabled={
                          actionLoading === slide.id
                        }
                      >
                        {actionLoading === slide.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {slide.active
                          ? 'Active'
                          : 'Inactive'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Preview Slide
                              </DialogTitle>
                            </DialogHeader>
                            <div className="relative h-64 w-full rounded-lg overflow-hidden">
                              <Image
                                src={
                                  slide.image ||
                                  '/placeholder.svg'
                                }
                                alt={slide.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center">
                                <div>
                                  <h2 className="text-3xl font-bold mb-2">
                                    {slide.title}
                                  </h2>
                                  <p className="text-lg">
                                    {slide.subtitle}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={!!editingSlide}
                          onOpenChange={open => {
                            if (!open)
                              setEditingSlide(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditSlide(slide)
                              }
                              disabled={editImageLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Edit Hero Slide
                              </DialogTitle>
                              <DialogDescription>
                                Update slide content
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="editTitle">
                                  Title *
                                </Label>
                                <Input
                                  id="editTitle"
                                  value={slideForm.title}
                                  onChange={e =>
                                    setSlideForm({
                                      ...slideForm,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Enter slide title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editSubtitle">
                                  Subtitle *
                                </Label>
                                <Textarea
                                  id="editSubtitle"
                                  value={slideForm.subtitle}
                                  onChange={e =>
                                    setSlideForm({
                                      ...slideForm,
                                      subtitle:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Enter slide subtitle"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>
                                  Background Image
                                </Label>
                                <DropzoneInput
                                  value={slideForm.image}
                                  onChange={url =>
                                    setSlideForm({
                                      ...slideForm,
                                      image: url,
                                    })
                                  }
                                  setImageLoading={
                                    setEditImageLoading
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={handleUpdateSlide}
                                className="flex-1"
                                disabled={
                                  updateLoading ||
                                  editImageLoading
                                }
                              >
                                {updateLoading ||
                                editImageLoading ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : null}
                                Update Slide
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setEditingSlide(null)
                                }
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
                          onClick={() =>
                            handleDeleteSlide(slide.id)
                          }
                          className="text-red-500 hover:text-red-700"
                          disabled={
                            actionLoading === slide.id
                          }
                        >
                          {actionLoading === slide.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
