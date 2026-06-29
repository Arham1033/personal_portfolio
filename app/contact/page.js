"use client"
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from 'react'

const Page = () => {

const [contact, setContact] = useState(null);


useEffect(() => {
  fetchContact();
}, []);

async function fetchContact() {
  const res = await fetch("/api/contact");
  const data = await res.json();

  setContact(data);
  
}


  return (
    <ProtectedRoute>
 {!contact ? (
      <div>Loading...</div>
    ) : (
    <div className='bg-gray-200 min-h-screen py-2 md:px-10 sm:px-2'>
      <div className='mx-auto md:w-200 sm:w-100 w-47'>

      <h1 className='md:text-3xl font-bold mt-4 text-xl'>
        My Contact Information
        </h1>
<p className='md:text-lg text-gray-600 mt-4 flex md:flex flex-col'>
  <span>
  Gmail:
  </span>

   <span className='md:font-semibold md:text-lg text-sm'>{contact.email}</span></p>

<p className='md:text-lg text-gray-600 mt-4'>My Phone number: <span className='font-semibold'>{contact.phone}</span></p>

<p className='md:text-lg text-gray-600 mt-4'>YouTube: <span className='font-semibold'><a href={contact.youtube} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Rexi Craft</a></span></p>

<p className='md:text-lg text-gray-600 mt-4'>Instagram: <span className='font-semibold'><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<p className='md:text-lg text-gray-600 mt-4'>TikTok: <span className='font-semibold'><a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<h2 className='text-xl md:font-bold font-semibold mt-6'>Important note:</h2>
<p className='md:text-lg text-gray-600 mt-2 md:w-fit w-50 px-auto'>{contact.note}</p>
      </div>
    </div>
    )}
    </ProtectedRoute>
  )
}

export default Page
