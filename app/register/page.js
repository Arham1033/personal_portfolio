"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/lib/auth";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [file, setFile] = useState(null);

 const handleRegister = async () => {
  if (!name || !email || !password) {
    toast.error("Fill form first");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    // ✅ FIX HERE
    if (file instanceof File) {
      formData.append("profileImage", file);
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Registration failed");
      return;
    }

    setAuthUser(data.user);
    toast.success("Registration successful!");
    router.push("/");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

const togglePassword = () => {
  setShowPassword(prev => !prev);
};

  return (
    <div className="flex w-45 flex-col gap-4 md:w-60 mx-auto md:mt-20 mt-10 min-h-screen">
      <input
        type="text"
        placeholder="Name"
        className="border p-2 rounded-md"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


<div className="flex gap-2 md:w-70 w-55">
      <input
       type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="border p-2 rounded-md md:w-60 w-40"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      <button type="button" onClick={togglePassword}>
    {showPassword ? (
      <Image width={25} height={25} src="/eye-show.svg" alt="hide" />
    ) : (
      <Image width={25} height={25} src="/eye-off.svg" alt="show" />
    )}
  </button>
        </div>


<div className="flex items-center gap-3">
  
  <label className="cursor-pointer bg-gray-500 text-white md:px-4 px-2 md:py-2 py-1 rounded">
    Choose file (optional)

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      className="hidden"
    />
  </label>

  <span className="text-sm text-gray-600">
    {file ? file.name : "No file selected"}
  </span>

</div>

      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer transition duration-300"
      >
        Register
      </button>
    </div>
  );
}