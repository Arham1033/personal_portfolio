"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { clearAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const router = useRouter();
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
        <nav className="bg-gray-600 text-white p-4">  
                 <div className="flex items-center justify-between mx-10"> 
                    <Link
                    href="/"
                    className="text-2xl font-bold text-gray-300 hover:text-white transition duration-300"
                    >
                     <Image src="/information.svg" alt="Logo" width={30} height={30} className="inline-block mr-2" />   
                    My Portfolio
                    </Link>

                <div className="Links flex gap-2">
                    
                    <Link href="/about" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 transition duration-300">About</Link>
                
                    <Link href="/contact" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 transition duration-300">Contact</Link>

{user ? (
  <>
    <span className="px-4 py-2">
      {user.name}
    </span>

    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-700 rounded cursor-pointer transition duration-300 hover:bg-gray-800"
    >
      Logout
    </button>
  </>
) : (
  <div ref={dropdownRef} className="dropdown">
    <div
      onClick={() => setactive(!active)}
      className="dropbtn flex items-center gap-2 cursor-pointer"
    >
      <button className='cursor-pointer transition duration-300'>Register/Login</button>

      <Image
        src="/arrow.svg"
        alt="Arrow"
        width={14}
        height={20}
        className="invert"
      />
    </div>

    {active && (
      <div className="dropdown-content">
          <Link
  href="/register"
  className="block px-4 py-2 hover:bg-gray-800 transition duration-300"
>
  Register
</Link>

<Link
  href="/login"
  className="block px-4 py-2 hover:bg-gray-800 transition duration-300"
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
