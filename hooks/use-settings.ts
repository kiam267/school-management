import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface Settings {
  // Branding
  schoolName: string;
  logo: string;
  favicon: string;
  tagline: string;

  // SEO & Metadata
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Contact Information
  address: string;
  phone: string;
  email: string;
  website: string;

  // Social Media
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;

  // School Information
  establishedYear: string;
  principalName: string;
  totalStudents: string;
  totalTeachers: string;
  footerText: string;
  copyrightText: string;

  // System Settings
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  primaryColor: string;
  accentColor: string;
  enableDarkMode: boolean;
  enableAnimations: boolean;
}

const defaultSettings: Settings = {
  // Branding
  schoolName: 'Ummez Academy',
  logo: '/ummez.png',
  favicon: '/ummez.png',
  tagline: 'Excellence in Education Since 1985',

  // SEO & Metadata
  metaTitle: 'Ummez Academy - School Management System',
  metaDescription: 'Modern school management system with admin panel',
  metaKeywords: 'school, education, academy, learning, students, teachers',

  // Contact Information
  address: '123 Education Street, Learning City, LC 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@royalacademy.edu',
  website: 'https://royalacademy.edu',

  // Social Media
  facebook: 'https://facebook.com/royalacademy',
  twitter: 'https://twitter.com/royalacademy',
  instagram: 'https://instagram.com/royalacademy',
  linkedin: 'https://linkedin.com/company/royalacademy',
  youtube: 'https://youtube.com/@royalacademy',

  // School Information
  establishedYear: '1985',
  principalName: 'Dr. Sarah Johnson',
  totalStudents: '1250+',
  totalTeachers: '85+',
  footerText: 'Empowering minds, shaping futures. Excellence in education since 1985.',
  copyrightText: '© 2024 Royal Academy. All rights reserved.',

  // System Settings
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
  language: 'English',
  primaryColor: '#1E3A8A',
  accentColor: '#F59E0B',
  enableDarkMode: true,
  enableAnimations: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      
      // Convert string values back to appropriate types
      const processedSettings: Settings = {
        ...defaultSettings,
        ...data,
        enableDarkMode: data.enableDarkMode === 'true',
        enableAnimations: data.enableAnimations === 'true',
      };

      setSettings(processedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings. Using default values.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save settings to API
  const saveSettings = async (newSettings: Settings) => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: newSettings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const result = await response.json();
      
      if (result.success) {
        setSettings(newSettings);
        toast({
          title: 'Success',
          description: 'Settings saved successfully',
        });
        return true;
      } else {
        throw new Error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update a single setting
  const updateSetting = (key: keyof Settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to default values.',
    });
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    updateSetting,
    saveSettings,
    resetSettings,
    fetchSettings,
  };
} 