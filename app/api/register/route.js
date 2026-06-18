import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("profileImage");

    if (!name || !email || !password) {
      return Response.json({ message: "Fill form first" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    let imageUrl = "/default-avatar.jpg";

    // ✅ HANDLE IMAGE UPLOAD
    if (file && typeof file === "object" && file.name) {
      await mkdir(path.join(process.cwd(), "public/uploads"), {
        recursive: true,
      });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
    });

    return Response.json({
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name,
        email,
        profileImage: imageUrl,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}