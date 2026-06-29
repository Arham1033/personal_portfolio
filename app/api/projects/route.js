import { connectDB } from "@/lib/mongodb";
import project from "@/models/project";
import Notification from "@/models/Notification";

// GET all projects
export async function GET() {
  await connectDB();
  const projects = await project.find().sort({ createdAt: -1 });
  return Response.json(projects);
}

// CREATE project
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const newProject = await project.create(body);

  // Create notification
  await Notification.create({
    message: `Project "${newProject.title}" created successfully`,
    type: "success",
  });

  return Response.json(newProject);
}