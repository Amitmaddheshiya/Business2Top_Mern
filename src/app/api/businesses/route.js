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
        { description: searchRegex },
        { productsAndServices: { $in: [searchRegex] } },
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
      // Default sort: manualRank (nulls last), then averageRating, then createdAt
      sortOptions = { manualRank: 1, averageRating: -1, createdAt: -1 };
    }

    const businesses = await Business.find(query).sort(sortOptions).lean();

    return Response.json(businesses, {
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
    if (owner.businessId) {
      return Response.json({ error: 'You can only create one business per account' }, { status: 400 });
    }

    const business = await Business.create({
      name: body.name,
      contactNumber: body.contactNumber,
      whatsappNumber: body.whatsappNumber,
      address: body.address,
      email: body.email || '',
      website: body.website || '',
      logo: body.logo || '',
      ownerId: ownerId,
      description: body.description || '',
      productsAndServices: body.productsAndServices || [],
      ratings: [],
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
