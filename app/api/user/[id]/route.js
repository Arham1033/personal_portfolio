import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-password");

    return Response.json({ user });
  } catch (err) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
}