import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return Response.json({ success: true, email: admin.email });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
