import React from 'react';

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const settingsResponse = await fetch(`/api/settings`, {
    cache: 'no-store',
  });

  if (!settingsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const settings = await settingsResponse.json();

  return {
    title: settings?.metaTitle,
    description: settings?.metaDescription,
    keywords: settings?.metaKeywords,
    icons: {
      icon: settings?.favicon,
    },
  };
}

function page({ children }: { children: React.ReactNode }) {
  return children;
}

export default page;
