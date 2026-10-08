import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';
import User from '@/models/User';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = params;
    const { rating, userId } = body;

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ error: 'User must be logged in to rate' }, { status: 401 });
    }

    const business = await Business.findById(id);
    const user = await User.findById(userId);

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already rated this business
    if (user.ratedBusinesses.includes(id)) {
      return Response.json({ error: 'You have already rated this business' }, { status: 400 });
    }

    business.ratings.push(rating);
    business.totalVotes += 1;

    // Calculate new average rating
    const sum = business.ratings.reduce((acc, curr) => acc + curr, 0);
    business.averageRating = parseFloat((sum / business.ratings.length).toFixed(1));

    await business.save();

    // Add business to user's rated businesses
    user.ratedBusinesses.push(id);
    await user.save();

    return Response.json(business);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
