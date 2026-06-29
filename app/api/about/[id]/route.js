import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";

export async function PUT(req, context) {
  await connectDB();

  const { id } = await context.params;

  const body = await req.json();

  const updated = await About.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
    }
  );

  return Response.json(updated);
}

export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params;

  await About.findByIdAndDelete(id);

  return Response.json({
    message: "Deleted",
  });
}