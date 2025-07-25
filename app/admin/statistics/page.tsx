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
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Monitor,
  Save,
  RotateCcw,
} from 'lucide-react';

const statisticsIcons = {
  students: Users,
  teachers: GraduationCap,
  classrooms: Building,
  books: BookOpen,
  computers: Monitor,
};

const initialStatistics = {
  students: {
    value: 1250,
    label: 'Total Students',
    suffix: '+',
  },
  teachers: {
    value: 85,
    label: 'Total Teachers',
    suffix: '+',
  },
  classrooms: {
    value: 45,
    label: 'Classrooms',
    suffix: '',
  },
  books: {
    value: 15000,
    label: 'Library Books',
    suffix: '+',
  },
  computers: {
    value: 120,
    label: 'Computers',
    suffix: '+',
  },
};

type StatisticItem = {
  key: string;
  value: number;
  label: string;
  suffix: string;
};

type Statistics = {
  [key: string]: {
    value: number;
    label: string;
    suffix: string;
  };
};

function mapArrayToStatistics(arr: StatisticItem[]): Statistics {
  const obj: Statistics = {};
  arr.forEach((stat: StatisticItem) => {
    obj[stat.key] = {
      value: stat.value,
      label: stat.label,
      suffix: stat.suffix,
    };
  });
  return obj;
}

function mapStatisticsToArray(statistics: Statistics): StatisticItem[] {
  return Object.entries(statistics).map(([key, stat]) => ({
    key,
    value: (stat as { value: number }).value,
    label: (stat as { label: string }).label,
    suffix: (stat as { suffix: string }).suffix,
  }));
}

import { useEffect } from 'react';

export default function StatisticsManagement() {
  const [statistics, setStatistics] = useState<Statistics>(
    initialStatistics
  );
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Fetch statistics from API on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStatistics(mapArrayToStatistics(data));
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to load statistics',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatisticChange = (
    key: keyof typeof statistics,
    field: 'value' | 'label' | 'suffix',
    value: string | number
  ) => {
    setStatistics(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'value' ? Number(value) : value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/statistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mapStatisticsToArray(statistics)
        ),
      });
      if (!res.ok) throw new Error();
      toast({
        title: 'Success',
        description: 'Statistics updated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/statistics', {
        method: 'PUT',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Re-fetch statistics after reset
      const statsRes = await fetch('/api/statistics');
      const statsData = await statsRes.json();
      setStatistics(mapArrayToStatistics(statsData));
      toast({
        title: 'Reset Complete',
        description:
          'Statistics have been reset to default values',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to reset statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            School Statistics Management
          </h1>
          <p className="text-muted-foreground">
            Manage the statistics displayed on the homepage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statistics Form */}
          <Card>
            <CardHeader>
              <CardTitle>Update Statistics</CardTitle>
              <CardDescription>
                Modify the numbers displayed in the
                statistics section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(statistics).map(
                ([key, stat]) => {
                  const IconComponent =
                    statisticsIcons[
                      key as keyof typeof statisticsIcons
                    ];
                  return (
                    <div
                      key={key}
                      className="space-y-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold capitalize">
                          {key}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${key}-value`}>
                            Value
                          </Label>
                          <Input
                            id={`${key}-value`}
                            type="number"
                            value={stat.value}
                            onChange={e =>
                              handleStatisticChange(
                                key as keyof typeof statistics,
                                'value',
                                e.target.value
                              )
                            }
                            placeholder="Enter number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${key}-label`}>
                            Label
                          </Label>
                          <Input
                            id={`${key}-label`}
                            value={stat.label}
                            onChange={e =>
                              handleStatisticChange(
                                key as keyof typeof statistics,
                                'label',
                                e.target.value
                              )
                            }
                            placeholder="Enter label"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${key}-suffix`}>
                            Suffix
                          </Label>
                          <Input
                            id={`${key}-suffix`}
                            value={stat.suffix}
                            onChange={e =>
                              handleStatisticChange(
                                key as keyof typeof statistics,
                                'suffix',
                                e.target.value
                              )
                            }
                            placeholder="e.g., +, %, etc."
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

              <div className="flex space-x-4 pt-6">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={loading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your statistics will appear on the
                homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                <h3 className="text-xl font-bold text-center mb-6">
                  Our School in Numbers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(statistics).map(
                    ([key, stat]) => {
                      const IconComponent =
                        statisticsIcons[
                          key as keyof typeof statisticsIcons
                        ];
                      return (
                        <div
                          key={key}
                          className="text-center"
                        >
                          <div className="flex justify-center mb-2">
                            <div className="p-2 bg-accent rounded-full">
                              <IconComponent className="h-6 w-6 text-accent-foreground" />
                            </div>
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {stat.value.toLocaleString()}
                            {stat.suffix}
                          </div>
                          <p className="text-sm opacity-90">
                            {stat.label}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Statistics Display */}
        <Card>
          <CardHeader>
            <CardTitle>
              Current Statistics Overview
            </CardTitle>
            <CardDescription>
              Quick overview of all current statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(statistics).map(
                ([key, stat]) => {
                  const IconComponent =
                    statisticsIcons[
                      key as keyof typeof statisticsIcons
                    ];
                  return (
                    <Card key={key}>
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {stat.value.toLocaleString()}
                          {stat.suffix}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
