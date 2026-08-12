import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return apiError('No file uploaded', 400, 'MISSING_FILE');
    }

    // Convert file buffer to Data URL or handle Supabase server upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return apiSuccess({
      url: dataUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
