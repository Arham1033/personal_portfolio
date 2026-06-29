import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function PATCH() {
  try {
    await connectDB();

    await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}