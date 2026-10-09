import dbConnect from '@/lib/dbConnect';
import Ad from '@/models/Ad';

export async function GET(request) {
  try {
    await dbConnect();

    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    return Response.json(ads, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
    const { brandName, imageUrl, linkUrl } = body;

    const ad = await Ad.create({
      brandName,
      imageUrl,
      linkUrl,
      isActive: true,
    });

    return Response.json(ad, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
