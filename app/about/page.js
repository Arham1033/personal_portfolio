"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useActivity } from "@/context/ActivityContext";
import toast from 'react-hot-toast';
import ProtectedRoute from "@/components/ProtectedRoute";

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
    <ProtectedRoute>

    <div className="min-h-screen bg-gray-200 pt-3 items-center md:py-2 md:px-10 pl-5">
      <div className='mx-auto xl:w-200 sm:w-100 w-45'>

{aboutSections.length === 0 ? (
  <>
  <div className="text-gray-600 mt-6 font-semibold">
    No information added yet. Add something about yourself.
  </div>
  </>
) : (
  aboutSections.map((item) => (
    <div key={item._id} className="mt-4">


    <h2 className="md:text-xl text-lg font-semibold">
      {item.title}
    </h2>

    <p className="text-gray-600 md:text-lg">
      {item.content}
    </p>
  

    <div className="flex gap-2 mt-2">

      <button
        onClick={ async () => {
            setShowAddForm(false); 
          setEditId(item._id);
            setForm({
    title: item.title,
    content: item.content,
  });

        }}
        className="bg-blue-500 text-white px-2 py-1 rounded-md transition duration-300 cursor-pointer hover:bg-blue-600 hover:scale-105 active:scale-95"
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
  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300 cursor-pointer hover:scale-105 active:scale-95"
>
  Delete
</button>


    </div>
    {editId === item._id && (
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
    
    <button className='bg-green-500 px-2 py-1 hover:cursor-pointer transition duration-300 rounded-md hover:bg-green-600 hover:scale-105
    active:scale-95'
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
    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 ml-2 transition duration-300 cursor-pointer hover:scale-105 active:scale-95"
  >
    Cancel
  </button>
    </div>
    )}
    
  </div>

)))}

{showAddForm && (
  
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
  
  <button className='bg-green-500 px-2 py-1 hover:cursor-pointer transition duration-300 rounded-md hover:bg-green-600 hover:scale-105
  active:scale-95'
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
    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300 cursor-pointer hover:scale-105 ml-2 active:scale-95"
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
className="bg-green-500 px-3 mt-4 py-2 rounded-md hover:bg-green-600 transition duration-300 cursor-pointer text-black hover:scale-105 active:scale-95 mb-3"
>
  Add Section
</button>



      </div>
    </div>
</ProtectedRoute>
  )
}

export default page
