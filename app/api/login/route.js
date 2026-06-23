import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Fill form first" },
        { status: 400 }
      )
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "Wrong credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    
    if (!isMatch) {
      return Response.json(
        { message: "Wrong credentials" },
        { status: 401 }
      );
    }
    user.loginCount += 1;
user.lastLogin = new Date();

await user.save();

    return Response.json({
      message: "Login successful",
      user: {
         _id: user._id,        // 🔥 REQUIRED
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || "/default-avatar.jpg",
    loginCount: user.loginCount,
  profileViews: user.profileViews,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    return Response.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}