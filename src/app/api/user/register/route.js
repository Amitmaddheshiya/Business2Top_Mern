import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      ratedBusinesses: [],
    });

    return Response.json({ 
      message: 'User registered successfully', 
      email: user.email 
    }, { status: 201 });
  } catch (error) {
    console.error('User registration error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
