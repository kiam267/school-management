'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  Upload,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { useAbout } from '@/hooks/use-about';
import { useSettings } from '@/contexts/settings-context';
import { useDropzone } from 'react-dropzone';

const initialAboutData = {
  heroImage: '/placeholder.svg?height=400&width=1200',
  vision:
    'To be a leading educational institution that nurtures innovative thinkers, compassionate leaders, and responsible global citizens who contribute meaningfully to society and drive positive change in the world.',
  mission:
    'We provide a comprehensive, student-centered education that combines academic excellence with character development, critical thinking, and practical skills preparation for higher education and life success.',
  overview:
    'Royal Academy has been a cornerstone of educational excellence for nearly four decades. Founded in 1985, we have consistently evolved to meet the changing needs of our students and the demands of a rapidly advancing world.',
  foundedYear: '1985',
  motto: 'Excellence in Education, Character in Life',
};

const initialAchievements = [
  {
    id: 1,
    year: '1985',
    title: 'School Founded',
    description: 'Established with a vision for excellence',
  },
  {
    id: 2,
    year: '1995',
    title: 'First Computer Lab',
    description: 'Introduced technology in education',
  },
  {
    id: 3,
    year: '2005',
    title: 'Science Excellence Award',
    description:
      'Recognized for outstanding science education',
  },
  {
    id: 4,
    year: '2015',
    title: 'Digital Transformation',
    description: 'Fully integrated digital learning',
  },
  {
    id: 5,
    year: '2020',
    title: 'Online Learning Pioneer',
    description: 'Successfully adapted to remote learning',
  },
  {
    id: 6,
    year: '2024',
    title: 'AI Integration',
    description: 'Leading in AI-assisted education',
  },
];

export default function AboutManagement() {
  const {
    aboutData,
    loading,
    saving,
    updateSection,
    updateAchievement,
    addAchievement,
    removeAchievement,
    saveAboutData,
    deleteAchievement,
    resetAboutData,
  } = useAbout();
  const { settings } = useSettings();
  const { toast } = useToast();

  const [isAddingAchievement, setIsAddingAchievement] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<any>(null);
  const [achievementForm, setAchievementForm] = useState({
    year: '',
    title: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);

  // Hero image upload handler
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];

      try {
        setUploading(true);

        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);

        // Upload to the hero upload API
        const response = await fetch('/api/hero/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();

        if (result.url) {
          updateSection('hero', { image: result.url });
          toast({
            title: 'Upload Successful',
            description: 'Hero image uploaded successfully',
          });
        } else {
          throw new Error('No URL returned from upload');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload Failed',
          description:
            'Failed to upload image. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      multiple: false,
      disabled: uploading,
    });

  const handleSave = async () => {
    const success = await saveAboutData(aboutData);
    if (success) {
      toast({
        title: 'Success',
        description:
          'About page content updated successfully',
      });
    }
  };

  const handleReset = () => {
    resetAboutData();
  };

  // Achievement Management
  const handleAddAchievement = () => {
    if (!achievementForm.year || !achievementForm.title) {
      toast({
        title: 'Error',
        description: 'Please fill in year and title fields',
        variant: 'destructive',
      });
      return;
    }

    addAchievement({
      year: achievementForm.year,
      title: achievementForm.title,
      description: achievementForm.description,
      order: aboutData.achievements.length + 1,
    });

    setAchievementForm({
      year: '',
      title: '',
      description: '',
    });
    setIsAddingAchievement(false);
    toast({
      title: 'Success',
      description:
        "Achievement added successfully. Don't forget to save all changes!",
    });
  };

  const handleEditAchievement = (achievement: any) => {
    setAchievementForm({
      year: achievement.year,
      title: achievement.title,
      description: achievement.description || '',
    });
    setEditingAchievement(achievement);
  };

  const handleUpdateAchievement = () => {
    if (!achievementForm.year || !achievementForm.title) {
      toast({
        title: 'Error',
        description: 'Please fill in year and title fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingAchievement) {
      updateAchievement(editingAchievement.id, {
        year: achievementForm.year,
        title: achievementForm.title,
        description: achievementForm.description,
      });
      toast({
        title: 'Success',
        description:
          "Achievement updated successfully. Don't forget to save all changes!",
      });
    }

    setEditingAchievement(null);
    setAchievementForm({
      year: '',
      title: '',
      description: '',
    });
  };

  const handleDeleteAchievement = (
    id: string | undefined
  ) => {
    if (!id) return;

    const confirmDelete = async () => {
      setIsDeleting(true);
      await deleteAchievement(id);
      setIsDeleting(false);

      removeAchievement(id);
    };
    confirmDelete();
    // if you're tracking UI state

    toast({
      title: 'Success',
      description:
        "Achievement deleted successfully. Don't forget to save all changes!",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading about page data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            About Page Management
          </h1>
          <p className="text-muted-foreground">
            Manage about page content, vision, mission, and
            achievements
          </p>
        </div>

        {/* Hero Image */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Manage the hero image and main banner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImage">
                Hero Background Image
              </Label>
              <div className="flex space-x-2">
                <div
                  {...getRootProps()}
                  className={`flex-1 border rounded p-2 cursor-pointer bg-muted/30 relative h-20 ${
                    isDragActive
                      ? 'ring-2 ring-primary'
                      : ''
                  } ${
                    uploading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  title={
                    uploading
                      ? 'Uploading...'
                      : 'Upload image by drag & drop or click'
                  }
                >
                  {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : aboutData.sections.find(
                      s => s.section === 'hero'
                    )?.image ? (
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={
                          aboutData.sections.find(
                            s => s.section === 'hero'
                          )?.image || ''
                        }
                        alt="Hero Preview"
                        width={64}
                        height={64}
                        className="object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <input {...getInputProps()} />
                </div>
              </div>
            </div>
            {aboutData.sections.find(
              s => s.section === 'hero'
            )?.image && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={
                      aboutData.sections.find(
                        s => s.section === 'hero'
                      )?.image || '/placeholder.svg'
                    }
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">
                        About Our School
                      </h2>
                      <p className="text-lg">
                        Excellence in Education Since{' '}
                        {settings.establishedYear || '1985'}
                      </p>
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
              <CardDescription>
                School's vision for the future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={
                  aboutData.sections.find(
                    s => s.section === 'vision'
                  )?.content || ''
                }
                onChange={e =>
                  updateSection('vision', {
                    content: e.target.value,
                  })
                }
                placeholder="Enter school vision"
                rows={6}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>
                School's mission and purpose
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={
                  aboutData.sections.find(
                    s => s.section === 'mission'
                  )?.content || ''
                }
                onChange={e =>
                  updateSection('mission', {
                    content: e.target.value,
                  })
                }
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
            <CardDescription>
              General information about the school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overview">
                School Overview
              </Label>
              <Textarea
                id="overview"
                value={
                  aboutData.sections.find(
                    s => s.section === 'overview'
                  )?.content || ''
                }
                onChange={e =>
                  updateSection('overview', {
                    content: e.target.value,
                  })
                }
                placeholder="Enter school overview"
                rows={6}
                className="min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foundedYear">
                  Founded Year
                </Label>
                <Input
                  id="foundedYear"
                  value={settings.establishedYear || ''}
                  placeholder="Enter founded year"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  This is managed in Settings
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motto">
                  School Motto (Optional)
                </Label>
                <Input
                  id="motto"
                  value={
                    aboutData.sections.find(
                      s => s.section === 'hero'
                    )?.content || ''
                  }
                  onChange={e =>
                    updateSection('hero', {
                      content: e.target.value,
                    })
                  }
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
                <CardTitle>
                  Key Achievements Timeline
                </CardTitle>
                <CardDescription>
                  Manage school milestones and achievements
                </CardDescription>
              </div>
              <Dialog
                open={isAddingAchievement}
                onOpenChange={setIsAddingAchievement}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Add New Achievement
                    </DialogTitle>
                    <DialogDescription>
                      Add a milestone to the school timeline
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="achievementYear">
                        Year
                      </Label>
                      <Input
                        id="achievementYear"
                        value={achievementForm.year}
                        onChange={e =>
                          setAchievementForm({
                            ...achievementForm,
                            year: e.target.value,
                          })
                        }
                        placeholder="Enter year (e.g., 2024)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievementTitle">
                        Title
                      </Label>
                      <Input
                        id="achievementTitle"
                        value={achievementForm.title}
                        onChange={e =>
                          setAchievementForm({
                            ...achievementForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter achievement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievementDescription">
                        Description
                      </Label>
                      <Textarea
                        id="achievementDescription"
                        value={achievementForm.description}
                        onChange={e =>
                          setAchievementForm({
                            ...achievementForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter achievement description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleAddAchievement}
                      className="flex-1"
                    >
                      Add Achievement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setIsAddingAchievement(false)
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
                  <TableHead>Year</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aboutData.achievements.map(
                  (achievement, index) => (
                    <TableRow key={achievement.id || index}>
                      <TableCell className="font-medium">
                        {achievement.year}
                      </TableCell>
                      <TableCell>
                        {achievement.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {achievement.description || ''}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditAchievement(
                                    achievement
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Edit Achievement
                                </DialogTitle>
                                <DialogDescription>
                                  Update achievement
                                  information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editAchievementYear">
                                    Year
                                  </Label>
                                  <Input
                                    id="editAchievementYear"
                                    value={
                                      achievementForm.year
                                    }
                                    onChange={e =>
                                      setAchievementForm({
                                        ...achievementForm,
                                        year: e.target
                                          .value,
                                      })
                                    }
                                    placeholder="Enter year (e.g., 2024)"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editAchievementTitle">
                                    Title
                                  </Label>
                                  <Input
                                    id="editAchievementTitle"
                                    value={
                                      achievementForm.title
                                    }
                                    onChange={e =>
                                      setAchievementForm({
                                        ...achievementForm,
                                        title:
                                          e.target.value,
                                      })
                                    }
                                    placeholder="Enter achievement title"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editAchievementDescription">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="editAchievementDescription"
                                    value={
                                      achievementForm.description
                                    }
                                    onChange={e =>
                                      setAchievementForm({
                                        ...achievementForm,
                                        description:
                                          e.target.value,
                                      })
                                    }
                                    placeholder="Enter achievement description"
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-2 pt-4">
                                <Button
                                  onClick={
                                    handleUpdateAchievement
                                  }
                                  className="flex-1"
                                >
                                  Update Achievement
                                </Button>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setEditingAchievement(
                                        null
                                      )
                                    }
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
                              handleDeleteAchievement(
                                achievement.id
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 bg-transparent"
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
