import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const notification = await Notification.create({
      message: body.message,
      type: body.type,
    });

    return NextResponse.json(notification, {
      status: 201,
    });
  } catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      error: error.message,
    },
    {
      status: 500,
    }
  );
}
}