import { NextResponse } from 'next/server';
import type { PutBlobResult } from '@vercel/blob';
import { put } from '@vercel/blob';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    // Try to get filename from FormData if available
    let fileName = 'upload.jpg';
    if ('name' in file) {
      // @ts-ignore
      fileName = file.name;
    } else {
      // Try to get filename from FormData
      const entries = Array.from(formData.entries());
      for (const [key, value] of entries) {
        if (
          key === 'file' &&
          value &&
          typeof value === 'object' &&
          'name' in value
        ) {
          // @ts-ignore
          fileName = value.name;
        }
      }
    }
    const uploaded = await put(fileName, file, {
      access: 'public',
      allowOverwrite: true,
    });
    return NextResponse.json({ url: uploaded.url });
  } catch (err) {
    return NextResponse.json(
      { error: 'Upload failed', details: String(err) },
      { status: 500 }
    );
  }
}
