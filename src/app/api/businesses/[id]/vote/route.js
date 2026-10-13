import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    console.log('Vote request for business ID:', id);

    const business = await Business.findById(id);

    if (!business) {
      console.log('Business not found:', id);
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    console.log('Current votes:', business.totalVotes);

    // Increment vote count
    business.totalVotes += 1;

    await business.save();

    console.log('Updated votes:', business.totalVotes);

    return Response.json(business);
  } catch (error) {
    console.error('Vote error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
