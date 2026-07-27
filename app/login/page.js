"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/lib/auth";
import toast from "react-hot-toast";
import Image from "next/image";
// missing this
import { useActivity } from "@/context/ActivityContext";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const { addActivity } = useActivity();

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
  addActivity("User logged in");
    
    } else{
       toast.error(data.message || "Invalid credentials");
    }
  };

  const togglePassword = () => {
  setShowPassword(prev => !prev);
};

  return (
    <div className="flex flex-col gap-4  min-h-screen bg-[#030712]">

         <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 rounded-full bg-cyan-500/80 blur-[140px] " />

<div className="absolute bottom-[200] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-indigo-500/80 blur-[180px]" />

       <div className="shadow-xl md:p-8 p-2 max-w-md mx-auto w-50 md:w-100 md:mt-20 mt-5 group
rounded-2xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]">

<h1 className="md:text-3xl text-xl font-bold text-center text-white mb-2">
  Welcome Back
</h1>

<p className="text-slate-300 text-center md:mb-8 mb-4">
  Sign in to manage your portfolio.
</p>


<div className="flex flex-col md:gap-4 gap-2">
      <input className="w-full border border-slate-300 rounded-lg px-3 py-2 md:py-3 transition duration-300 focus:ring-2 outline-none
text-white
placeholder:text-slate-300
focus:border-cyan-500
focus:ring-indigo-500/30
" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<div className="flex gap-2">
      <input className="w-full border border-slate-300 rounded-lg px-3 py-2 md:py-3 transition duration-300 focus:ring-2  outline-none
text-white
placeholder:text-slate-300
focus:border-cyan-500
focus:ring-indigo-500/30
" placeholder="Password" value={password}
type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} />
         <button className="cursor-pointer invert bg-linear-to-br from-yellow-500/90 to-red-500/90 rounded-full md:px-3.5 px-2.5" type="button" onClick={togglePassword}>
    {showPassword ? (
      <Image width={28} height={28} src="/eye-show.svg" alt="hide" />
    ) : (
      <Image width={28} height={28} src="/eye-off.svg" alt="show" />
    )}
  </button>
</div>

      <button
 className="
 rounded-xl
 bg-linear-to-r
 mx-auto
 from-indigo-500
 via-purple-500
 to-cyan-500
 px-6
 mt-3
 py-3
 font-semibold
 text-white
 transition-all
 duration-300
 hover:scale-105
 hover:shadow-[0_0_30px_rgba(99,102,241,.45)]
 active:scale-95
 cursor-pointer"
 onClick={handleLogin}
>
  Login
</button>
  </div>
      
      </div>
    </div>
  );
}