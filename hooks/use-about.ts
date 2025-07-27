import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface AboutSection {
  id?: string;
  section: string;
  title?: string;
  content?: string;
  image?: string | null;
  order: number;
  active?: boolean;
  updatedAt?: string;
}

export interface Achievement {
  id?: string;
  year: string;
  title: string;
  description?: string;
  order: number;
  active?: boolean;
  updatedAt?: string;
}

export interface AboutPageData {
  sections: AboutSection[];
  achievements: Achievement[];
}

const defaultAboutData: AboutPageData = {
  sections: [
    {
      section: 'hero',
      title: 'About Our School',
      content: 'Excellence in Education Since 1985',
      image: '/placeholder.svg?height=400&width=1200',
      order: 1,
    },
    {
      section: 'vision',
      title: 'Our Vision',
      content:
        'To be a leading educational institution that nurtures innovative thinkers, compassionate leaders, and responsible global citizens who contribute meaningfully to society and drive positive change in the world.',
      image: null,
      order: 2,
    },
    {
      section: 'mission',
      title: 'Our Mission',
      content:
        'We provide a comprehensive, student-centered education that combines academic excellence with character development, critical thinking, and practical skills preparation for higher education and life success.',
      image: null,
      order: 3,
    },
    {
      section: 'overview',
      title: 'School Overview',
      content: `Royal Academy has been a cornerstone of educational excellence for nearly four decades. Founded in 1985, we have consistently evolved to meet the changing needs of our students and the demands of a rapidly advancing world.

Our comprehensive curriculum spans Science, Commerce, and General streams, ensuring that every student finds their path to success. With state-of-the-art facilities, experienced faculty, and a commitment to holistic development, we prepare students not just for examinations, but for life.

We believe in fostering an environment where curiosity thrives, creativity flourishes, and character is built. Our students graduate as confident, capable individuals ready to make their mark in higher education and beyond.`,
      image: null,
      order: 4,
    },
    {
      section: 'features',
      title: 'Key Features',
      content: null,
      image: null,
      order: 5,
    },
    {
      section: 'timeline',
      title: 'Our Journey',
      content: null,
      image: null,
      order: 6,
    },
  ],
  achievements: [
    {
      year: '1985',
      title: 'School Founded',
      description:
        'Established with a vision for excellence',
      order: 1,
    },
    {
      year: '1995',
      title: 'First Computer Lab',
      description: 'Introduced technology in education',
      order: 2,
    },
    {
      year: '2005',
      title: 'Science Excellence Award',
      description:
        'Recognized for outstanding science education',
      order: 3,
    },
    {
      year: '2015',
      title: 'Digital Transformation',
      description: 'Fully integrated digital learning',
      order: 4,
    },
    {
      year: '2020',
      title: 'Online Learning Pioneer',
      description:
        'Successfully adapted to remote learning',
      order: 5,
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Leading in AI-assisted education',
      order: 6,
    },
  ],
};

export function useAbout() {
  const [aboutData, setAboutData] = useState<AboutPageData>(
    defaultAboutData
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch about page data from API
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about');

      if (!response.ok) {
        throw new Error('Failed to fetch about page data');
      }

      const data = await response.json();

      // Merge with defaults to ensure all sections exist
      const processedData: AboutPageData = {
        sections: [...defaultAboutData.sections],
        achievements:
          data.achievements ||
          defaultAboutData.achievements,
      };

      // Update sections with data from API
      if (data.sections) {
        data.sections.forEach(
          (apiSection: AboutSection) => {
            const index = processedData.sections.findIndex(
              s => s.section === apiSection.section
            );
            if (index !== -1) {
              processedData.sections[index] = {
                ...processedData.sections[index],
                ...apiSection,
              };
            }
          }
        );
      }

      setAboutData(processedData);
    } catch (error) {
      console.error(
        'Error fetching about page data:',
        error
      );
      toast({
        title: 'Error',
        description:
          'Failed to load about page data. Using default values.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save about page data to API
  const saveAboutData = async (newData: AboutPageData) => {
    try {
      setSaving(true);
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Failed to save about page data');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh data from the database to get real IDs
        await fetchAboutData();
        toast({
          title: 'Success',
          description: 'About page data saved successfully',
        });
        return true;
      } else {
        throw new Error(
          result.error || 'Failed to save about page data'
        );
      }
    } catch (error) {
      console.error('Error saving about page data:', error);
      toast({
        title: 'Error',
        description:
          'Failed to save about page data. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update a single section
  const updateSection = (
    sectionKey: string,
    updates: Partial<AboutSection>
  ) => {
    setAboutData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.section === sectionKey
          ? { ...section, ...updates }
          : section
      ),
    }));
  };

  // Update a single achievement
  const updateAchievement = (
    achievementId: string | undefined,
    updates: Partial<Achievement>
  ) => {
    if (!achievementId) return;

    setAboutData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, ...updates }
          : achievement
      ),
    }));
  };

  // Add new achievement
  const addAchievement = (
    achievement: Omit<Achievement, 'id'>
  ) => {
    // Generate a temporary UUID for new achievements
    // This will be replaced with a real UUID when saved to the database
    const newId = crypto.randomUUID();
    setAboutData(prev => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { ...achievement, id: newId },
      ],
    }));
  };

  // Remove achievement
  const removeAchievement = (
    achievementId: string | undefined
  ) => {
    if (!achievementId) return;

    setAboutData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(
        a => a.id !== achievementId
      ),
    }));
  };

  // Reset to default
  const resetAboutData = () => {
    setAboutData(defaultAboutData);
    toast({
      title: 'About Page Reset',
      description:
        'All about page data has been reset to default values.',
    });
  };

  const deleteAchievement = async (
    achievementId: string 
  ) => {
    try {
      const response = await fetch('/api/about', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ achievementId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || 'Failed to delete achievement'
        );
      }

      toast({
        title: 'Success',
        description:
          result.message ||
          'Achievement deleted successfully.',
      });

      // Optional: update local state here if needed
      // setAchievements(prev => prev.filter(a => a.id !== achievementId));
    } catch (error: any) {
      console.error('Error deleting achievement:', error);

      toast({
        title: 'Error',
        description:
          error?.message ||
          'Failed to delete achievement. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  return {
    aboutData,
    loading,
    saving,
    updateSection,
    updateAchievement,
    addAchievement,
    removeAchievement,
    saveAboutData,
    resetAboutData,
    fetchAboutData,
    deleteAchievement,
  };
}
