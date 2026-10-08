import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return Response.json({ message: 'Admin already exists', email: existingAdmin.email }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Create admin with provided credentials
    const admin = await Admin.create({
      email,
      password,
    });

    return Response.json({ 
      message: 'Admin created successfully', 
      email: admin.email 
    }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request) {
  try {
    await dbConnect();

    const adminCount = await Admin.countDocuments();
    const admins = await Admin.find({}, { password: 0 }); // Don't return passwords

    return Response.json({ 
      count: adminCount, 
      admins 
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
