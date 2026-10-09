import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const business = await Business.findById(id);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    return Response.json(business);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = params;

    const business = await Business.findByIdAndUpdate(
      id,
      {
        name: body.name,
        contactNumber: body.contactNumber,
        whatsappNumber: body.whatsappNumber,
        address: body.address,
        email: body.email,
        website: body.website,
        logo: body.logo,
        description: body.description,
        productsAndServices: body.productsAndServices,
        isVerified: body.isVerified,
        manualRank: body.manualRank,
        hasCrown: body.hasCrown,
      },
      { new: true }
    );

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    return Response.json(business);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const business = await Business.findByIdAndDelete(id);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    return Response.json({ message: 'Business deleted successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
