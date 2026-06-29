import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Notification from "@/models/Notification";

export async function PUT(req, context) {
  await connectDB();

  const { id } = await context.params;

  const body = await req.json();

  const updated = await Category.findByIdAndUpdate(
    id,
    {
      name: body.name,
    },
    {
      new: true,
    }
  );

  if (!updated) {
    return Response.json(
      {
        message: "Category not found",
      },
      {
        status: 404,
      }
    );
  }

  await Notification.create({
    message: `Category "${updated.name}" updated`,
    type: "info",
  });

  return Response.json(updated);
}

export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params;

  const category = await Category.findById(id);

  if (!category) {
    return Response.json(
      {
        message: "Category not found",
      },
      {
        status: 404,
      }
    );
  }

  await Category.findByIdAndDelete(id);

  await Notification.create({
    message: `Category "${category.name}" deleted`,
    type: "error",
  });

  return Response.json({
    message: "Category deleted",
  });
}