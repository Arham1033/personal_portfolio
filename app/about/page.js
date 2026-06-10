import React from 'react'

const page = () => {
  return (
    <div className="bg-gray-200 min-h-screen pt-3 items-center py-2 px-10">
      <h1 className="text-3xl font-bold">About myself</h1>
        <p className="text-lg text-gray-600 mt-4">My name is <span className="font-semibold">
            Muhammad Arham.
            </span>
             <br/>
                I am a passionate developer with experience in building web applications using modern technologies. I enjoy learning new programming languages and frameworks, and I am always looking for opportunities to grow my skills and contribute to exciting projects.
                </p>

<div className="mt-4 text-lg">
    <h2 className="text-xl font-semibold">
    My Education
    </h2>
    <ul className="list-disc list-inside text-gray-600 mt-2">
        <li>Bachelor in Computer Science</li>
        <li>I'm currently studying in University of Layyah</li>
        <li>I learned Web development and now i'm doing Artificial Intelligence BS Degree program</li>
    </ul>
    </div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">My Skills</h2>
                  <ul className="list-disc list-inside text-lg text-gray-600 mt-2">
                    <li>JavaScript</li>
                    <li>React</li>
                    <li>Next.js</li>
                    <li>Express.js</li>
                    <li>HTML/CSS</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-semibold">My Projects</h2>
                  <ul className="list-disc list-inside text-lg text-gray-600 mt-2 mb-2">
                    <li>
                        <a href="https://bittree-six.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">My Bitlink Project</a>
                    </li>
                    <li>
                        <a href="https://spotify-project69.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">My Spotify Project</a>
                    </li>
                    <li>
                        <a href="https://arham-netflix-project.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">My Netflix Project (Only HTML + CSS)</a>
                    </li>
                  </ul>
                </div>


    </div>
  )
}

export default page
