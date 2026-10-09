import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { uniqueId: searchRegex }
      ];
    }

    // Use MongoDB sort for better performance
    let sortOptions = {};

    if (sort === 'highest') {
      sortOptions = { averageRating: -1, createdAt: -1 };
    } else if (sort === 'recent') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'trending') {
      sortOptions = { totalVotes: -1, createdAt: -1 };
    } else {
      // Default sort: manualRank (nulls last), then by rating/votes for auto ranking
      // Sort by: averageRating (desc), totalVotes (desc), createdAt (desc)
      sortOptions = { averageRating: -1, totalVotes: -1, createdAt: -1 };
    }

    const businesses = await Business.find(query).sort(sortOptions).lean();

    // Calculate automatic rank based on rating/votes
    const businessesWithRank = businesses.map((business, index) => {
      // If admin has set manualRank, use it
      if (business.manualRank !== null) {
        return { ...business, autoRank: business.manualRank };
      }
      // Otherwise, calculate automatic rank based on rating/votes (1-based index)
      return { ...business, autoRank: index + 1 };
    });

    return Response.json(businessesWithRank, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { ownerId } = body;

    if (!ownerId) {
      return Response.json({ error: 'Owner must be logged in to create a business' }, { status: 401 });
    }

    const BusinessOwner = (await import('@/models/BusinessOwner')).default;
    const owner = await BusinessOwner.findById(ownerId);

    if (!owner) {
      return Response.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Check if owner already has a business
    const existingBusiness = await Business.findOne({ ownerId });
    if (existingBusiness) {
      return Response.json({ error: 'You can only create one business per account' }, { status: 400 });
    }

    // Generate unique ID (6-character alphanumeric)
    const generateUniqueId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let uniqueId = '';
      for (let i = 0; i < 6; i++) {
        uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return uniqueId;
    };

    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = generateUniqueId();
      const existing = await Business.findOne({ uniqueId });
      if (!existing) {
        isUnique = true;
      }
    }

    const business = await Business.create({
      uniqueId,
      name: body.name,
      address: body.address,
      email: body.email || '',
      website: body.website || '',
      logo: body.logo || '',
      ownerId: ownerId,
      description: body.description || '',
      productsAndServices: body.productsAndServices || [],
      ratings: [], // Now stores objects with userId and rating
      averageRating: 0.0,
      totalVotes: 0,
      isVerified: false,
      manualRank: null,
      createdAt: Date.now(),
    });

    // Link business to owner
    owner.businessId = business._id;
    await owner.save();

    return Response.json(business, { status: 201 });
  } catch (error) {
    console.error('POST /api/businesses error:', error);
    return Response.json({ error: error.message, details: error.toString() }, { status: 500 });
  }
}
