import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ FIX: unwrap params properly
    const { id } = await params;

    const user = await User.findById(id).select(
      "loginCount profileViews portfolioVisitors createdAt lastLogin name email profileImage"
    );

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ user });

  } catch (err) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}