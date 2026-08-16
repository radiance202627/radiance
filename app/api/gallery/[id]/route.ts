import { NextRequest, NextResponse } from 'next/server';
import {
  getGalleryAlbumById,
  updateGalleryAlbum,
  softDeleteGalleryAlbum,
  restoreGalleryAlbum,
  hardDeleteGalleryAlbum,
} from '@/lib/services/galleryService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const album = await getGalleryAlbumById(params.id);
    if (!album) {
      return NextResponse.json({ success: false, error: 'Gallery album not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: album });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateGalleryAlbum(params.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'permanent' or 'restore'

    if (action === 'permanent') {
      await hardDeleteGalleryAlbum(params.id);
      return NextResponse.json({ success: true, message: 'Permanently deleted' });
    } else if (action === 'restore') {
      const restored = await restoreGalleryAlbum(params.id);
      return NextResponse.json({ success: true, data: restored });
    } else {
      const softDeleted = await softDeleteGalleryAlbum(params.id);
      return NextResponse.json({ success: true, data: softDeleted });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
