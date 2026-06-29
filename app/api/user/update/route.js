import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Notification from "@/models/Notification";


export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      _id,
      name,
      profileImage,
      oldPassword,
      newPassword,
    } = body;

    if (!_id) {
      return Response.json(
        { message: "Missing user id" },
        { status: 400 }
      );
    }

    const user = await User.findById(_id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.name = name;
    user.profileImage = profileImage;

    // Password change
    if (newPassword) {
      if (!oldPassword) {
        return Response.json(
          { message: "Enter old password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isMatch) {
        return Response.json(
          { message: "Old password is incorrect" },
          { status: 400 }
        );
      }

      user.password = await bcrypt.hash(
        newPassword,
        10
      );
    }

    await user.save();

    await Notification.create({
  message: "Profile updated successfully",
  type: "info",
});

    return Response.json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
            loginCount: user.loginCount,
  profileViews: user.profileViews,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
      },
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}