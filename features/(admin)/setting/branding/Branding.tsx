import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// DropzoneInput component for file upload and URL input
interface DropzoneInputProps {
  id: string;
  value: string | StaticImageData;
  onChange: (value: string) => void;
  placeholder?: string;
  hideInputValue?: boolean;
}

function DropzoneInput(props: DropzoneInputProps) {
  const {
    id,
    value,
    onChange,
    placeholder,
    hideInputValue,
  } = props;

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const file = acceptedFiles[0];
        const reader = new window.FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (
            e.target &&
            typeof e.target.result === 'string'
          ) {
            onChange(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      multiple: false,
    });
  return (
    <div className="flex space-x-2 items-center">
      <div
        {...getRootProps()}
        className={`flex-1 border rounded p-2 cursor-pointer bg-muted/30 relative h-20 ${
          isDragActive ? 'ring-2 ring-primary' : ''
        }`}
        title="Upload image by drag & drop or click"
      >
        {value ? (
          <div className="flex items-center justify-center h-full">
            <Image
              src={value}
              alt="Preview"
              style={{
                objectFit: 'contain',
                width: 64,
                height: 64,
              }}
              width={500}
              height={500}
              className="rounded"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <input {...getInputProps()} id={id} />
      </div>
    </div>
  );
}

function Branding({
  settings,
  handleSettingChange,
}: {
  settings: {
    schoolName: string;
    tagline: string;
    logo: string;
    favicon: string;
  };
  handleSettingChange: (
    field: keyof typeof settings,
    value: string | boolean
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>School Branding</CardTitle>
          <CardDescription>
            Manage your school's visual identity and
            branding elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">
                  School Name
                </Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={e =>
                    handleSettingChange(
                      'schoolName',
                      e.target.value
                    )
                  }
                  placeholder="Enter school name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={e =>
                    handleSettingChange(
                      'tagline',
                      e.target.value
                    )
                  }
                  placeholder="Enter school tagline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <DropzoneInput
                  id="logo"
                  value={settings.logo}
                  onChange={(url: string) =>
                    handleSettingChange('logo', url)
                  }
                  placeholder="Upload or paste logo URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <DropzoneInput
                  id="favicon"
                  value={settings.favicon}
                  onChange={(url: string) =>
                    handleSettingChange('favicon', url)
                  }
                  placeholder="Upload or paste favicon URL"
                  hideInputValue
                />
                {settings.favicon && (
                  <div className="mt-2 flex items-center">
                    <img
                      src={settings.favicon}
                      alt="Favicon Preview"
                      style={{
                        objectFit: 'contain',
                        width: 32,
                        height: 32,
                      }}
                      className="rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Logo Preview</Label>
                <div className="mt-2 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12">
                      <img
                        src={settings.logo || '/ummez.png'}
                        alt="Logo Preview"
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                        }}
                        className="object-contain h-12 w-12"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {settings.schoolName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {settings.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Header Preview</Label>
                <div className="mt-2 p-4 border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="relative h-8 w-8">
                        <img
                          src={
                            settings.logo ||
                            '/placeholder.svg'
                          }
                          alt="Logo"
                          style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                          }}
                          className="object-contain h-8 w-8"
                        />
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {settings.schoolName}
                      </span>
                    </div>
                    <div className="hidden md:flex space-x-6 text-sm">
                      <span>Home</span>
                      <span>About</span>
                      <span>News</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Branding;
