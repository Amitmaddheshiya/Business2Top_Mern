import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { count } = body;

    if (!count || count < 1) {
      return Response.json({ error: 'Invalid count' }, { status: 400 });
    }

    const business = await Business.findById(id);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    // Add fake 5-star ratings
    const fakeRatings = Array(count).fill(5);
    business.ratings.push(...fakeRatings);
    business.totalVotes += count;

    // Recalculate average rating
    const totalRating = business.ratings.reduce((sum, rating) => sum + rating, 0);
    business.averageRating = totalRating / business.ratings.length;

    await business.save();

    return Response.json({
      message: `Successfully added ${count} fake ratings`,
      business: {
        averageRating: business.averageRating,
        totalVotes: business.totalVotes,
      },
    });
  } catch (error) {
    console.error('Error adding fake ratings:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
