import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import type React from 'react';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
