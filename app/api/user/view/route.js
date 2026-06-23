import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = await req.json();

    await User.findByIdAndUpdate(
      userId,
      { $inc: { profileViews: 1 } }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}