"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  

  const [form, setForm] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected); // ✅ THIS WAS MISSING

    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(selected);
  };

  useEffect(() => {
  const stored = localStorage.getItem("user");

  if (!stored) return;

  const parsed = JSON.parse(stored);

  setUser(parsed);
  setForm(parsed);

  fetch(`/api/user/stats/${parsed._id}`)
    .then((res) => res.json())
    .then((data) => {
      setStats(data.user);
    })
    .catch(console.error);
}, []);


useEffect(() => {
  if (!user?._id) return;

  const alreadyViewed = localStorage.getItem(
    `viewed-${user._id}`
  );

  if (!alreadyViewed) {
    fetch("/api/user/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
      }),
    });

    localStorage.setItem(
      `viewed-${user._id}`,
      "true"
    );
  }
}, [user]);

 

  async function handleUpdate() {
      const noChanges =
    form.name === user.name &&
    form.email === user.email &&
    form.profileImage === user.profileImage &&
    passwords.oldPassword.trim() === "" &&
    passwords.newPassword.trim() === "";

  if (noChanges) {
    toast("No changes made");
    setEditMode(false);
    return;
  }
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: user._id,
          name: form.name,
          email: form.email,
          profileImage: form.profileImage,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const text = await res.text(); // safer than res.json()
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEditMode(false);

      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  if (!user) return <div className="min-h-screen text-center flex items-center justify-center font-bold text-2xl bg-[#030712] text-white">Not logged in</div>;

  return (
    <ProtectedRoute>

    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white flex items-center justify-center md:px-4 px-4 py-4 md:py-10">
  {/* Background glow */}
   <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 w-100 h-100 rounded-full bg-indigo-500/40 blur-[140px] " />

<div className="absolute bottom-[5] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/40 blur-[180px]" />

<div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.25)] transition duration-300 hover:shadow-[0_0_60px_rgba(34,211,238,0.35)] md:ml-0 ml-10">

<div className="relative mx-auto h-32 w-32 md:h-40 md:w-40">
  <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500 p-0.75">
    <div className="h-full w-full rounded-full overflow-hidden bg-[#0b1220]">
      <img
        src={preview || form.profileImage || "/default-avatar.jpg"}
        className="h-full w-full object-cover"
      />
    </div>
  </div>
</div>

        {!editMode ? (
          <>
          
          <div className="text-center mt-2 md:mt-5">
  <h2 className="md:text-2xl text-xl font-bold tracking-tight">{user.name}</h2>
  <p className="md:text-[16px] text-sm text-slate-300 mt-1 wrap-break-word">{user.email}</p>
</div>



<div className="grid grid-cols-2 md:gap-3 gap-2 md:mt-6 mt-4">
  <div className="rounded-xl border border-white/10 bg-white/5 md:p-3 p-2 duration-300 transition hover:border-cyan-500/60">
    <p className="text-xs text-slate-300 mb-1">Logins</p>
    <p className="md:text-xl font-semibold">{stats?.loginCount ?? 0}</p>
  </div>

  <div className="rounded-xl border border-white/10 bg-white/5 md:p-3 p-2 duration-300 transition hover:border-cyan-500/60">
    <p className="text-xs text-slate-300 mb-1">Profile Views</p>
    <p className="md:text-xl font-semibold">{stats?.profileViews ?? 0}</p>
  </div>

  <div className="rounded-xl border border-white/10 bg-white/5 md:p-3 p-2 duration-300 transition hover:border-cyan-500/60">
    <p className="text-xs text-slate-300 mb-1">Account Created</p>
    <p className="md:text-xl text-sm font-semibold">{" "}
  {stats?.createdAt
    ? new Date(stats.createdAt).toLocaleDateString()
    : "N/A"}</p>
  </div>

  <div className="rounded-xl border border-white/10 bg-white/5 md:p-3 p-2 duration-300 transition hover:border-cyan-500/60">
    <p className="text-xs text-slate-300 mb-1">Last Login</p>
    <p className="md:text-lg text-xs font-semibold">{" "}
  {stats?.lastLogin
    ? new Date(stats.lastLogin).toLocaleString()
    : "Never"}</p>
  </div>
</div>




          <div className="md:mt-6 mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 md:px-4 px-2 md:py-3 py-2 transition duration-300 hover:border-cyan-500/60">
  <div>
    <p className="text-slate-300">Password</p>
    <p className="text-sm tracking-[0.3em]">••••••••••</p>
  </div>

  <button
    className="rounded-lg border border-black p-2 invert cursor-pointer hover:bg-linear-to-br from-yellow-500/80 to-red-500/80 transition duration-300"
    onClick={() => setEditMode(true)}
  >
    <Image src="/pencil.svg" alt="edit" width={18} height={18} />
  </button>
</div>

   <button
  onClick={() => setEditMode(true)}
  className="md:mt-6 mt-3 w-full rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] active:scale-95 cursor-pointer"
>
  Edit Profile
</button>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2 w-full">
<div className="flex items-center mb-1 gap-2 md:mb-4">
  <button
    onClick={() => {
      setEditMode(false);
      setPreview("");
      setFile(null);
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });

      // Restore original values
      setForm({
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      });
    }}
    className="cursor-pointer hover:scale-110 transition duration-300 invert"
  >
    <Image
      src="/back.svg"
      alt="Back"
      width={24}
      height={24}
    />
  </button>

  <h2 className="font-bold text-xl text-center">Edit Profile</h2>
</div>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-4 md:py-3 text-white placeholder:text-slate-300 outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Name"
            />
            <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:py-3 text-white placeholder:text-slate-300 outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Email"
            />


            <div className="flex items-center gap-3">

              <label className="cursor-pointer bg-gray-500 text-white md:px-4 md:py-2 py-1 px-2
rounded-lg
bg-linear-to-r
from-indigo-500
to-cyan-500
transition-all
duration-300
hover:shadow-[0_0_25px_rgba(99,102,241,.4)]">
                Choose file (optional)

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              <span className="text-sm text-slate-300">
                {file ? file.name : "No file selected"}
              </span>

            </div>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    oldPassword: e.target.value,
                  })
                }
                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:py-3 text-white placeholder:text-slate-300 outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-2 top-2 md:top-3 cursor-pointer invert rounded-full bg-linear-to-br from-red-500/90 to-yellow-500/90 p-1 hover:scale-95 duration-300 transition"
              >
                <Image
                  src={showOldPassword ? "/eye-show.svg" : "/eye-off.svg"}
                  alt="Toggle password"
                  width={20}
                  height={20}
                  className=""
                />
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:py-3 text-white placeholder:text-slate-300 outline-none transition duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-2 md:top-3 cursor-pointer invert rounded-full bg-linear-to-br from-red-500/90 to-yellow-500/90 p-1 hover:scale-95 duration-300 transition"
                >
                <Image
                  src={showNewPassword ? "/eye-show.svg" : "/eye-off.svg"}
                  alt="Toggle password"
                  width={20}
                  height={20}
                  />
              </button>
            </div>

            <button
              onClick={handleUpdate}
           className="w-full rounded-xl bg-green-500 py-3 font-semibold transition duration-300 hover:bg-green-400 hover:scale-[1.02] active:scale-95 cursor-pointer mt-2 md:mt-6 bg-linear-to-r from-indigo-500 to-cyan-500 text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.45)]"
              >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
        </ProtectedRoute>
  );
}