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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  Upload,
  RotateCcw,
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Branding from '@/features/(admin)/setting/branding/Branding';
import { useSettings } from '@/contexts/settings-context';

import logo from '@/public/ummez .png';

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('branding');
  const { toast } = useToast();
  const {
    settings,
    loading,
    saving,
    updateSetting,
    saveSettings,
    resetSettings,
  } = useSettings();

  // Check if coming from theme redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.search
    );
    if (urlParams.get('tab') === 'system') {
      setActiveTab('system');
    }
  }, []);

  const handleSettingChange = (
    field: keyof typeof settings,
    value: string | boolean
  ) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    const success = await saveSettings(settings);
    if (success) {
      toast({
        title: 'Settings Saved',
        description:
          'All settings have been updated successfully.',
      });
    }
  };

  const handleReset = () => {
    resetSettings();
  };

  const tabs = [
    {
      id: 'branding',
      label: 'Branding',
      icon: GraduationCap,
    },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'school', label: 'School Info', icon: Settings },
    { id: 'system', label: 'System', icon: Settings },
      ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading settings...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage school branding, contact information, and
            system settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={
                activeTab === tab.id ? 'default' : 'ghost'
              }
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <Branding
            handleSettingChange={handleSettingChange}
            settings={settings}
          />
        )}
        {/* SEO & Metadata Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Metadata</CardTitle>
                <CardDescription>
                  Optimize your website for search engines
                  and social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={e =>
                      handleSettingChange(
                        'metaTitle',
                        e.target.value
                      )
                    }
                    placeholder="Enter meta title (recommended: 50-60 characters)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Current length:{' '}
                    {settings.metaTitle.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.metaDescription}
                    onChange={e =>
                      handleSettingChange(
                        'metaDescription',
                        e.target.value
                      )
                    }
                    placeholder="Enter meta description (recommended: 150-160 characters)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Current length:{' '}
                    {settings.metaDescription.length}{' '}
                    characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">
                    Meta Keywords
                  </Label>
                  <Input
                    id="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={e =>
                      handleSettingChange(
                        'metaKeywords',
                        e.target.value
                      )
                    }
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">
                    Search Engine Preview
                  </h4>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">
                        {settings.metaTitle}
                      </h3>
                      <p className="text-sm text-green-600">
                        {settings.website}
                      </p>
                      <p className="text-sm text-gray-600">
                        {settings.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Manage school contact details displayed on
                  the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={e =>
                        handleSettingChange(
                          'address',
                          e.target.value
                        )
                      }
                      placeholder="Enter school address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={e =>
                          handleSettingChange(
                            'phone',
                            e.target.value
                          )
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={e =>
                          handleSettingChange(
                            'email',
                            e.target.value
                          )
                        }
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={e =>
                          handleSettingChange(
                            'website',
                            e.target.value
                          )
                        }
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">
                    Contact Preview
                  </h4>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {settings.address}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {settings.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {settings.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Manage your school's social media presence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">
                      Facebook URL
                    </Label>
                    <Input
                      id="facebook"
                      value={settings.facebook}
                      onChange={e =>
                        handleSettingChange(
                          'facebook',
                          e.target.value
                        )
                      }
                      placeholder="https://facebook.com/yourschool"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">
                      Twitter URL
                    </Label>
                    <Input
                      id="twitter"
                      value={settings.twitter}
                      onChange={e =>
                        handleSettingChange(
                          'twitter',
                          e.target.value
                        )
                      }
                      placeholder="https://twitter.com/yourschool"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">
                      Instagram URL
                    </Label>
                    <Input
                      id="instagram"
                      value={settings.instagram}
                      onChange={e =>
                        handleSettingChange(
                          'instagram',
                          e.target.value
                        )
                      }
                      placeholder="https://instagram.com/yourschool"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">
                      LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin"
                      value={settings.linkedin}
                      onChange={e =>
                        handleSettingChange(
                          'linkedin',
                          e.target.value
                        )
                      }
                      placeholder="https://linkedin.com/company/yourschool"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">
                      YouTube URL
                    </Label>
                    <Input
                      id="youtube"
                      value={settings.youtube}
                      onChange={e =>
                        handleSettingChange(
                          'youtube',
                          e.target.value
                        )
                      }
                      placeholder="https://youtube.com/@yourschool"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* School Information Tab */}
        {activeTab === 'school' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>
                  Basic information about your school
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">
                      Established Year
                    </Label>
                    <Input
                      id="establishedYear"
                      value={settings.establishedYear}
                      onChange={e =>
                        handleSettingChange(
                          'establishedYear',
                          e.target.value
                        )
                      }
                      placeholder="Enter establishment year"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principalName">
                      Principal Name
                    </Label>
                    <Input
                      id="principalName"
                      value={settings.principalName}
                      onChange={e =>
                        handleSettingChange(
                          'principalName',
                          e.target.value
                        )
                      }
                      placeholder="Enter principal name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalStudents">
                      Total Students
                    </Label>
                    <Input
                      id="totalStudents"
                      value={settings.totalStudents}
                      onChange={e =>
                        handleSettingChange(
                          'totalStudents',
                          e.target.value
                        )
                      }
                      placeholder="e.g., 1250+"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalTeachers">
                      Total Teachers
                    </Label>
                    <Input
                      id="totalTeachers"
                      value={settings.totalTeachers}
                      onChange={e =>
                        handleSettingChange(
                          'totalTeachers',
                          e.target.value
                        )
                      }
                      placeholder="e.g., 85+"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerText">
                      Footer Description
                    </Label>
                    <Textarea
                      id="footerText"
                      value={settings.footerText}
                      onChange={e =>
                        handleSettingChange(
                          'footerText',
                          e.target.value
                        )
                      }
                      placeholder="Enter footer description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copyrightText">
                      Copyright Text
                    </Label>
                    <Input
                      id="copyrightText"
                      value={settings.copyrightText}
                      onChange={e =>
                        handleSettingChange(
                          'copyrightText',
                          e.target.value
                        )
                      }
                      placeholder="Enter copyright text"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system preferences and regional
                  settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      Timezone
                    </Label>
                    <Input
                      id="timezone"
                      value={settings.timezone}
                      onChange={e =>
                        handleSettingChange(
                          'timezone',
                          e.target.value
                        )
                      }
                      placeholder="e.g., America/New_York"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">
                      Date Format
                    </Label>
                    <Input
                      id="dateFormat"
                      value={settings.dateFormat}
                      onChange={e =>
                        handleSettingChange(
                          'dateFormat',
                          e.target.value
                        )
                      }
                      placeholder="e.g., MM/DD/YYYY"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      Currency
                    </Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={e =>
                        handleSettingChange(
                          'currency',
                          e.target.value
                        )
                      }
                      placeholder="e.g., USD"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">
                      Language
                    </Label>
                    <Input
                      id="language"
                      value={settings.language}
                      onChange={e =>
                        handleSettingChange(
                          'language',
                          e.target.value
                        )
                      }
                      placeholder="e.g., English"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">
                    Theme Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">
                        Primary Color
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={e =>
                            handleSettingChange(
                              'primaryColor',
                              e.target.value
                            )
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={settings.primaryColor}
                          onChange={e =>
                            handleSettingChange(
                              'primaryColor',
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accentColor">
                        Accent Color
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={settings.accentColor}
                          onChange={e =>
                            handleSettingChange(
                              'accentColor',
                              e.target.value
                            )
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={settings.accentColor}
                          onChange={e =>
                            handleSettingChange(
                              'accentColor',
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableDarkMode"
                        checked={settings.enableDarkMode}
                        onChange={e =>
                          handleSettingChange(
                            'enableDarkMode',
                            e.target.checked
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="enableDarkMode">
                        Enable Dark Mode
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableAnimations"
                        checked={settings.enableAnimations}
                        onChange={e =>
                          handleSettingChange(
                            'enableAnimations',
                            e.target.checked
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="enableAnimations">
                        Enable Animations
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
            {saving ? 'Saving...' : 'Save All Settings'}
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
