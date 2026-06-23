import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("profileImage");

    if (!name || !email || !password) {
      return Response.json(
        { message: "Fill form first" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    let imageUrl = "/default-avatar.jpg";

    // ✅ CLOUDINARY UPLOAD (NEW)
    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64Image = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${base64Image}`;

      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "profile_images",
      });

      imageUrl = uploadResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
      loginCount: 1,
      lastLogin: new Date(),
    });

    return Response.json({
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name,
        email,
        profileImage: imageUrl,
        loginCount: newUser.loginCount,
        profileViews: newUser.profileViews,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin,
      },

    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}