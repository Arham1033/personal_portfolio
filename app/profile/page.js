"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  
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
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm(parsed);
    }
  }, []);

 async function handleUpdate() {
  try {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: user._id,
        name: form.name,
        email: form.email,
        profileImage: form.profileImage,
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

  if (!user) return <div className="min-h-screen text-center flex items-center justify-center font-bold text-2xl">Not logged in</div>;

  return (
    <div className="min-h-screen flex justify-center p-10 md:w-100 w-50 mx-auto">
      <div className="bg-white rounded-lg w-80">

        <div className="relative md:h-40 md:w-40 w-30 h-30 rounded-full overflow-hidden mx-auto ">
         <img
  src={preview || form.profileImage || "/default-avatar.jpg"}
  className="md:w-full md:h-full w-50 h-50 object-cover"
/>
        </div>

        {!editMode ? (
          <>
            <h2 className="md:text-xl text-lg text-center font-bold mt-3">{user.name}</h2>
            <p className="text-gray-600 md:text-lg text-sm pl-8">{user.email}</p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white md:px-3 px-2 py-1 rounded-md transition duration-300 mx-10"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2 w-50 ml-10">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-2 rounded-md"
              placeholder="Name"
            />

            <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="border p-2 rounded-md"
              placeholder="Email"
            />

          
<div className="flex items-center gap-3">

  <label className="cursor-pointer bg-gray-500 text-white md:px-4 md:py-2 py-1 px-2 rounded">
    Choose file (optional)

    <input
      type="file"
      accept="image/*"
      onChange={handleFile}
      className="hidden"
    />
  </label>

  <span className="text-sm text-gray-600">
    {file ? file.name : "No file selected"}
  </span>

</div>

            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white transition duration-300 cursor-pointer hover:bg-green-600 px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}