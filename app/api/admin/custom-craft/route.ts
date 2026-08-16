import { NextRequest, NextResponse } from 'next/server';
import { getCustomCraftRequests } from '@/lib/services/customCraftService';
import { CustomCraftStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as CustomCraftStatus | 'ALL' | 'TRASH') || 'ALL';
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const result = await getCustomCraftRequests({
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[ADMIN_CUSTOM_CRAFT_GET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Custom Craft requests' },
      { status: 500 }
    );
  }
}
