"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useActivity } from "@/context/ActivityContext";
import toast from 'react-hot-toast';

const page = () => {
  
  const [aboutSections, setAboutSections] =
useState([]);
const [showForm, setShowForm] = useState(false);
const [showAddForm, setShowAddForm] = useState(false);
const { addActivity } = useActivity();

const [form, setForm] = useState({
  title: "",
  content: ""
});

const [editId, setEditId] = useState(null);

async function fetchAbout() {
  const res = await fetch("/api/about");
  const data = await res.json();

  setAboutSections(data);
}


useEffect(() => {
  fetchAbout();
}, []);


  return (
    

    <div className="min-h-screen md:pt-3 pt-2 items-center md:py-2 md:px-10 pl-15 relative
overflow-hidden
bg-[#030712]
text-white
px-4
">


   <div className="absolute -top-50 left-40 md:h-112.5 md:w-112.5 w-100 h-100 rounded-full bg-indigo-500/80 blur-[140px] " />

<div className="absolute bottom-[200] right-[-100] h-110 w-112.5 -translate-x-1/2 rounded-full bg-cyan-500/80 blur-[180px]" />


      <div className="relative z-10 mx-auto xl:w-200 sm:w-100 w-60 px-2 md:py-4 py-2">
        <div className="mb-5 text-center">
  <h1 className="text-2xl md:text-5xl font-bold">
    About <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Me</span>
  </h1>

  <p className="md:mt-4 mt-2 text-slate-300 max-w-2xl mx-auto">
    Learn more about my journey, experience, skills, and the projects I've built.
  </p>
</div>

{aboutSections.length === 0 ? (
  <>
  <div className="text-slate-400 mt-6 font-semibold text-center">
    No information added yet. Add something about yourself.
  </div>
  </>
) : (
  aboutSections.map((item) => (
    <div
  key={item._id}
  className="group mt-3 rounded-2xl border border-slate-300/30 shadow-xl  hover:border-indigo-400/40 hover:-translate-y-1 hover:shadow-indigo-500/10 group
  md:w-auto w-50
items-center
bg-white/5
bg-linear-to-br
from-indigo-500/20
to-cyan-400/10
backdrop-blur-xl
md:p-6 p-2
transition-all
duration-300
hover:shadow-[0_10px_35px_rgba(34,211,238,0.25)]"
>

    <h2 className="text-lg md:text-2xl font-bold text-white">
      {item.title}
    </h2>

    <p className="text-slate-300 leading-8 md:text-lg">
      {item.content}
    </p>
  

   <div className="mt-3 flex flex-wrap gap-2">

      <button
        onClick={ async () => {
            setShowAddForm(false); 
          setEditId(item._id);
            setForm({
    title: item.title,
    content: item.content,
  });

        }}
        className="rounded-xl border border-blue-400/20 bg-blue-500/80 px-2 md:px-4 py-2 text-slate-200 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-105 cursor-pointer"
      >
        Edit
      </button>
      
<button
  onClick={async () => {
    if (!confirm("Are you sure you want to delete this section?")) {
      return;
    }

    await fetch(`/api/about/${item._id}`, {
      method: "DELETE",
    });

    toast.success("Section deleted");
    addActivity(`Deleted About section "${item.title}"`);

    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `About section "${item.title}" deleted successfully`,
        type: "warning",
      }),
    });

    fetchAbout();
  }}
className="rounded-xl border border-red-400/20 bg-red-500/80 px-2 md:px-4 py-2 text-slate-200 transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-105 cursor-pointer"
>
  Delete
</button>


    </div>
    {editId === item._id && (
      <div className="mt-4 rounded-2xl border border-slate-300/40 backdrop-blur-xl md:w-full mb-2 p-2
bg-white/5
transition duration-300 cursor-pointer
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]">
    
    <input
    className="w-full md:p-2 p-1 mb-2 rounded-xl border border-white/10 text-white  focus:outline-none px-2 md:px-4 md:py-3 py-2 font-semibold text-lg
bg-white/5
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition"
    placeholder="Topic (e.g. Education)"
    value={form.title}
    onChange={(e) =>
    setForm({ ...form, title: e.target.value })
    }
    />
    
    
    
    
    <textarea
    className="w-full md:p-2 p-1 mb-2 bordertext-lg rounded-xl border border-white/10 text-white  focus:outline-none px-4 py-3
bg-white/5
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition"
    placeholder="Information"
    value={form.content}
    onChange={(e) =>
    setForm({ ...form, content: e.target.value })
    }
    />
    
    <div className='flex gap-2'>

    <button className='bg-green-500 px-2 py-1 hover:cursor-pointer transition duration-300 rounded-md font-semibold hover:bg-green-600 hover:scale-105
    active:scale-95 text-black'
    onClick={async () => {
      if (!form.title.trim() || !form.content.trim()) {
     toast.error("Title and content cannot be empty");
     return;
    }
    
    if (editId) {
    await fetch(`/api/about/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    
    toast.success("Section updated");
  } else {
    await fetch("/api/about", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    
    toast.success("Section added");
  }
  
  fetchAbout();
  
  setForm({
    title: "",
    content: "",
  });
  
  setEditId(null);
  setShowAddForm(false);
}}
>
    Save
    </button>

    <button
    onClick={() => {
      setEditId(null);
      
      setForm({
        title: "",
        content: "",
      });
    }}
    className="bg-gray-500/60 px-2 md:px-3 py-1 rounded-md hover:bg-gray-500 ml-2 transition duration-300 cursor-pointer hover:scale-105 active:scale-95 font-semibold text-black"
    >
    Cancel
  </button>
    </div>
    </div>
    )}
    
  </div>

)))}

{showAddForm && (
  
    <div className="mt-4 p-4 rounded-2xl border border-slate-300/40 backdrop-blur-xl md:w-full w-50 mb-2
bg-white/5
transition duration-300 cursor-pointer
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]">
  
  <input
  className="w-full md:p-2 p-1 mb-2 font-semibold text-lg bordertext-lg rounded-xl border border-white/10 text-white  focus:outline-none px-4 py-3
bg-white/5
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition"
  placeholder="Topic (e.g. Education)"
  value={form.title}
  onChange={(e) =>
  setForm({ ...form, title: e.target.value })
  }
  />
  
  
  
  
  <textarea
  className="w-full md:p-2 p-1 mb-2 border text-lg bordertext-lg rounded-xl border-white/10 text-white  focus:outline-none px-4 py-3
bg-white/5
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition"
  placeholder="Information"
  value={form.content}
  onChange={(e) =>
  setForm({ ...form, content: e.target.value })
  }
  />
  
  <button className='bg-green-500 px-2 py-1 hover:cursor-pointer transition duration-300 rounded-md hover:bg-green-600 hover:scale-105
  active:scale-95 text-black font-semibold'
  onClick={async () => {
  if (!form.title.trim() || !form.content.trim()) {
   toast.error("Title and content cannot be empty");
   return;
  }
  
  if (editId) {
  await fetch(`/api/about/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  
  toast.success("Section updated");
  } else {
  await fetch("/api/about", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  
  toast.success("Section added");
  }
  
  fetchAbout();
  
  setForm({
    title: "",
    content: "",
  });
  
  setEditId(null);
  setShowAddForm(false);
  }}
  >
  Save
  </button>

    <button
    onClick={() => {
      setShowAddForm(false);

      setForm({
        title: "",
        content: "",
      });
    }}
    className="bg-gray-500/60 px-3 py-1 rounded-md hover:bg-gray-500 transition duration-300 cursor-pointer hover:scale-105 ml-2 active:scale-95 text-black font-semibold"
  >
    Cancel
  </button>
  </div>
 
    
)}

<button
onClick={() => {
  setEditId(null);
  setForm({
    title: "",
    content: "",
  });
  setShowAddForm(true);
}}
className="bg-green-500 hover:bg-green-600 transition duration-300 cursor-pointer hover:scale-105 mb-3 mt-4 rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 md:px-6 py-2 md:py-3 font-semibold text-white shadow-lg hover:shadow-cyan-500/30 active:scale-95"
>
  Add Section
</button>



      </div>
    </div>

  )
}

export default page
