"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { clearAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useActivity } from "@/context/ActivityContext";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const router = useRouter();
    const { addActivity } = useActivity();
  const [user, setUser] = useState(null);
  const [active, setactive] = useState(false);
useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser || storedUser === "undefined") {
    setUser(null);
    return;
  }

  try {
    setUser(JSON.parse(storedUser));
  } catch (err) {
    console.log("Invalid user in localStorage");
    localStorage.removeItem("user");
    setUser(null);
  }
}, []);

const toggleDropdown = () => {
  setactive(prev => !prev);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setactive(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleLogout = () => {
  clearAuthUser();
  router.push("/");
  addActivity("User logged out");
};

useEffect(() => {
  const syncUser = () => {
    const stored = localStorage.getItem("user");

    if (!stored || stored === "undefined") {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  };

  syncUser(); // initial load

  window.addEventListener("authChange", syncUser);

  return () => {
    window.removeEventListener("authChange", syncUser);
  };
}, []);
  return (
    <div className="sticky top-0 z-50">
        <nav className="bg-gray-600 text-white md:p-4 p-2">  
                 <div className="flex items-center justify-between md:mx-10 mx-0"> 
                    <Link
                    href="/"
                    className="md:text-2xl text-lg font-bold text-gray-300 hover:text-white transition duration-300"
                    >
                     <Image src="/information.svg" alt="Logo" width={30} height={30} className="inline-block md:mr-2 mr-1 md:w-9" />   
                    <span className='md:text-2xl text-lg'>
                      My Portfolio
                      </span>
                    </Link>

                <div className="Links flex md:flex-row flex-col md:gap-2 gap-1">
                    <div className='flex gap-1'>

                    <Link href="/about" className="md:px-4 px-2 md:py-2 py-1 bg-gray-700 rounded hover:bg-gray-800 transition duration-300">About</Link>
                    <Link href="/contact" className="md:px-4 px-2 md:py-2 py-1 bg-gray-700 rounded hover:bg-gray-800 transition duration-300">Contact</Link>
                    </div>

{user ? (
  <>
  <div className='flex gap-2 overflow-hidden relative'>

    <Link className='flex items-center' href="/profile">
    <img
  width={40}
  height={30}
  src={user.profileImage || "/default-avatar.png"}
  alt="profile pic"
  className="rounded-full object-cover h-10"
/>
   <span className="hidden md:inline px-2 md:py-2 py-1 md:text-lg">
  {user.name}
</span>
    </Link>

    <button
      onClick={handleLogout}
      className="md:px-4 px-2 md:py-2 py-1 bg-gray-700 rounded cursor-pointer transition duration-300 hover:bg-gray-800"
      >
      Logout
    </button>
      </div>
  </>
) : (
  <div ref={dropdownRef} className="dropdown">
    <div
      onClick={() => setactive(!active)}
      className="dropbtn flex items-center gap-2 cursor-pointer"
    >
      <button className='cursor-pointer transition duration-300 '>Register/Login</button>

      <Image
        src="/arrow.svg"
        alt="Arrow"
        width={14}
        height={20}
        className="invert pr-1"
      />
    </div>

    {active && (
      <div className="dropdown-content">
          <Link
  href="/register"
  className="block md:px-4 md:py-2 px-2 py-1 hover:bg-gray-800 transition duration-300"
>
  Register
</Link>

<Link
  href="/login"
  className="block md:px-4 md:py-2 px-2 py-1 hover:bg-gray-800 transition duration-300"
>
  Login
</Link>
      </div>
    )}
  </div>
)}


                </div>
                 </div>
        </nav>
    </div>
  )
}

export default Navbar
