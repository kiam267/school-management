import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorsThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/settings-context';

const inter = Inter({ subsets: ['latin'] });



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
