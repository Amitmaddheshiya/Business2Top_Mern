import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'amitnextview@gmail.com' });

    if (existingAdmin) {
      return Response.json({ message: 'Admin already exists', email: existingAdmin.email });
    }

    // Create default admin
    const admin = await Admin.create({
      email: 'amitnextview@gmail.com',
      password: 'amit@1122',
    });

    return Response.json({ 
      message: 'Admin created successfully', 
      email: admin.email 
    }, { status: 201 });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
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
