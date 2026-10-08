import dbConnect from '@/lib/dbConnect';
import BusinessOwner from '@/models/BusinessOwner';
import Business from '@/models/Business';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();
    const owner = await BusinessOwner.findOne({ email, password }).populate('businessId');

    if (!owner) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return Response.json({ 
      success: true, 
      email: owner.email,
      ownerId: owner._id,
      businessId: owner.businessId,
      business: owner.businessId
    });
  } catch (error) {
    console.error('Business owner login error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
