"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { clearAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Sidebar({ isOpen, toggleSidebar }) {
const router = useRouter();

    const handleLogout = () => {
      clearAuthUser();
      router.push("/");
    };

  return (
    // <aside className={`z-10 sidebar ${isOpen ? "open" : ""} flex justify-between`}>
<aside
  className={`sidebar ${
    isOpen ? "open" : ""
  } fixed top-0 left-0 h-screen z-40 flex justify-between
  backdrop-blur-2xl bg-linear-to-br from-indigo-500/40 to-indigo-500/20 border-r border-white/10
  shadow-2xl transition-all duration-300`}
>

  
   <ul className="md:px-5 px-2 space-y-3 text-[17px] md:font-medium mt-3">
        <li className="rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2 py-2 px-2 md:px-3 hover:text-white text-slate-300"><Link href="/profile">Profile</Link></li>
        <li className="rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2 py-2 px-2 md:px-3 hover:text-white text-slate-300"><Link href="/about">About</Link></li>
        <li className="rounded-xl hover:bg-white/10 transition-all duration-300 hover:translate-x-2 py-2 px-2 md:px-3 hover:text-white text-slate-300"><Link href="/contact">Contact</Link></li>
        <button
      onClick={handleLogout}
     className="flex items-center gap-3 w-full md:px-4 px-2 py-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-300 hover:bg-red-700 hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2"
      >
      Logout
    </button>
      </ul>
      <div className="md:mt-3 mt-6">
        <Image onClick={toggleSidebar} className="invert cursor-pointer hover:scale-105 transition duration-300 md:w-6 w-4" src="three_line.svg" alt="menu" width={25} height={25}/>
      </div>
    </aside>
  );

}

