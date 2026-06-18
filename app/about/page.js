"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const page = () => {
  
  const defaultAboutSections = [
    {
      id: 1,
      title: "About Myself",
      content:
        "I am a passionate developer with experience in building web applications using modern technologies. I enjoy learning new programming languages and frameworks, and I am always looking for opportunities to grow my skills and contribute to exciting projects."
    },
    {
      id: 2,
      title: "My Education",
      content:
        "Bachelor in Computer Science, I am currently studying in University of Layyah, I learned Web development and now i am doing Artificial Intelligence BS Degree program"
    },
    {
      id: 3,
      title: "My Skills",
      content: "JavaScript, React, Next.js, Express.js, HTML/CSS"
    },
    {
      id: 4,
      title: "My Projects",
      content: "I have made few projects you can find their links in my Project section."
    }
  ];
  const [aboutSections, setAboutSections] = useState(defaultAboutSections);
const [showForm, setShowForm] = useState(false);

const [form, setForm] = useState({
  title: "",
  content: ""
});

const [editId, setEditId] = useState(null);

useEffect(() => {
  const saved = localStorage.getItem("aboutSections");

  if (saved) {
    setAboutSections(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "aboutSections",
    JSON.stringify(aboutSections)
  );
}, [aboutSections]);



  return (
    <div className="min-h-screen bg-gray-200 pt-3 items-center md:py-2 md:px-10 px-5">
      <div className='mx-auto xl:w-200 sm:w-100 w-45'>

{aboutSections.length === 0 ? (
  <div className="text-gray-600 mt-6 font-semibold">
    No information added yet. Add something about yourself.
  </div>
) : (
  aboutSections.map((item) => (
  <div key={item.id} className="mt-4">

    <h2 className="md:text-xl text-lg font-semibold">
      {item.title}
    </h2>

    <p className="text-gray-600 md:text-lg">
      {item.content}
    </p>

    <div className="flex gap-2 mt-2">

      <button
        onClick={() => {
          setEditId(item.id);
          setForm(item);
          setShowForm(true);
        }}
        className="bg-blue-500 text-white px-2 py-1 rounded-md transition duration-300 cursor-pointer hover:bg-blue-600"
      >
        Edit
      </button>

    <button
  onClick={() => {
    const confirmDelete = window.confirm(
      "Do you want to delete this section?"
    );

    if (!confirmDelete) return;

    setAboutSections(
      aboutSections.filter((i) => i.id !== item.id)
    );
  }}
  className="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 cursor-pointer hover:bg-red-600"
>
  Delete
</button>

    </div>
  </div>

)))}



                {showForm && (
  <div className="mt-4 bg-gray-300 p-4 rounded-md">

    <input
      className="w-full md:p-2 p-1 mb-2 border rounded-md font-semibold text-lg"
      placeholder="Topic (e.g. Education)"
      value={form.title}
      onChange={(e) =>
        setForm({ ...form, title: e.target.value })
      }
    />




    <textarea
      className="w-full md:p-2 p-1 mb-2 border rounded-md text-lg"
      placeholder="Information"
      value={form.content}
      onChange={(e) =>
        setForm({ ...form, content: e.target.value })
      }
    />

    <button
      onClick={() => {
  if (!form.title.trim() || !form.content.trim()) {
  toast.error("Title and content cannot be empty");
  return;
}

  if (editId) {
    setAboutSections(
      aboutSections.map((item) =>
        item.id === editId
          ? { ...item, ...form }
          : item
      )
    );
    setEditId(null);
  } else {
    setAboutSections([
      ...aboutSections,
      {
        id: Date.now(),
        title: form.title.trim(),
        content: form.content.trim()
      }
    ]);
  }

  setForm({ title: "", content: "" });
  setShowForm(false);
}}
      className="bg-green-500 text-white md:px-4 px-2 md:py-2 py-1 rounded-md transition duration-300 cursor-pointer hover:bg-green-600"
    >
      Save
    </button>
  </div>
)}
<button
  onClick={() => {
    setShowForm(true);
    setEditId(null);
    setForm({ title: "", content: "" });
  }}
  className="bg-gray-500 text-white md:px-4 px-3 md:py-2 py-1 rounded my-6 cursor-pointer hover:bg-gray-600 transition duration-300"
>
  Add About Section
</button>

      </div>
    </div>
  )
}

export default page
