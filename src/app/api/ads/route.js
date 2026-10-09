import dbConnect from '@/lib/dbConnect';
import Ad from '@/models/Ad';

export async function GET(request) {
  try {
    await dbConnect();

    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    // Ensure offerText and subtitle are always present
    const adsWithDefaults = ads.map(ad => ({
      ...ad,
      offerText: ad.offerText || '',
      subtitle: ad.subtitle || '',
    }));

    return Response.json(adsWithDefaults);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { brandName, imageUrl, linkUrl, offerText, subtitle } = body;

    const ad = await Ad.create({
      brandName,
      imageUrl,
      linkUrl,
      offerText: offerText || '',
      subtitle: subtitle || '',
      isActive: true,
    });

    return Response.json(ad, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
