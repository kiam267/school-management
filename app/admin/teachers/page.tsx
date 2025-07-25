'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  Avatar,
  AvatarImage,
} from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

type Teacher = {
  id: number;
  name: string;
  age: number;
  education: string;
  subject: string;
  experience: number;
  tagId: number;
  description: string;
  image: string;
};

type TeachertagId = {
  id: number;
  name: string;
  color: string;
};

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [tagIds, settagIds] = useState<TeachertagId[]>([]);
  const [isAddingTeacher, setIsAddingTeacher] =
    useState(false);
  const [isAddingtagId, setIsAddingtagId] = useState(false);
  const [editingTeacher, setEditingTeacher] =
    useState<Teacher | null>(null);
  const [newtagId, setNewtagId] = useState('');
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    age: '',
    education: '',
    subject: '',
    experience: '',
    tagId: 0,
    description: '',
    image: '',
    imageUploading: false,
  });
  const [deletingtagIdId, setDeletingtagIdId] = useState<
    number | null
  >(null);
  const [deletingTeacherId, setDeletingTeacherId] =
    useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Dropzone handler
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setTeacherForm(prev => ({
        ...prev,
        imageUploading: true,
      }));
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/hero/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok)
          throw new Error('Failed to upload image');
        const { url } = await res.json();
        setTeacherForm(prev => ({
          ...prev,
          image: url,
          imageUploading: false,
        }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } catch (error) {
        setTeacherForm(prev => ({
          ...prev,
          imageUploading: false,
        }));
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );
  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop, accept: { 'image/*': [] } });

  // Fetch teachers and tagIds from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, tagIdsRes] = await Promise.all([
          fetch('/api/teachers'),
          fetch('/api/teacher-tags'),
        ]);
        const teachersData = await teachersRes.json();
        const tagIdsData = await tagIdsRes.json();
        setTeachers(teachersData);
        settagIds(tagIdsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load teachers or tagIds',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [toast]);

  // Add teacher (POST)
  const handleAddTeacher = async () => {
    setIsLoading(true);
    console.log(
      !teacherForm.name ||
        !teacherForm.description ||
        !teacherForm.tagId,
      teacherForm
    );
    if (
      !teacherForm.name ||
      !teacherForm.description ||
      !teacherForm.tagId
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teacherForm,
          age: Number(teacherForm.age) || 0,
          experience: Number(teacherForm.experience) || 0,
          image: teacherForm.image,
        }),
      });
      if (!res.ok) throw new Error('Failed to add teacher');
      const newTeacher = await res.json();
      setTeachers(prev => [...prev, newTeacher]);
      setTeacherForm({
        name: '',
        age: '',
        education: '',
        subject: '',
        experience: '',
        tagId: 0,
        description: '',
        image: '',
        imageUploading: false,
      });
      setIsAddingTeacher(false);
      toast({
        title: 'Success',
        description: 'Teacher added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add teacher',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit teacher (fill form)
  const handleEditTeacher = (teacher: Teacher) => {
    setTeacherForm({
      name: teacher.name,
      age: teacher.age?.toString() || '',
      education: teacher.education || '',
      subject: teacher.subject || '',
      experience: teacher.experience?.toString() || '',
      tagId: teacher.tagId,
      description: teacher.description,
      image: teacher.image,

      imageUploading: false,
    });
    setEditingTeacher(teacher);
  };

  // Update teacher (PUT)
  const handleUpdateTeacher = async () => {
    if (!editingTeacher || editingTeacher.id == null)
      return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/teachers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTeacher.id,
          ...teacherForm,
          age: Number(teacherForm.age) || 0,
          experience: Number(teacherForm.experience) || 0,
          image: teacherForm.image,
        }),
      });
      if (!res.ok)
        throw new Error('Failed to update teacher');
      const updatedTeacher = await res.json();
      setTeachers(prev =>
        prev.map(t =>
          t.id === updatedTeacher.id ? updatedTeacher : t
        )
      );
      setEditingTeacher(null); // Auto-close dialog on success
      setTeacherForm({
        name: '',
        age: '',
        education: '',
        subject: '',
        experience: '',
        tagId: 0,
        description: '',
        image: '',
        imageUploading: false,
      });
      toast({
        title: 'Success',
        description: 'Teacher updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update teacher',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete teacher (DELETE)
  const handleDeleteTeacher = async (id: number) => {
    setDeletingTeacherId(id);
    setIsLoading(true);
    try {
      const res = await fetch('/api/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok)
        throw new Error('Failed to delete teacher');
      setTeachers(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete teacher',
        variant: 'destructive',
      });
    } finally {
      setDeletingTeacherId(null);
      setIsLoading(false);
    }
  };

  // Add tagId (POST)
  const handleAddtagId = async () => {
    if (!newtagId.trim()) return;
    try {
      const res = await fetch('/api/teacher-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newtagId,
          color: `bg-${
            [
              'red',
              'blue',
              'green',
              'yellow',
              'purple',
              'pink',
            ][Math.floor(Math.random() * 6)]
          }-500`,
        }),
      });
      if (!res.ok) throw new Error('Failed to add tagId');
      const newtagIdObj = await res.json();
      settagIds(prev => [...prev, newtagIdObj]);
      setNewtagId('');
      setIsAddingtagId(false);
      toast({
        title: 'Success',
        description: 'tagId added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tagId',
        variant: 'destructive',
      });
    }
  };

  // Delete tagId (DELETE)
  const handleDeletetagId = async (id: number) => {
    setDeletingtagIdId(id);
    try {
      const res = await fetch('/api/teacher-tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok)
        throw new Error('Failed to delete tagId');
      settagIds(prev =>
        prev.filter(tagId => tagId.id !== id)
      );
      toast({
        title: 'Success',
        description: 'tagId deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tagId',
        variant: 'destructive',
      });
    } finally {
      setDeletingtagIdId(null);
    }
  };

  // Reset teacher form and editing state
  const resetTeacherForm = () => {
    setTeacherForm({
      name: '',
      age: '',
      education: '',
      subject: '',
      experience: '',
      tagId: 0,
      description: '',
      image: '',
      imageUploading: false,
    });
    setEditingTeacher(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Teacher Management
          </h1>
          <p className="text-muted-foreground">
            Manage teachers and their tagIds
          </p>
        </div>

        {/* Teacher tag Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teacher tag</CardTitle>
                <CardDescription>
                  Manage teacher categories and tag
                </CardDescription>
              </div>
              <Dialog
                open={isAddingtagId}
                onOpenChange={setIsAddingtagId}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New tag</DialogTitle>
                    <DialogDescription>
                      Create a new teacher tag
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagName">
                        tag Name
                      </Label>
                      <Input
                        id="tagName"
                        value={newtagId}
                        onChange={e =>
                          setNewtagId(e.target.value)
                        }
                        placeholder="Enter tag name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddtagId}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Add tag'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsAddingtagId(false)
                        }
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Cancel'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagIds.map(tagId => (
                <div
                  key={tagId.id}
                  className="flex items-center space-x-2"
                >
                  <Badge
                    className={cn(
                      'text-white bg-yellow-500',
                      tagId.color
                    )}
                  >
                    {tagId.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDeletetagId(tagId.id)
                    }
                    disabled={deletingtagIdId === tagId.id}
                    className={`h-6 w-6 p-0 ${
                      deletingtagIdId === tagId.id
                        ? 'text-gray-400'
                        : 'text-red-500 hover:text-red-700'
                    }`}
                  >
                    {deletingtagIdId === tagId.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
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
                <CardDescription>
                  Manage teacher profiles and information
                </CardDescription>
              </div>
              <Dialog
                open={isAddingTeacher}
                onOpenChange={setIsAddingTeacher}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Add New Teacher
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the teacher information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={teacherForm.name}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Teacher name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={teacherForm.age}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            age: e.target.value,
                          })
                        }
                        placeholder="Age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">
                        Education Level
                      </Label>
                      <Input
                        id="education"
                        value={teacherForm.education}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            education: e.target.value,
                          })
                        }
                        placeholder="Education qualification"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subject Expertise
                      </Label>
                      <Input
                        id="subject"
                        value={teacherForm.subject}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            subject: e.target.value,
                          })
                        }
                        placeholder="Subject areas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        value={teacherForm.experience}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            experience: e.target.value,
                          })
                        }
                        placeholder="Years"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag">tag *</Label>
                      <Select
                        value={
                          tagIds.find(
                            tag =>
                              tag.id === teacherForm.tagId
                          )?.name
                        }
                        onValueChange={value => {
                          const selectedTag = tagIds.find(
                            tag => tag.name === value
                          );
                          setTeacherForm({
                            ...teacherForm,
                            tagId: selectedTag
                              ? selectedTag.id
                              : 0,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {tagIds.map(tagId => (
                            <SelectItem
                              key={tagId.id}
                              value={tagId.name}
                            >
                              {tagId.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={teacherForm.description}
                        onChange={e =>
                          setTeacherForm({
                            ...teacherForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter teacher description"
                        className="max-h-24"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="image">
                        Profile Image
                      </Label>
                      <div
                        {...getRootProps()}
                        className="border-dashed border-2 rounded-md p-4 flex flex-col items-center cursor-pointer hover:border-blue-500 transition"
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p>Drop the image here ...</p>
                        ) : (
                          <p>
                            Drag 'n' drop an image here, or
                            click to select
                          </p>
                        )}
                        {teacherForm.imageUploading && (
                          <p className="text-blue-500 mt-2">
                            Uploading...
                          </p>
                        )}
                        {teacherForm.image &&
                          !teacherForm.imageUploading && (
                            <img
                              src={teacherForm.image}
                              alt="Preview"
                              className="mt-2 h-24 w-24 object-cover rounded-full border"
                            />
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleAddTeacher}
                      disabled={
                        isLoading ||
                        teacherForm.imageUploading
                      }
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Add Teacher'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setIsAddingTeacher(false)
                      }
                      disabled={
                        isLoading ||
                        teacherForm.imageUploading
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
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>tag</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map(teacher => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <Avatar>
                        <AvatarImage
                          src={teacher.image as string}
                          alt={teacher.name}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                        <AvatarFallback>
                          {teacher.name
                            ? teacher.name[0].toUpperCase()
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {teacher.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${
                          tagIds.find(
                            tag => tag.id === teacher.tagId
                          )?.color || 'bg-gray-500'
                        } text-white ${
                          'hover:' +
                            tagIds.find(
                              tag =>
                                tag.id === teacher.tagId
                            )?.color || 'hover:bg-gray-600'
                        }`}
                      >
                        {tagIds.find(
                          tag => tag.id === teacher.tagId
                        )?.name || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {teacher.subject || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {teacher.experience
                        ? `${teacher.experience} years`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog
                          open={
                            editingTeacher?.id ===
                            teacher.id
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditTeacher(teacher)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Edit Teacher
                              </DialogTitle>
                              <DialogDescription>
                                Update teacher information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="editName">
                                  Name *
                                </Label>
                                <Input
                                  id="editName"
                                  value={teacherForm.name}
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Teacher name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editagIde">
                                  Age
                                </Label>
                                <Input
                                  id="editagIde"
                                  type="number"
                                  value={teacherForm.age}
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      age: e.target.value,
                                    })
                                  }
                                  placeholder="Age"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editEducation">
                                  Education Level
                                </Label>
                                <Input
                                  id="editEducation"
                                  value={
                                    teacherForm.education
                                  }
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      education:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Education qualification"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editSubject">
                                  Subject Expertise
                                </Label>
                                <Input
                                  id="editSubject"
                                  value={
                                    teacherForm.subject
                                  }
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      subject:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Subject areas"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editExperience">
                                  Years of Experience
                                </Label>
                                <Input
                                  id="editExperience"
                                  type="number"
                                  value={
                                    teacherForm.experience
                                  }
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      experience:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Years"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edittagId">
                                  tagId *
                                </Label>
                                <Select
                                  value={
                                    tagIds.find(
                                      tag =>
                                        tag.id ===
                                        teacherForm.tagId
                                    )?.name
                                  }
                                  onValueChange={value => {
                                    const selectedTag =
                                      tagIds.find(
                                        tag =>
                                          tag.name === value
                                      );
                                    setTeacherForm({
                                      ...teacherForm,
                                      tagId: selectedTag
                                        ? selectedTag.id
                                        : 0,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tagId" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tagIds.map(tagId => (
                                      <SelectItem
                                        key={tagId.id}
                                        value={tagId.name}
                                      >
                                        {tagId.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editDescription">
                                  Description *
                                </Label>
                                <Textarea
                                  id="editDescription"
                                  value={
                                    teacherForm.description
                                  }
                                  onChange={e =>
                                    setTeacherForm({
                                      ...teacherForm,
                                      description:
                                        e.target.value,
                                    })
                                  }
                                  placeholder="Teacher description"
                                  className="max-h-24"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="editImage">
                                  Profile Image
                                </Label>
                                <div
                                  {...getRootProps()}
                                  className="border-dashed border-2 rounded-md p-4 flex flex-col items-center cursor-pointer hover:border-blue-500 transition"
                                >
                                  <input
                                    {...getInputProps()}
                                  />
                                  {isDragActive ? (
                                    <p>
                                      Drop the image here
                                      ...
                                    </p>
                                  ) : (
                                    <p>
                                      Drag 'n' drop an image
                                      here, or click to
                                      select
                                    </p>
                                  )}
                                  {teacherForm.imageUploading && (
                                    <p className="text-blue-500 mt-2">
                                      Uploading...
                                    </p>
                                  )}
                                  {teacherForm.image &&
                                    !teacherForm.imageUploading && (
                                      <img
                                        src={
                                          teacherForm.image
                                        }
                                        alt="Preview"
                                        className="mt-2 h-24 w-24 object-cover rounded-full border"
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={
                                  handleUpdateTeacher
                                }
                                className="flex-1 cursor-pointer"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  ' Update Teacher'
                                )}
                              </Button>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    if (editingTeacher) {
                                      setTeacherForm({
                                        name: '',
                                        age: '',
                                        education: '',
                                        subject: '',
                                        experience: '',
                                        tagId: 0,
                                        description: '',
                                        image: '',
                                        imageUploading:
                                          false,
                                      });
                                    }
                                    setEditingTeacher(null);
                                  }}
                                  className="flex-1"
                                  disabled={isLoading}
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
                            handleDeleteTeacher(teacher.id)
                          }
                          disabled={
                            isLoading ||
                            deletingTeacherId === teacher.id
                          }
                          className={`text-red-500 hover:text-red-700 ${
                            deletingTeacherId === teacher.id
                              ? 'cursor-not-allowed'
                              : ''
                          }`}
                        >
                          {deletingTeacherId ===
                          teacher.id ? (
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
