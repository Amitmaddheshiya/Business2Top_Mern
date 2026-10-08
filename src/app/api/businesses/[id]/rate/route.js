import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = params;
    const { rating } = body;

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const business = await Business.findById(id);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    // Add rating (simplified - just store the rating value)
    business.ratings.push(rating);
    business.totalVotes += 1;

    // Calculate new average rating
    const sum = business.ratings.reduce((acc, curr) => acc + curr, 0);
    business.averageRating = parseFloat((sum / business.ratings.length).toFixed(1));

    await business.save();

    return Response.json(business);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
