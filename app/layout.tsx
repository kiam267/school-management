import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ColorsThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Royal Academy - School Management System',
  description:
    'Modern school management system with admin panel',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ColorsThemeProvider
          // attribute="class"
          // enableSystem
          // disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ColorsThemeProvider>
      </body>
    </html>
  );
}
