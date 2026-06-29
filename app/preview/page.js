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
    <div className="flex justify-center items-center flex-col py-6">

      <h1 className="font-bold text-xl md:text-2xl mb-6">Portfolio Preview</h1>

      {/* Skills */}
      <div className="mb-8 text-center">
        <h2 className="md:text-xl text-lg font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 justify-center md:w-100 w-50 mx-auto">
          {skills.map((skill) => (
            <span
              key={skill._id}
              className="bg-gray-300 px-4 py-2 rounded-full text-sm font-semibold"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <h2 className="md:text-xl text-lg font-bold mb-4">Projects</h2>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:w-160 w-65 mx-auto md:pl-0 pl-5">
        {projects.map((p) => (
          <div key={p._id} className="bg-gray-200 rounded-lg p-4 shadow-md">

            {/* Image */}
            {p.image ? (
              <img
                src={p.image}
                alt={p.title}
                className="rounded-lg w-full h-40 object-cover mb-3"
                onError={(e) => {
                  e.target.src = "/fallback.png";
                }}
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-300 rounded-lg mb-3 font-semibold">
                No image
              </div>
            )}

            {/* Title + Link */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{p.title}</h3>

              {isValidUrl(p.link) ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-bold"
                >
                  Visit
                </a>
              ) : (
                <span className="text-gray-500 text-sm font-semibold">Invalid link</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-2">
              {p.description}
            </p>

            {/* Date */}
            <div className="text-sm text-gray-500 mt-3">
              Created: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}