import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("UPDATE BODY:", body);

    const { _id, name, profileImage } = body;

    if (!_id) {
      return Response.json(
        { message: "Missing user id" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, profileImage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      user: updatedUser,
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}