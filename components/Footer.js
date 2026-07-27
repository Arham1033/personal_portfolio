import React from 'react'

const Footer = () => {
  return (
   <div className="relative z-20 border-t backdrop-blur-xl bg-indigo-900/90 border-b border-white/10 text-white md:px-8 px-4 md:py-3 shadow-xl py-1">
     <div className="max-w-7xl mx-auto md:px-6 px-4 py-2 flex items-center justify-center">
<div className="flex flex-col items-center md:gap-3 gap-2">

<div className="flex flex-col md:flex-row items-center md:gap-4 gap-2">

     <p className="text-slate-300 font-medium tracking-wide">
  Connect with me
</p>
      <div className="flex md:gap-3 gap-2">
          <a href="https://github.com/arham1033" target="_blank" rel="noopener noreferrer" className="md:px-4 px-2 md:py-2 py-1 bg-purple-500/20 rounded-xl transition duration-300 hover:scale-105 active:scale-95 text-gray-300 hover:text-white border border-slate-300 hover:bg-indigo-500/50 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/muhammad-arham-51a63a3aa/" target="_blank" rel="noopener noreferrer" className="md:px-4 px-2 md:py-2 py-1 bg-purple-500/20 rounded-xl transition duration-300 hover:scale-105 active:scale-95 text-gray-300 hover:text-white border border-slate-300 hover:bg-indigo-500/50 bg-linear-to-br hover:from-indigo-500 hover:to-cyan-600">
            LinkedIn
          </a>
        </div>
      </div>
  <h3 className="text-sm text-slate-300 border-t border-white/10 pt-2 w-full text-center">© 2026 My Portfolio. All rights reserved.</h3>
</div>
</div>
    </div>
  )
}

export default Footer
