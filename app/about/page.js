"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { useActivity } from "@/context/ActivityContext";
import toast from 'react-hot-toast';
import ProtectedRoute from "@/components/ProtectedRoute";

const page = () => {
  
  const [aboutSections, setAboutSections] =
useState([]);
const [showForm, setShowForm] = useState(false);
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

    <div className="min-h-screen bg-gray-200 pt-3 items-center md:py-2 md:px-10 px-5">
      <div className='mx-auto xl:w-200 sm:w-100 w-45'>

{aboutSections.length === 0 ? (
  <div className="text-gray-600 mt-6 font-semibold">
    No information added yet. Add something about yourself.
  </div>
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
          setEditId(item._id);
          setForm(item);
          setShowForm(true);
        }}
        className="bg-blue-500 text-white px-2 py-1 rounded-md transition duration-300 cursor-pointer hover:bg-blue-600"
        >
        Edit
      </button>



    </div>
    
             {showForm && editId === item._id && (
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
    
        <button className='bg-green-500 px-2 py-1 hover:cursor-pointer transition duration-300 rounded-md hover:bg-green-600'
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
              addActivity("About section updated");
              await fetch("/api/notifications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: `About section "${form.title}" updated successfully`,
    type: "success",
  }),
});
      } 
      
      fetchAbout();
      
      setForm({
        title: "",
        content: "",
      });
      
      setEditId(null);
      setShowForm(false);
    }}
    >
          Save
        </button>
      </div>
    )}
  </div>

)))}




      </div>
    </div>
</ProtectedRoute>
  )
}

export default page
