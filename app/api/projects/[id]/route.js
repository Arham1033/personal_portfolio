import { connectDB } from "@/lib/mongodb";
import Project from "@/models/project";
import Notification from "@/models/Notification";

export const runtime = "nodejs";

export async function DELETE(req, context) {
  const { id } = await context.params;

  await connectDB();

  const deletedProject = await Project.findByIdAndDelete(id);

  await Notification.create({
    message: `Project "${deletedProject.title}" deleted`,
    type: "warning",
  });

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

  await Notification.create({
    message: `Project "${updatedProject.title}" updated successfully`,
    type: "info",
  });

  return Response.json(updatedProject);
}