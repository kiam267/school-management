'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';

type Teacher = {
  id: number;
  name: string;
  tagName: string;
  subject: string;
  image: string;
  experience: string;
  description: string;
  age: number;
  tagId?: number; // Added optional tagId property
};

const defaultTeachers: Teacher[] = [
  {
    id: 1,
    name: 'John Doe',
    tagName: 'Professor',
    subject: 'Mathematics',
    image: '/placeholder.svg',
    experience: '10 years',
    description:
      'Expert in Algebra and Geometry. Passionate about teaching and helping students achieve their potential.',
    age: 45,
  },
  {
    id: 2,
    name: 'Jane Smith',
    tagName: 'Associate Professor',
    subject: 'Physics',
    image: '/placeholder.svg',
    experience: '8 years',
    description:
      'Specializes in Quantum Mechanics and Thermodynamics. Committed to fostering a positive learning environment.',
    age: 40,
  },
  {
    id: 3,
    name: 'Emily Johnson',
    tagName: 'Assistant Professor',
    subject: 'Chemistry',
    image: '/placeholder.svg',
    experience: '5 years',
    description:
      'Focuses on Organic and Inorganic Chemistry. Enthusiastic about engaging students in scientific research.',
    age: 35,
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] =
    useState<Teacher[]>(defaultTeachers);
  const [selectedTeacher, setSelectedTeacher] =
    useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchTeachersAndTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const [teachersRes, tagsRes] = await Promise.all([
          fetch('/api/teachers'),
          fetch('/api/teacher-tags'),
        ]);

        if (!teachersRes.ok || !tagsRes.ok) {
          throw new Error(
            'Failed to fetch teachers or tags'
          );
        }

        const teachersData: Teacher[] =
          await teachersRes.json();
        const tagsData: { id: number; name: string }[] =
          await tagsRes.json();

        if (teachersData.length === 0) {
          setTeachers(defaultTeachers);
        } else {
          const mergedTeachers = teachersData.map(
            (teacher: Teacher) => {
              const tag = tagsData.find(
                tag => tag.id === teacher.tagId
              );
              return {
                ...teacher,
                tagName: tag ? tag.name : 'Unknown',
              };
            }
          );
          setTeachers(mergedTeachers);
        }
      } catch (error) {
        console.error(error);
        setTeachers(defaultTeachers);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersAndTags();
  }, []);

  if (loading) {
    return (
      <section className="py-16 container mx-auto">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the passionate educators who bring
              knowledge to life and inspire the next
              generation of learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center animate-pulse">
                    <div className="w-28 h-28 bg-gray-300 dark:bg-gray-600 rounded-full mb-6" />
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-6" />
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 container mx-auto">
        <div className="container">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 container mx-auto">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Meet Our Expert Faculty
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the passionate educators who bring
            knowledge to life and inspire the next
            generation of learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <Card
              key={teacher.id}
              className="group relative border"
            >
              {/* Gradient overlay */}
              <CardContent className="p-0">
                {/* Header section with avatar */}
                <div className="relative p-8 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <Avatar className="w-28 h-28 ring-4 ring-white dark:ring-slate-700">
                        <AvatarImage
                          src={
                            teacher.image ||
                            '/placeholder.svg'
                          }
                          alt={teacher.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-white">
                          {teacher.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-center">
                      {teacher.name}
                    </h3>

                    <Badge
                      variant="secondary"
                      className="mb-4 px-4 py-1 text-sm font-medium bg-primary/10 text-primary border-primary/20"
                    >
                      {teacher.tagName}
                    </Badge>
                  </div>
                </div>

                {/* Content section */}
                <div className="px-8 pb-8">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {teacher.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>
                        {teacher.experience} experience
                      </span>
                    </div>

                    {teacher.age && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <User className="w-5 h-5 text-primary" />
                        <span>{teacher.age} years old</span>
                      </div>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-transparent cursor-pointer"
                        variant="outline"
                        onClick={() =>
                          setSelectedTeacher(teacher)
                        }
                      >
                        View Profile
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl p-0 overflow-hidden ">
                      {selectedTeacher && (
                        <div className="relative">
                          {/* Header with gradient background */}
                          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
                            <DialogHeader>
                              <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="w-32 h-32 ring-4 ring-white/20">
                                  <AvatarImage
                                    src={
                                      selectedTeacher.image ||
                                      '/placeholder.svg'
                                    }
                                    alt={
                                      selectedTeacher.name
                                    }
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="text-3xl font-bold bg-white/20">
                                    {selectedTeacher.name
                                      .split(' ')
                                      .map(n => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-center md:text-left">
                                  <DialogTitle className="text-3xl font-bold mb-2">
                                    {selectedTeacher.name}
                                  </DialogTitle>
                                  <Badge
                                    variant="secondary"
                                    className="bg-white/20 text-white border-white/30 mb-2"
                                  >
                                    {
                                      selectedTeacher.tagName
                                    }
                                  </Badge>
                                  <p className="text-white/90 text-lg">
                                    {
                                      selectedTeacher.subject
                                    }
                                  </p>
                                </div>
                              </div>
                            </DialogHeader>
                          </div>

                          {/* Content */}
                          <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Age
                                    </p>
                                    <p className="font-semibold">
                                      {selectedTeacher.age ||
                                        'N/A'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Experience
                                    </p>
                                    <p className="font-semibold">
                                      {
                                        selectedTeacher.experience
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Award className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      tagName
                                    </p>
                                    <p className="font-semibold">
                                      {
                                        selectedTeacher.tagName
                                      }
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Subject
                                    </p>
                                    <p className="font-semibold">
                                      {
                                        selectedTeacher.subject
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {selectedTeacher.description && (
                              <div className="rounded-lg p-6 ">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                  About
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {
                                    selectedTeacher.description
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
