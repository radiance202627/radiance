import { NextRequest, NextResponse } from 'next/server';
import { getGalleryAlbums, createGalleryAlbum } from '@/lib/services/galleryService';
import { GalleryStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as GalleryStatus | 'ALL' | 'TRASH') || 'PUBLISHED';
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const result = await getGalleryAlbums({
      status,
      category,
      search,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[API_GALLERY_GET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gallery albums' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Album title is required' },
        { status: 400 }
      );
    }

    const album = await createGalleryAlbum(body);
    return NextResponse.json({ success: true, data: album }, { status: 201 });
  } catch (error: any) {
    console.error('[API_GALLERY_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gallery album' },
      { status: 500 }
    );
  }
}
