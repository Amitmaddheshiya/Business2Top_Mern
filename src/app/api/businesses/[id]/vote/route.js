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

    console.log('Before increment:', business.totalVotes);

    // Increment vote count
    business.totalVotes += 1;

    await business.save();

    console.log('After increment:', business.totalVotes);

    return Response.json({ totalVotes: business.totalVotes, _id: business._id });
  } catch (error) {
    console.error('Error voting:', error);
    return Response.json({ error: error.message, details: error.toString() }, { status: 500 });
  }
}
