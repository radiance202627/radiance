import { NextRequest, NextResponse } from 'next/server';
import {
  getBlogPostById,
  updateBlogPost,
  softDeleteBlogPost,
  restoreBlogPost,
  hardDeleteBlogPost,
} from '@/lib/services/blogService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getBlogPostById(params.id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
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
    const updated = await updateBlogPost(params.id, body);
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
      await hardDeleteBlogPost(params.id);
      return NextResponse.json({ success: true, message: 'Permanently deleted' });
    } else if (action === 'restore') {
      const restored = await restoreBlogPost(params.id);
      return NextResponse.json({ success: true, data: restored });
    } else {
      const softDeleted = await softDeleteBlogPost(params.id);
      return NextResponse.json({ success: true, data: softDeleted });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
