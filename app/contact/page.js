"use client"
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from 'react'

const Page = () => {

const [contact, setContact] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchContact();
}, []);

async function fetchContact() {
  try {
    const res = await fetch("/api/contact");
    const data = await res.json();

    console.log("Contact data:", data);

    setContact(data);
    
  } catch (error) {
    console.error(error);
  } finally {
  setLoading(false);
  }
}

// 👇 ADD THIS HERE
if (loading) {
  return (
    <ProtectedRoute>
     <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white pl-10 z-10 relative overflow-hidden px-2 py-10">
      <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 w-100 h-100 rounded-full bg-indigo-500/80 blur-[140px] " />

<div className="absolute bottom-[10] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/80 blur-[180px]" />
  <div className="animate-pulse rounded-2xl border border-white/10 bg-zinc-900/60 md:px-8 md:py-6 px-2 py-2 backdrop-blur-xl transition duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,.45)]">
    Loading contact information...
  </div>
</div>
    </ProtectedRoute>
  );
}

if (!contact) {
  return (
    <ProtectedRoute>
      <div>No contact information available.</div>
    </ProtectedRoute>
  );
}

// 👇 THEN YOUR EXISTING RETURN

  return (
    <ProtectedRoute>
   <div
  className="relative min-h-screen overflow-hidden bg-[#030712] text-white px-4 md:py-8 py-4 md:px-10"
>
<div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 w-100 h-100 rounded-full bg-indigo-500/80 blur-[140px] " />

<div className="absolute bottom-[10] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/80 blur-[180px]" />

  <div className="relative z-10 mx-auto max-w-5xl md:w-200 sm:w-100 w-47">


<div
  className="
  rounded-3xl
  border border-white/10
  bg-linear-to-br from-indigo-500/40 via-blue-500/40 to-cyan-500/40
  backdrop-blur-xl
  md:p-8 p-4 hover:shadow-[0_0_30px_rgba(99,102,241,.45)] transition duration-300
  shadow-[0_10px_40px_rgba(0,0,0,0.35)]
   "
>
     <div className="mb-5 text-center">
  <h1 className="text-2xl md:text-5xl font-bold">
    Contact
    <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
      {" "}Me
    </span>
  </h1>

  <p className="mt-4 text-slate-300">
    Feel free to reach out through any of the platforms below.
  </p>
</div>
</div>


<div className="flex flex-col md:flex-row md:items-center justify-between md:py-4 py-2 border-b border-white/10 mt-3">
  <span className="text-slate-300 font-lg">
  Email
</span>

<span className="font-semibold text-white break-all">
  {contact.email}
</span></div>

<div className="flex flex-col md:flex-row md:items-center justify-between md:py-4 py-2 border-b border-white/10"><span className="text-slate-300">
  Phone
</span>

<span className="font-semibold">
  {contact.phone}
</span></div>

<div className="flex flex-col md:flex-row md:items-center justify-between py-2 md:py-4 border-b border-white/10"><span className="text-slate-300">
  YouTube
</span>

<span className="font-semibold">
 <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="
text-cyan-300
hover:text-cyan-400
hover:underline
transition
">Rexi Craft</a>
</span></div>

<div className="flex flex-col md:flex-row md:items-center justify-between md:py-4 py-2 border-b border-white/10"><span className="text-slate-300">
  Instagram
</span>
<span className="font-semibold">
 <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="
text-cyan-300
hover:text-cyan-400
hover:underline
transition
">@rexi_xj</a>
</span></div>

<div className="flex flex-col md:flex-row md:items-center justify-between md:py-4 py-2 border-b border-white/10"><span className="text-slate-300">
  TikTok
</span>
<span className="font-semibold">
 <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="
text-cyan-300
hover:text-cyan-400
hover:underline
transition
">@rexi_xj</a>
</span></div>



<h2 className="md:mt-8 mt-6 md:text-2xl text-xl font-bold">Important note:</h2>
<p className="md:mt-4 mt-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 md:p-5 p-3 text-gray-300 leading-8 font-semibold shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,.45)] transition duration-300">{contact.note}</p>
      </div>
  </div>
    </ProtectedRoute>
  )
}

export default Page
