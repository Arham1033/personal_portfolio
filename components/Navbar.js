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
    const data = await res.json();
    setNotifications(data);
  } catch (error) {
    console.log(error);
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



const unreadCount = notifications.filter(
  (notification) => !notification.read
).length;

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
  <div className='flex gap-1 relative items-center'>

    <div ref={notificationRef}
  className="relative inline-block"
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
 <img className='md:w-8 w-5 h-5 md:h-8 invert cursor-pointer' src="/bell.svg" alt="" />

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
      {unreadCount}
    </span>
  )}

  {showNotifications && (
 <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black rounded-lg shadow-lg p-3 z-50">
    <h3 className="font-bold mb-2">Notifications</h3>

    {notifications.length === 0 ? (
      <p>No notifications</p>
    ) : (
      notifications.map((notification) => (
    <div
  key={notification._id}
  className="flex justify-between items-center border-b py-2"
>
  <div>
    <p>{notification.message}</p>

    <small className="text-gray-500">
      {new Date(notification.createdAt).toLocaleString()}
    </small>
  </div>

  <img src='delete.svg'
    onClick={() => deleteNotification(notification._id)}
    className="text-red-600 hover:text-red-800 w-5 h-5 cursor-pointer"
  />
  
  
</div>
      ))
    )}
  </div>
)}
</div>

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
