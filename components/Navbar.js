"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { clearAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useActivity } from "@/context/ActivityContext";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
    const { addActivity } = useActivity();
    const notificationRef = useRef(null);
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
  router.push("/login");
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



const fetchNotifications = async () => {
  try {
    const res = await fetch("/api/notifications");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected an array");
    }

    setNotifications(data);
  } catch (err) {
    console.error(err);
    setNotifications([]);
  }
};

useEffect(() => {
  fetchNotifications();
}, []);


const markAllAsRead = async () => {
  try {
    await fetch("/api/notifications/read-all", {
      method: "PATCH",
    });

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const deleteNotification = async (id) => {
  try {
    await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });

    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id)
    );
  } catch (error) {
    console.log(error);
  }
};



const unreadCount = Array.isArray(notifications)
  ? notifications.filter((notification) => !notification.read).length
  : 0;

  return (
    <div className="sticky top-0 z-50">
       <nav className="backdrop-blur-xl bg-indigo-900/80 border-b border-white/10 text-white md:px-8 px-2 md:py-3 py-2 shadow-xl">
             <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <Link
           
                    href="/"
                    className="flex items-center justify-center gap-2 text-lg md:text-2xl font-bold tracking-wide hover:opacity-90 transition-all duration-300"
                    >
                     <Image src="/favicon.ico" alt="Logo" width={30} height={30} className="w-8 md:w-9 md:inline hidden" />   
                    <span className="bg-linear-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,.45)]">
                      My Portfolio
                      </span>
                    </Link>
                

                <div className="Links flex md:flex-row flex-col md:gap-3 gap-1">
                    <div className='flex md:gap-2 gap-1'>

                    <Link href="/about" className="md:px-4 px-2 md:py-2 py-1 bg-purple-500/20 rounded-xl transition duration-300 hover:scale-105 active:scale-95 text-gray-200 hover:text-white border border-slate-300 hover:bg-indigo-500/50 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600">About</Link>
                    <Link href="/contact" className="md:px-4 px-2 md:py-2 py-1  rounded-xl transition duration-300 hover:scale-105 active:scale-95 text-gray-200 hover:text-white border border-slate-300 hover:bg-indigo-500/50 bg-purple-500/20 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600">Contact</Link>
                    </div>

{user ? (
  <>
  <div className='flex md:gap-2 gap-1 relative items-center'>

    <div ref={notificationRef}
  className="relative inline-block md:mr-2"
onClick={async () => {
  const opening = !showNotifications;

  if (opening) {
    await fetchNotifications();
    await markAllAsRead();
    await fetchNotifications();
  }

  setShowNotifications(opening);
}}
>
 <img className="w-6 md:w-7 h-6 md:h-7 invert opacity-80 hover:opacity-100 hover:scale-110 transition cursor-pointer" src="/bell.svg" alt="" />

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 ring-1 ring-cyan-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
      {unreadCount}
    </span>
  )}

  {showNotifications && (
<div
  className="absolute md:right-0 right-[-110] mt-3 w-50 md:w-96 md:max-h-125 max-h-100 overflow-y-auto overscroll-contain custom-scrollbar rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl text-white p-4 scroll-smooth"
    onClick={(e) => e.stopPropagation()}
  onWheel={(e) => e.stopPropagation()}
>
    <h3 className="md:text-lg font-semibold border-b border-white/10 md:pb-3 pb-2 md:mb-3">Notifications</h3>

    {notifications.length === 0 ? (
      <p>No notifications</p>
    ) : (
      notifications.map((notification) => (
    <div
  key={notification._id}
 className="flex justify-between items-start md:py-3 py-2 border-b border-white/10 hover:bg-white/5 rounded-xl md:px-2 transition"
>
  <div>
    <p>{notification.message}</p>

    <small className="text-slate-400">
      {new Date(notification.createdAt).toLocaleString()}
    </small>
  </div>

 <img
  src="delete.svg"
  onClick={(e) => {
    e.stopPropagation();
    deleteNotification(notification._id);
  }}
  className="md:w-6 md:h-6 w-5 h-5 opacity-90 hover:opacity-100 hover:scale-110 cursor-pointer transition invert b bg-linear-to-br from-[#D42406] to-[#63fd55] rounded-full p-1"
/>
  
  
</div>
      ))
    )}
  </div>
)}
</div>

    <Link className='flex items-center border-slate-300 rounded-xl border hover:bg-indigo-500/50 bg-purple-500/20 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600 transition duration-300 hover:scale-105 px-1 text-gray-200 hover:text-white' href="/profile">
    <img
  width={40}
  height={30}
  src={user.profileImage || "/default-avatar.png"}
  alt="profile pic"
  className="md:h-10 h-8 rounded-full object-cover border-2 border-cyan-500"
/>
   <span className="hidden lg:block ml-2 font-medium text-gray-200 hover:text-white">
  {user.name}
</span>
    </Link>

    <button
      onClick={handleLogout}
      className="md:px-4 px-2 md:py-2 py-1 rounded-xl cursor-pointer transition duration-300 hover:scale-105
active:scale-95 text-gray-200 hover:text-white border border-slate-300 hover:bg-indigo-500/50 bg-purple-500/20 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600"
      >
      Logout
    </button>
      </div>
  </>
) : (
  <div ref={dropdownRef} className="dropdown">
    <div
      onClick={() => setactive(!active)}
      className="dropbtn flex items-center gap-2 px-4 py-2 rounded-xl duration-300 border border-slate-400 transition cursor-pointer text-gray-200 hover:text-white hover:bg-indigo-500/50 bg-linear-to-br hover:from-indigo-500 bg-purple-500/20 hover:to-cyan-600 active:scale-95 hover:scale-105"
    >
      <button className='cursor-pointer transition duration-300 text-gray-200 hover:text-white'>Register/Login</button>

      <Image
        src="/arrow.svg"
        alt="Arrow"
        width={14}
        height={20}
        className="invert pr-1"
      />
    </div>

    {active && (
<div className="dropdown-content absolute right-[-3] md:w-42 overflow-hidden rounded-xl-xl border border-slate-400 bg-purple-500/50 backdrop-blur-xl shadow-xl text-gray-200 hover:text-white">
          <Link
  href="/register"
  className="block md:px-4 md:py-2 px-2 py-1 transition duration-300 hover:scale-105 active:scale-95 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600"
>
  Register
</Link>

<Link
  href="/login"
  className="block md:px-4 md:py-2 px-2 py-1 transition duration-300 hover:scale-105 active:scale-95 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600"
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
