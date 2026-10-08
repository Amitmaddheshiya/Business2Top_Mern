import dbConnect from '@/lib/dbConnect';
import BusinessOwner from '@/models/BusinessOwner';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Check if owner already exists
    const existingOwner = await BusinessOwner.findOne({ email });
    if (existingOwner) {
      return Response.json({ error: 'Business owner already exists' }, { status: 400 });
    }

    // Create business owner
    const owner = await BusinessOwner.create({
      email,
      password,
      businessId: null,
    });

    return Response.json({ 
      message: 'Business owner registered successfully', 
      email: owner.email 
    }, { status: 201 });
  } catch (error) {
    console.error('Business owner registration error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
