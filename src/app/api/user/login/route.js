import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();
    const user = await User.findOne({ email, password });

    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return Response.json({ 
      success: true, 
      email: user.email,
      userId: user._id,
      ratedBusinesses: user.ratedBusinesses
    });
  } catch (error) {
    console.error('User login error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
