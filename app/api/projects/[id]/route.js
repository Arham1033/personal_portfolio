import { connectDB } from "@/lib/mongodb";
import Project from "@/models/project";

export const runtime = "nodejs";

export async function DELETE(req, context) {
  const { id } = await context.params;

  await connectDB();

  await Project.findByIdAndDelete(id);

  return Response.json({
    message: "Project deleted",
  });
}

export async function PUT(req, context) {
  const { id } = await context.params;

  await connectDB();

  const body = await req.json();

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return Response.json(updatedProject);
}