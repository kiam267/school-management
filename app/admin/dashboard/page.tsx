'use client';
import { AdminLayout } from '@/components/admin/admin-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  GraduationCap,
  Building,
  Monitor,
  ImageIcon,
  MessageSquare,
  Newspaper,
  Info,
  Settings,
  BarChart3,
  Library,
} from 'lucide-react';
import Link from 'next/link';

import { useEffect, useState } from 'react';

const statIconMap = {
  students: Users,
  teachers: GraduationCap,
  computers: Monitor,
  books: Library,
  // rooms removed
};

export type Stat = {
  key: keyof typeof statIconMap;
  label: string;
  value: string;
  suffix?: string;
};

const managementSections = [
  {
    title: 'Hero Section',
    description: 'Manage homepage hero slider',
    icon: ImageIcon,
    href: '/admin/hero',
    color: 'bg-blue-500',
  },
  {
    title: 'Testimonials',
    description: 'Manage student testimonials',
    icon: MessageSquare,
    href: '/admin/testimonials',
    color: 'bg-green-500',
  },
  {
    title: 'Teachers',
    description: 'Manage teacher profiles',
    icon: GraduationCap,
    href: '/admin/teachers',
    color: 'bg-purple-500',
  },
  {
    title: 'Statistics',
    description: 'Manage homepage statistics',
    icon: BarChart3,
    href: '/admin/statistics',
    color: 'bg-indigo-500',
  },
  {
    title: 'News',
    description: 'Manage news articles',
    icon: Newspaper,
    href: '/admin/news',
    color: 'bg-orange-500',
  },
  {
    title: 'About',
    description: 'Manage about page content',
    icon: Info,
    href: '/admin/about',
    color: 'bg-cyan-500',
  },
  {
    title: 'Settings',
    description: 'School branding, theme & configuration',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(
            data.map((stat: any) => ({
              key: stat.key,
              label: stat.label ?? stat.title,
              value: stat.value,
              suffix: stat.suffix ?? '',
            }))
          );
        }
      });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Royal Academy admin panel
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.slice(0, 4).map((stat, index) => {
            const Icon = statIconMap[stat.key] || BarChart3;
            // Generate a random color for the icon
            const iconColors = [
              'text-blue-600',
              'text-green-600',
              'text-purple-600',
              'text-orange-600',
              'text-indigo-600',
              'text-pink-600',
              'text-cyan-600',
              'text-red-600',
            ];
            const iconColor =
              iconColors[index % iconColors.length];
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon
                    className={`h-6 w-6 ${iconColor}`}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black flex items-baseline">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="ml-1">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Management Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementSections.map((section, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={section.href}>Manage</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
