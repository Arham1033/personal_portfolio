import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
  await connectDB();

  const contact = await Contact.findOne();

  return Response.json(contact);
}


export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const exist = await Contact.findOne();

  if (exist) {
    const updated = await Contact.findByIdAndUpdate(
      exist._id,
      body,
      { new: true }
    );

    return Response.json(updated);
  }

  const created = await Contact.create(body);

  return Response.json(created);
}