"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/lib/auth";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Fill form first");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

  

    if (res.ok) {
      setAuthUser(data.user);   // 🔥 THIS IS REQUIRED
      router.push("/");
toast.success("Login successfully")
    
    } else{
       toast.error(data.message || "Invalid credentials");
    }
  };

  const togglePassword = () => {
  setShowPassword(prev => !prev);
};

  return (
    <div className="flex flex-col gap-4 mx-auto md:w-100 w-50 md:mt-20 mt-10 min-h-screen ">
      <input className="md:w-60 w-55 bg-white border rounded-md p-2 hover:ring-1 cursor-pointer transition duration-300" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<div className="flex gap-2 md:w-70 w-55">
      <input className="md:w-60 w-45 bg-white border rounded-md p-2 hover:ring-1 cursor-pointer transition duration-300" placeholder="Password" value={password}
       type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} />
         <button type="button" onClick={togglePassword}>
    {showPassword ? (
      <Image width={25} height={25} src="/eye-show.svg" alt="hide" />
    ) : (
      <Image width={25} height={25} src="/eye-off.svg" alt="show" />
    )}
  </button>
</div>

      <button className="bg-green-500 md:w-60 w-50 rounded-md p-2 cursor-pointer transition duration-300 hover:bg-green-600" onClick={handleLogin}>Login</button>
      
    </div>
  );
}