import { NextRequest, NextResponse } from 'next/server';
import { createCustomCraftRequest } from '@/lib/services/customCraftService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields check
    if (!body.name || !body.email || !body.contactNumber || !body.city || !body.state || !body.country || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields marked with (*)' },
        { status: 400 }
      );
    }

    const customCraft = await createCustomCraftRequest({
      name: body.name,
      companyName: body.companyName,
      email: body.email,
      contactNumber: body.contactNumber,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      zipCode: body.zipCode,
      purpose: body.purpose,
      customPurpose: body.customPurpose,
      metals: body.metals || [],
      customMetal: body.customMetal,
      finishType: body.finishType || 'Standard Finish',
      selectedFinish: body.selectedFinish,
      expectedQuantity: body.expectedQuantity,
      deliveryDate: body.deliveryDate,
      description: body.description,
      attachments: body.attachments || [],
    });

    return NextResponse.json(
      {
        success: true,
        data: customCraft,
        referenceNo: customCraft.referenceNo,
        message: 'Your Custom Craft request has been successfully submitted.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[CUSTOM_CRAFT_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit Custom Craft request' },
      { status: 500 }
    );
  }
}
