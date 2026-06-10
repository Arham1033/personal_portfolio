"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const defaultSkills = ["JavaScript", "React", "Next.js", "MongoDB"];
  const [skills, setskills] = useState(defaultSkills);
  const [showBtn, setshowBtn] = useState(false);
  const [showInput, setshowInput] = useState(false);
  const [input, setinput] = useState("");
  const [editIndex, seteditIndex] = useState(null);
  const isDisabled = input.trim() === "";
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  // Handle submit
  async function handleAddProject() {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!form.link.trim()) {
      alert("Link is required");
      return;
    }
    if (!form.description.trim()) {
      alert("Description is required");
      return;
    }

    try {
      const payload = {
        ...form,
        image: form.image.trim(),
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        
      });
      toast.success("Project Added Successfully")

      if (!res.ok) {
        throw new Error("Failed to add project");
      }

      setForm({
        title: "",
        link: "",
        description: "",
        image: "",
      });

      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("skills");

    if (saved) {
      const parsedSkills = JSON.parse(saved);

      if (parsedSkills.length > 0) {
        setskills(parsedSkills);
      } else {
        setskills(defaultSkills);
      }
    } else {
      setskills(defaultSkills);
    }

    setLoading(false);
  }, []);

  const openMenu = () => {
    setshowInput(true);
    setshowBtn(true);
  };
  const addskill = () => {
    if (input.trim() === "") return;

    let updatedSkills = [...skills];
    if (editIndex !== null) {
      updatedSkills[editIndex] = input;
      setskills(updatedSkills);
      seteditIndex(null);
       toast.success("Skill updated successfully");
    } else {
      updatedSkills.push(input);
       toast.success("Skill Added Successfully")
    }

    setskills(updatedSkills);
    setinput("");
    setshowInput(false);
    setshowBtn(false);
     
  };

  const editSkill = (index) => {
    seteditIndex(index);
    setinput(skills[index]);
    setshowInput(true);
    setshowBtn(true);
   
  };

  const deleteSkill = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?",
    );
if (confirmDelete){
  toast.success("Deleted Successfully")
}
    if (!confirmDelete) return;

    const updatedSkills = skills.filter((_, i) => i !== index);
    setskills(updatedSkills);
  };

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("skills", JSON.stringify(skills));
    }
  }, [skills, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function handleEdit(project) {
    setForm({
      title: project.title,
      link: project.link,
      description: project.description,
      image: project.image,
    });
    
    setEditingId(project._id);
    setShowForm(true);
    
  }

  async function handleUpdateProject() {
    try {
      const res = await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),

      });
     toast.success("Updated Project")
      if (!res.ok) {
        throw new Error("Update failed");
      }

      setEditingId(null);

      setForm({
        title: "",
        link: "",
        description: "",
        image: "",
      });

      setShowForm(false);

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?",
    );
    if (confirmDelete){
      toast.success("Deleted Project")
    }
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mt-6 py-2">
          <div className="flex items-center gap-4">
            <Image
              src="/welcome.svg"
              alt="Welcome Image"
              width={50}
              height={50}
            />
            <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            Explore my skills and projects.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 ">Skill section</h2>

          {skills.length === 0 ? (
            <p className="text-gray-700 mb-4 font-semibold">
              No skills added yet.
            </p>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {skills.map((skill, index) => (
                <li key={index} className="flex gap-50 mb-2 justify-between">
                  <span className="font-semibold">{skill}</span>
                  <div className="flex gap-2 items-center">
                    {/* EDIT */}
                    <img
                      src="/pencil.svg"
                      alt="edit"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => editSkill(index)}
                    />
                    {/* DELETE */}
                    <img
                      src="/delete.svg"
                      alt="delete"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => deleteSkill(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-4 my-4">
            <button
              onClick={() => {
                openMenu();
              }}
              className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300 hover:cursor-pointer"
            >
              Add Skill
            </button>
          </div>

          {showInput && (
            <div className="flex items-center gap-2 my-4">
              <input
                onChange={(e) => setinput(e.target.value)}
                type="text"
                value={input}
                placeholder="Enter new skill"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2"
              />
              <button
                onClick={() => {
                  addskill();
                }}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-400 hover:bg-gray-500 cursor-pointer"
                }`}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div className="mx-auto w-150">
          <h3 className="text-2xl font-bold my-4">Project section</h3>
          <div className="grid grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <div className="text-gray-600">No projects yet</div>
            ) : (
              projects.map((p) => (
                <div key={p._id} className="bg-gray-300 rounded-lg p-4">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = "/fallback.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg mb-4 text-gray-600 font-medium">
                      No image added
                    </div>
                  )}
                  <div className="font-bold">{p.title}</div>
                  {isValidUrl(p.link) ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline ml-2 font-bold"
                    >
                      (Link)
                    </a>
                  ) : (
                    <span className="text-gray-500 ml-2">(Invalid link)</span>
                  )}
                  <div>{p.description}</div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-green-700 transition duration-300"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
            {showForm && (
              <div className="bg-gray-300 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <input
                  type="text"
                  placeholder="Project Link"
                  className="border p-2 w-full mb-2"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  className="border p-2 w-full mb-2"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="border p-2 w-full mb-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <button
                  onClick={editingId ? handleUpdateProject : handleAddProject}
                  className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition duration-300"
                >
                  {editingId ? "Update Project" : "Add Project"}
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-4 my-4">
            <button
              onClick={() => {
                setShowForm(!showForm);
              }}
              className="px-4 font-normal text-black text-md py-2 bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300 hover:cursor-pointer"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
