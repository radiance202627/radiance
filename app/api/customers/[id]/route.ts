import { NextRequest } from 'next/server';
import { getCustomerById, updateCustomer, deleteCustomer } from '@/lib/services/customerService';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await getCustomerById(params.id);

    if (!customer) {
      return apiError('Customer not found', 404, 'NOT_FOUND');
    }

    return apiSuccess(customer);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateCustomer(params.id, body);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteCustomer(params.id);
    return apiSuccess({ message: 'Customer deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
