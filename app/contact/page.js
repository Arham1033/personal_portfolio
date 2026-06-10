import React from 'react'

const page = () => {
  return (
    <div className='bg-gray-200 min-h-screen items-center py-2 px-10'>
      <h1 className='text-3xl font-bold mt-4'>
        My Contact Information
        </h1>
<p className='text-lg text-gray-600 mt-4'>Gmail: <span className='font-semibold'>muhammadwhitearham@gmail.com</span></p>

<p className='text-lg text-gray-600 mt-4'>My Phone number: <span className='font-semibold'>0309-7355779</span></p>

<p className='text-lg text-gray-600 mt-4'>YouTube: <span className='font-semibold'><a href="https://www.youtube.com/@rexi_craft" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Rexi Craft</a></span></p>

<p className='text-lg text-gray-600 mt-4'>Instagram: <span className='font-semibold'><a href="https://www.instagram.com/rexi_xj" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<p className='text-lg text-gray-600 mt-4'>TikTok: <span className='font-semibold'><a href="https://www.tiktok.com/@rexi_xj" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<h2 className='text-xl font-bold mt-6'>Important note:</h2>
<p className='text-lg text-gray-600 mt-2'>Don't misuse my contact information. Please feel free to reach out to me through any of the above platforms</p>
    </div>
  )
}

export default page
