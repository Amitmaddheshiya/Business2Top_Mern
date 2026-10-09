import dbConnect from '@/lib/dbConnect';
import Ad from '@/models/Ad';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const ad = await Ad.findByIdAndDelete(id);

    if (!ad) {
      return Response.json({ error: 'Ad not found' }, { status: 404 });
    }

    return Response.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
