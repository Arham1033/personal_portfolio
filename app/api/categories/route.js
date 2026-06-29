import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Notification from "@/models/Notification";

export async function GET() {
  await connectDB();

  const categories = await Category.find().sort({
    createdAt: -1,
  });

  return Response.json(categories);
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  if (!body.name) {
    return Response.json(
      {
        message: "Category name is required",
      },
      {
        status: 400,
      }
    );
  }

  const category = await Category.create({
    name: body.name,
  });

  await Notification.create({
    message: `Category "${category.name}" added`,
    type: "success",
  });

  return Response.json(category);
}