'use client';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import Image from 'next/image';

export function Footer() {
  const { settings, loading } = useSettings();

  return (
    <footer className="bg-muted/50 border-t ">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {settings.logo &&
              settings.logo !== '/ummez.png' ? (
                <div className="relative h-6 w-6">
                  <Image
                    src={settings.logo}
                    alt={
                      settings.schoolName || 'School Logo'
                    }
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              ) : (
                <GraduationCap className="h-6 w-6 text-primary" />
              )}
              <span className="text-lg font-bold text-primary">
                {loading
                  ? 'Loading...'
                  : settings.schoolName || 'Royal Academy'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {settings.footerText ||
                'Empowering minds, shaping futures. Excellence in education since 1985.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Contact Info
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {settings.address ||
                    '123 Education Street, Learning City, LC 12345'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>
                  {settings.phone || '+1 (555) 123-4567'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>
                  {settings.email ||
                    'info@royalacademy.edu'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/news"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Latest News
              </Link>
              <Link
                href="/admin"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {settings.facebook && (
                <Link
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings.twitter && (
                <Link
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {settings.instagram && (
                <Link
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {settings.linkedin && (
                <Link
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
              {settings.youtube && (
                <Link
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            {settings.copyrightText ||
              '© 2024 Royal Academy. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
