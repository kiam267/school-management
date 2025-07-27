// lib/get-settings.ts
export async function getSettings() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/settings`); // or DB call
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}
