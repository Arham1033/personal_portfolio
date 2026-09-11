"use client";

import { useEffect, useState } from "react";

export default function Preview() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
  const loadData = async () => {
    const skills = localStorage.getItem("skills");
    if (skills) setSkills(JSON.parse(skills));

    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  loadData();

  const handleSync = (e) => {
    if (e.key === "portfolio_sync") {
      loadData();
    }
  };

  window.addEventListener("storage", handleSync);

  return () => {
    window.removeEventListener("storage", handleSync);
  };
}, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
  

    <div className="flex justify-center items-center flex-col py-3 md:py-6 bg-[#030712] text-white relative z-10 md:pl-0 pl-6">
    
     <div className="absolute -top-50 md:left-40 left-[-300] md:h-112.5 md:w-112.5 w-100 h-100 rounded-full bg-indigo-500/80 blur-[140px] " />

<div className="absolute bottom-[200] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/80 blur-[180px]" />

<div
className="relative z-10 w-full max-w-7xl md:py-7 py-4 flex flex-col items-center
"
>


       <h1 className="text-xl md:text-4xl font-extrabold bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-5">Preview Portfolio</h1>

      {/* Skills */}
      <div className="mb-4 text-center">
        <h2 className="md:text-xl text-lg font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 justify-center mx-auto my-3">
          {skills.map((skill) => (
            <span
            key={skill._id}
            className="px-4 py-2 text-sm font-semibold 
group
rounded-2xl
border
items-center
flex
gap-2
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
p-4 md:p-6
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <h2 className="md:text-xl text-lg font-bold mb-4">Projects</h2>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:w-250 md:pl-0 pl-5">
        {projects.map((p) => (
          <div key={p._id} className=" shadow-md group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-linear-to-br
from-white/10
to-white/7
backdrop-blur-xl
p-2 md:p-3
transition-all
duration-500
hover:-translate-y-3
hover:border-cyan-400
hover:shadow-[0_0_45px_rgba(34,211,238,.25)]">

            {/* Image */}
            {p.image ? (
              <img
              src={p.image}
              alt={p.title}
              className="w-full object-cover mb-3
h-52
rounded-2xl
transition-transform
duration-500
group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/fallback.png";
              }}
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center font-semibold bg-indigo-300 rounded-lg mb-4 text-gray-600 ">
                No image
              </div>
            )}

            {/* Title + Link */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-white mt-2 md:mt-4">{p.title}</h3>

              {isValidUrl(p.link) ? (
                <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 hover:underline hover:text-cyan-600 font-bold transition duration-300"
                >
                  Visit
                </a>
              ) : (
                <span className="text-slate-300 text-sm font-semibold">Invalid link</span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-300 leading-7 mt-2">
              {p.description}
            </p>

            {/* Date */}
            <div className="mt-3 text-sm text-slate-300">
              Created: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
            </div>
          </div>
        ))}
      </div>
              </div>
    </div>
        
  );
}