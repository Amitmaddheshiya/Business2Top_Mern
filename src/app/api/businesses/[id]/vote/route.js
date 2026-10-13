import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const business = await Business.findById(id);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    // Increment vote count
    business.totalVotes += 1;

    await business.save();

    return Response.json(business);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
