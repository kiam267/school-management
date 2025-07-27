import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorsThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/settings-context';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:3000';

  const settingsResponse = await fetch(
    `${baseUrl}/api/settings`,
    {
      cache: 'no-store',
    }
  );

  if (!settingsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const settings = await settingsResponse.json();
  console.log(settings);

  return {
    title: settings?.metaTitle,
    description: settings?.metaDescription,
    keywords: settings?.metaKeywords,
    icons: {
      icon: settings?.favicon,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SettingsProvider>
        <body className={inter.className}>
          <ColorsThemeProvider>
            {children}
            <Toaster />
          </ColorsThemeProvider>
        </body>
      </SettingsProvider>
    </html>
  );
}
