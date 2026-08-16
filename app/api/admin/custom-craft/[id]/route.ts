import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomCraftRequestById,
  updateCustomCraftStatus,
  softDeleteCustomCraftRequest,
  restoreCustomCraftRequest,
  hardDeleteCustomCraftRequest,
} from '@/lib/services/customCraftService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getCustomCraftRequestById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Custom Craft request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
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
    const updated = await updateCustomCraftStatus(params.id, body.status, body.internalNotes);
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
      await hardDeleteCustomCraftRequest(params.id);
      return NextResponse.json({ success: true, message: 'Permanently deleted' });
    } else if (action === 'restore') {
      const restored = await restoreCustomCraftRequest(params.id);
      return NextResponse.json({ success: true, data: restored });
    } else {
      const softDeleted = await softDeleteCustomCraftRequest(params.id);
      return NextResponse.json({ success: true, data: softDeleted });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
