import React from 'react'

const page = () => {
  return (
    <div className='bg-gray-200 min-h-screen py-2 md:px-10 px-2'>
      <div className='mx-auto md:w-200 sm:w-100 w-45'>

      <h1 className='md:text-3xl font-bold mt-4 text-xl'>
        My Contact Information
        </h1>
<p className='md:text-lg text-gray-600 mt-4 flex md:flex flex-col'>
  <span>
  Gmail:
  </span>

   <span className='md:font-semibold md:text-lg text-sm'>muhammadwhitearham</span><span className='md:font-semibold md:text-lg text-sm'>@gmail.com</span></p>

<p className='md:text-lg text-gray-600 mt-4'>My Phone number: <span className='font-semibold'>0309-7355779</span></p>

<p className='md:text-lg text-gray-600 mt-4'>YouTube: <span className='font-semibold'><a href="https://www.youtube.com/@rexi_craft" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>Rexi Craft</a></span></p>

<p className='md:text-lg text-gray-600 mt-4'>Instagram: <span className='font-semibold'><a href="https://www.instagram.com/rexi_xj" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<p className='md:text-lg text-gray-600 mt-4'>TikTok: <span className='font-semibold'><a href="https://www.tiktok.com/@rexi_xj" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>@rexi_xj</a></span></p>

<h2 className='text-xl md:font-bold font-semibold mt-6'>Important note:</h2>
<p className='md:text-lg text-gray-600 mt-2 md:w-fit w-50 px-auto'>Don't misuse my contact information. Please feel free to reach out to me through any of the above platforms</p>
      </div>
    </div>
  )
}

export default page
