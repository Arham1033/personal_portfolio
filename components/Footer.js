import React from 'react'

const Footer = () => {
  return (
    <div className="bg-gray-600 text-white p-4 text-center">
      <div className="mt-2 flex items-center justify-center">

<div className="flex flex-col items-center justify-between">

<div className="flex md:flex-row flex-col items-center gap-5">

        <p>Connect with me:</p>
        <div className="flex justify-center gap-2 ">
          <a href="https://github.com/arham1033" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 bg-gray-700 md:px-4 md:py-2 px-2 py-1 rounded hover:bg-gray-800 font-semibold">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/muhammad-arham-51a63a3aa/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 bg-gray-700 px-2 md:px-4 py-1 md:py-2 rounded hover:bg-gray-800 font-semibold">
            LinkedIn
          </a>
        </div>
      </div>
      <h3 className="text-md mt-2">© 2026 My Portfolio. All rights reserved.</h3>
</div>
</div>
    </div>
  )
}

export default Footer
