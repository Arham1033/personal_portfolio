"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/lib/auth";
import toast from "react-hot-toast";
import Image from "next/image";
import { useActivity } from "@/context/ActivityContext";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { addActivity } = useActivity();
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
    addActivity("User registered");
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
    <div className="flex flex-col min-h-screen bg-[#030712]">
        <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 rounded-full bg-indigo-500/80 blur-[140px] " />

<div className="absolute bottom-[200] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/80 blur-[180px]" />

 <div className="shadow-xl md:p-8 mb-3 p-2 group
rounded-2xl
border md:mt-20 mt-5
border-white/10
w-50 max-w-md mx-auto sm:w-100
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

  <div className="flex flex-col md:gap-4 gap-2">
      <input
        type="text"
        placeholder="Name"
        className="w-full border border-slate-300 rounded-lg px-3 md:py-3 py-2 transition duration-300 focus:ring-2  outline-none
        text-white
        placeholder:text-slate-300
        focus:border-cyan-500
        focus:ring-indigo-500/30"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />

      <input
        type="email"
        placeholder="Email"
        className="p-2 w-full border border-slate-300 rounded-lg px-3 md:py-3 py-2 transition duration-300 focus:ring-2  outline-none
        text-white
placeholder:text-slate-300
focus:border-cyan-500
focus:ring-indigo-500/30"
value={email}
onChange={(e) => setEmail(e.target.value)}
        />


<div className="flex gap-2 w-full">
      <input
       type={showPassword ? "text" : "password"}
       placeholder="Password"
       className="p-2 w-full border border-slate-300 rounded-lg px-3 md:py-3 py-2 transition duration-300 focus:ring-2  outline-none
       text-white
       placeholder:text-slate-300
       focus:border-cyan-500
       focus:ring-indigo-500/30"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       />
      <button className="cursor-pointer invert bg-linear-to-br from-yellow-500/90 to-red-500/90 rounded-full md:px-3.5 px-3" type="button" onClick={togglePassword}>
    {showPassword ? (
      <Image width={28} height={28} src="/eye-show.svg" alt="hide" />
    ) : (
      <Image width={28} height={28} src="/eye-off.svg" alt="show" />
    )}
  </button>
        </div>


<div className="flex items-center gap-3">
  
  <label className="cursor-pointer bg-gray-500 text-white md:px-4 md:py-2
rounded-lg
bg-linear-to-r
from-indigo-500
to-cyan-500
px-2
py-1
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_25px_rgba(99,102,241,.4)] md:text-normal text-sm">
    Choose file (optional)

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      className="hidden"
      />
  </label>

  <span className="text-sm text-slate-300">
    {file ? file.name : "No file selected"}
  </span>

</div>

      <button
        onClick={handleRegister}
        className="
 rounded-xl
 bg-linear-to-r
 mx-auto
 from-indigo-500
 via-purple-500
 to-cyan-500
 px-6
 py-3
 mt-3
 font-semibold
 text-white
 transition-all
 duration-300
 hover:scale-105
 hover:shadow-[0_0_30px_rgba(99,102,241,.45)]
 active:scale-95
 cursor-pointer"
        >
        Register
      </button>
        </div>
          </div>
    </div>
  );
}