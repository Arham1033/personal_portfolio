import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export async function PUT(req, context) {
  await connectDB();

  const { id } = await context.params;

  const body = await req.json();

  const updated = await Skill.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return Response.json(updated);
}

export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params;

  await Skill.findByIdAndDelete(id);

  return Response.json({
    message: "Deleted",
  });
}