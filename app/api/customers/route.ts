import { NextRequest } from 'next/server';
import { getAllCustomers, findOrCreateCustomer } from '@/lib/services/customerService';
import { customerSchema } from '@/lib/validations/schemas';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const customers = await getAllCustomers();
    return apiSuccess(customers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = customerSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Validation failed', 400, 'INVALID_INPUT', validation.error.format());
    }

    const customer = await findOrCreateCustomer(validation.data);
    return apiSuccess(customer, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
