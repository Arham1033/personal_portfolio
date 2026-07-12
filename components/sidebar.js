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
    <aside className={`z-10 sidebar ${isOpen ? "open" : ""} flex justify-between`}>
      <ul className="font-semibold md:text-lg">
        <li className="transition duration-300 hover:scale-105 md:mt-3 mt-6"><Link href="/profile">Profile</Link></li>
        <li className="transition duration-300 hover:scale-105 my-4"><Link href="/about">About</Link></li>
        <li className="transition duration-300 hover:scale-105"><Link href="/contact">Contact</Link></li>
        <button
      onClick={handleLogout}
      className="transition duration-300 my-4 hover:scale-105 cursor-pointer"
      >
      Logout
    </button>
      </ul>
      <div className="md:mt-3 mt-6">
        <Image onClick={toggleSidebar} className="invert cursor-pointer md:w-6 w-4" src="three_line.svg" alt="menu" width={25} height={25}/>
      </div>
    </aside>
  );
}

