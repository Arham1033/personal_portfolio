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

 const handleRegister = async () => {

  if (!name || !email || !password) {
      toast.error("Fill form first");
      return;
    }

  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setAuthUser(data.user);
    router.push("/"); // ✅ HERE
  toast.success("Registration successful!");
  }


};

const togglePassword = () => {
  setShowPassword(prev => !prev);
};

  return (
    <div className="flex flex-col gap-4 w-60 mx-auto mt-20 min-h-screen">
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


<div className="flex gap-2 w-70">
      <input
       type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="border p-2 rounded-md w-60"
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

      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer transition duration-300"
      >
        Register
      </button>
    </div>
  );
}