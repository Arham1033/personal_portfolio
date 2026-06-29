import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export async function GET() {
  await connectDB();

  const skills = await Skill.find().sort({
    createdAt: -1,
  });

  return Response.json(skills);
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const skill = await Skill.create(body);

  return Response.json(skill);
}