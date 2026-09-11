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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addActivity } = useActivity();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Fill form first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Automatically log the user in after registration
        setAuthUser(data.user);

        addActivity("User registered");

        toast.success("Registration successful");

        router.push("/");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-4 bg-[#030712] sm:pl-0 pl-10 py-10">

      {/* Background glow */}
      <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 rounded-full bg-cyan-500/80 blur-[140px]" />

      <div className="absolute bottom-[200px] right-[-100px] h-110 w-112.5 -translate-x-1/2 rounded-full bg-indigo-500/80 blur-[180px]" />

      {/* Register Card */}
      <div
        className="
          shadow-xl
          md:p-8
          p-4
          max-w-md
          mx-auto
          w-60
          md:w-100
          group
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
          hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
        "
      >

        <h1 className="md:text-3xl text-xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-300 text-center md:mb-8 mb-4">
          Create an account to manage your portfolio.
        </p>

        <div className="flex flex-col md:gap-4 gap-3">

          {/* Name */}
          <input
            className="
              w-full
              border
              border-slate-300
              rounded-lg
              px-3
              py-2
              md:py-3
              transition
              duration-300
              focus:ring-2
              outline-none
              text-white
              placeholder:text-slate-300
              focus:border-cyan-500
              focus:ring-indigo-500/30
              bg-transparent
            "
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            className="
              w-full
              border
              border-slate-300
              rounded-lg
              px-3
              py-2
              md:py-3
              transition
              duration-300
              focus:ring-2
              outline-none
              text-white
              placeholder:text-slate-300
              focus:border-cyan-500
              focus:ring-indigo-500/30
              bg-transparent
            "
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="flex gap-2">
            <input
              className="
                w-full
                border
                border-slate-300
                rounded-lg
                px-3
                py-2
                md:py-3
                transition
                duration-300
                focus:ring-2
                outline-none
                text-white
                placeholder:text-slate-300
                focus:border-cyan-500
                focus:ring-indigo-500/30
                bg-transparent
              "
              placeholder="Password"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="
                cursor-pointer
                invert
                bg-linear-to-br
                from-yellow-500/90
                to-red-500/90
                rounded-full
                md:px-3.5
                px-2.5
              "
              type="button"
              onClick={togglePassword}
            >
              {showPassword ? (
                <Image
                  width={28}
                  height={28}
                  src="/eye-show.svg"
                  alt="hide"
                />
              ) : (
                <Image
                  width={28}
                  height={28}
                  src="/eye-off.svg"
                  alt="show"
                />
              )}
            </button>
          </div>

          {/* Profile Image */}
          <div className="text-slate-300">
            <label className="block mb-2 text-sm">
              Profile Picture <span className="text-slate-500">(optional)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="
                w-full
                text-sm
                text-slate-300
                file:mr-3
                file:py-2
                file:px-4
                file:rounded-lg
                file:border-0
                file:bg-indigo-500
                file:text-white
                file:cursor-pointer
                cursor-pointer
              "
            />
          </div>

          {/* Register Button */}
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
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-center text-slate-300 text-sm mt-2">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}