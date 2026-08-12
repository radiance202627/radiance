import { NextRequest } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/services/siteSettingsService';
import { siteSettingsSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return apiSuccess(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = siteSettingsSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const updated = await updateSiteSettings(validation.data as any);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
