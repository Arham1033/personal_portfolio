import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";

export async function GET() {
  await connectDB();

  const about = await About.find().sort({
    createdAt: 1,
  });

  return Response.json(about);
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const section = await About.create(body);

  return Response.json(section);
}