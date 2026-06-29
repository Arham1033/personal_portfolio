"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
const [skillFilter, setSkillFilter] = useState("all");
  const [skills, setskills] = useState([]);
  const [showBtn, setshowBtn] = useState(false);
    const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [showInput, setshowInput] = useState(false);
  const [input, setinput] = useState("");
  const [editIndex, seteditIndex] = useState(null);
  const [skillCategory, setSkillCategory] = useState("Frontend");
 const isDisabled = !input?.trim();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectFile, setProjectFile] = useState(null);
  const [skillSearch, setSkillSearch] = useState("");
  const defaultCategories = [
  "Web Developement",
  "Mobile App",
  "AI",
  "Game Developement",
  ];
  const [editProjectFile, setEditProjectFile] = useState(null);
const [projectPreview, setProjectPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [categories, setCategories] = useState(defaultCategories);
const [newCategory, setNewCategory] = useState("");
const [editingCategory, setEditingCategory] = useState(null);
  const [filter, setFilter] = useState("all");
  const [addForm, setAddForm] = useState({
  title: "",
  link: "",
  description: "",
  image: "",
  category: "Web Developement",
  featured: false,
  status: "ongoing",
});

const [editForm, setEditForm] = useState({
  title: "",
  link: "",
  description: "",
  image: "",
  category: "Web Developement",
  featured: false,
  status: "ongoing",
});
  const [editingId, setEditingId] = useState(null);

  
  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);
  

  useEffect(() => {
    const stored = localStorage.getItem("user");
    
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      
      fetch(`/api/user/stats/${parsed._id}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data.user);
      });
    }
  }, []);
  
    useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    checkSize();
    window.addEventListener("resize", checkSize);
  
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const filteredSkills = skills
  .filter((skill) => {
    if (skillFilter === "all") return true;
    return skill.category === skillFilter;
  })
  .filter((skill) =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  );
  
  useEffect(() => {
  const saved = localStorage.getItem("activities");
  
  if (saved) {
    setActivities(JSON.parse(saved));
  }
}, []);

const addActivity = (text) => {
  const newActivity = {
    id: Date.now(),
    text,
    time: new Date().toLocaleString(),
  };

  setActivities((prev) => {
    const updated = [newActivity, ...prev].slice(0, 12);
    localStorage.setItem("activities", JSON.stringify(updated));
    return updated;
  });
};

const handleProjectFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) return;
  
  setProjectFile(selected);

  const reader = new FileReader();
  
  reader.onloadend = () => {
    setProjectPreview(reader.result);
    
    setAddForm((prev) => ({
      ...prev,
      image: reader.result,
    }));
  };

  reader.readAsDataURL(selected);
};
  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  async function fetchSkills() {
  const res = await fetch("/api/skills");
  const data = await res.json();
  setskills(data);
}

  // Handle submit
 async function handleAddProject() {
  if (!addForm.title || !addForm.link || !addForm.description) {
    alert("All fields required");
    return;
  }
  
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addForm),
    });
    
    if (!res.ok) throw new Error("Failed");
    
    toast.success("Project Added");
    addActivity(`Project "${addForm.title}" added`);
    // RESET FORM PROPERLY
    setAddForm({
      title: "",
      link: "",
      image: "",
      description: "",
      featured: false,
      status: "ongoing",
    });
    
    setShowForm(false);
    fetchProjects();
    localStorage.setItem("portfolio_sync", Date.now());

  } catch (err) {
    console.error(err);
    alert("Error adding project");
  }
}

useEffect(() => {
  fetchSkills();
}, []);

async function fetchSkills() {
  try {
    const res = await fetch("/api/skills");
    const data = await res.json();

    setskills(data);
    setLoading(false);
  } catch (err) {
    console.error(err);
  }
}

const openMenu = () => {
    setshowInput(true);
    setshowBtn(true);
  };
  
const addskill = async () => {
  if (input.trim() === "") return;

  try {
    if (editIndex !== null) {
      await fetch(`/api/skills/${editIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input,
          category: skillCategory,
        }),
      });

      toast.success("Skill updated");
      addActivity(`Skill "${input}" updated`);
      await fetch("/api/notifications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: `Skill "${input}" updated successfully`,
    type: "info",
  }),
});
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input,
          category: skillCategory,
        }),
      });

      toast.success("Skill added");
      addActivity(`Skill "${input}" added`);
      await fetch("/api/notifications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: `Skill "${input}" added successfully`,
    type: "success",
  }),
});
    }

    setinput("");
    setSkillCategory("Frontend");
    setshowInput(false);
    setshowBtn(false);
    seteditIndex(null);

    fetchSkills();

  } catch (err) {
    console.error(err);
  }
};

const editSkill = (skill) => {
  seteditIndex(skill._id);

  setinput(skill.name);

  setSkillCategory(skill.category);

  setshowInput(true);

  setshowBtn(true);
};


const deleteSkill = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this skill?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });

    toast.success("Deleted Successfully");
    addActivity("Skill deleted");
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Skill deleted successfully",
        type: "warning",
      }),
    });
    fetchSkills();
  } catch (err) {
    console.error(err);
  }
};


  
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }
  
  const handleEditProjectFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setEditProjectFile(selected);
    
    const reader = new FileReader();
    
  reader.onloadend = () => {
    setEditForm((prev) => ({
      ...prev,
      image: reader.result,
    }));
  };
  
  reader.readAsDataURL(selected);
};

const fetchCategories = async () => {
try {
  const res = await fetch("/api/categories");
  const data = await res.json();

  setCategories(data);
} catch (error) {
  console.log(error);
}
};

useEffect(() => {
fetchCategories();
}, []);

function handleEdit(project) {
  setEditingId(project._id);

  setEditForm({
    title: project.title || "",
    link: project.link || "",
    description: project.description || "",
    image: project.image || "",
    category: project.category || "Web Development",
    featured: project.featured ?? false,
    status: project.status || "ongoing",
  });
}

const currentUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;


async function handleUpdateProject() {
  try {
    const res = await fetch(`/api/projects/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    if (!res.ok) throw new Error("Update failed");
    
    toast.success("Updated Project");
    addActivity(`Project "${editForm.title}" updated`);
    setEditingId(null);
    
    setEditForm({
      title: "",
      link: "",
      description: "",
      image: "",
      featured: false,
      status: "ongoing",
    });
    
    fetchProjects();

localStorage.setItem("portfolio_sync", Date.now());

  } catch (err) {
    console.error(err);
  }
}

async function handleDelete(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this project?",
  );
  if (confirmDelete){
    toast.success("Deleted Project")
    addActivity(`Project deleted`);
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
localStorage.setItem("portfolio_sync", Date.now());
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    const saved = localStorage.getItem("projectCategories");
    
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(
      "projectCategories",
      JSON.stringify(categories)
    );
  }, [categories]);
 
  const addCategory = async () => {
  if (!newCategory.trim()) return;

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCategory,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to add category");
      return;
    }

    toast.success("Category Added");

    setNewCategory("");

    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};
  
 const deleteCategory = async (id) => {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Category Deleted");
    addActivity("Category deleted");

    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};

const updateCategory = async () => {
  if (!newCategory.trim()) return;

  const res = await fetch(`/api/categories/${editingCategory}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newCategory,
    }),
  });

  if (res.ok) {
    await fetchCategories(); // Refresh from MongoDB

    toast.success("Category Updated");
    addActivity("Category updated");

    setEditingCategory(null);
    setNewCategory("");
  } else {
    toast.error("Failed to update category");
  }
};

useEffect(() => {
  async function fetchStats() {
    const res = await fetch(`/api/user/stats/${user._id}`);
    const data = await res.json();

    setStats(data.user);
  }

  if (user?._id) fetchStats();
}, [user]);


const filteredProjects = projects
  .filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((p) => {
    if (filter === "all") return true;
    if (filter === "completed") return p.status === "completed";
    if (filter === "ongoing") return p.status === "ongoing";
    if (filter === "featured") return p.featured;
    return true;
  })
  .filter((p) => {
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
  });
const sortedProjects = [...filteredProjects];

if (filter === "newest") {
  sortedProjects.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

if (filter === "oldest") {
  sortedProjects.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}


const totalCategories = new Set(
  projects.map((p) => p.category)
).size;

const projectsThisMonth = projects.filter((project) => {
  const created = new Date(project.createdAt);
  const now = new Date();

  return (
    created.getMonth() === now.getMonth() &&
    created.getFullYear() === now.getFullYear()
  );
}).length;

const visibleActivities = activities.slice(
  0,
  isMobile ? 6 : 12
);

if (loading) {
  return <div>Loading...</div>;
}

  return (
    <>
     <ProtectedRoute>

      <div className="bg-gray-200 min-h-screen flex justify-center pl-8 pr-4">
  <div className="flex flex-col justify-center items-center">

        <div className="flex flex-col items-center justify-center mt-6 py-2">
          <div className="flex items-center md:gap-4 gap-1">

            <Image className="md:w-12 w-8 ml-5"
              src="/welcome.svg"
              alt="Welcome Image"
              width={50}
              height={50}
            />
            <h1 className="md:text-4xl font-bold text-xl ">Welcome to My Portfolio</h1>
          </div>

          <p className="md:text-lg text-gray-600 mb-8 pl-2">
            Explore my skills and projects
          </p>
        </div>

<div className="mb-4">
  <h2 className="font-bold md:text-2xl text-xl mb-3 text-center">Statistic cards</h2>

  <div className="grid md:grid-cols-2 md:gap-3 gap-2 w-fit mx-auto">

    {/* TOTAL PROJECTS */}
    <div className="bg-gray-400 rounded-lg md:py-6 md:px-4 font-semibold py-3 px-2">
      <span>Total projects</span>
      <div>{projects.length}</div>
    </div>

    {/* FEATURED PROJECTS */}
    <div className="bg-gray-400 rounded-lg md:py-6 py-2 md:px-4 px-2 font-semibold">
      <span>Featured Projects</span>
      <div>
        {projects.filter(p => p.featured).length}
      </div>
    </div>

    {/* SKILLS */}
    <div className="bg-gray-400 rounded-lg md:py-6 py-2 md:px-4 px-2 font-semibold">
      <span>Skills</span>
      <div>{skills.length}</div>
    </div>

    {/* COMPLETED PROJECTS */}
    <div className="bg-gray-400 rounded-lg md:py-6 py-2 md:px-4 px-2 font-semibold">
      <span>Completed projects</span>
      <div>
        {projects.filter(p => p.status === "completed").length}
      </div>
    </div>
</div>

    <h1 className="text-center font-bold text-2xl mt-4">User Statics</h1>
  <div className="bg-gray-400 rounded-lg md:py-6 py-2 md:px-4 px-2 font-semibold my-4 mb-0 w-50 mx-auto">
  <span>Projects This Month: </span>
  <span>{projectsThisMonth}</span>

  <div>
<p>Login Count: {stats?.loginCount ?? "Login first"}</p>
<p>Profile Views: {stats?.profileViews ?? "Login first"}</p>
  <p>
    Account Created at:{" "}
{stats?.createdAt
  ? new Date(stats.createdAt).toLocaleDateString()
  : "Not available"}
  </p>
</div>
</div>
  </div>

<div className="bg-gray-300 p-4 rounded-lg my-6">
  <h2 className="text-xl font-bold mb-3">Recent Activities</h2>

  {visibleActivities.length === 0 ? (
    <p className="text-gray-600">No activity yet</p>
  ) : (
    <ul className="grid gap-2 md:grid-cols-3 grid-cols-1">
      {visibleActivities.map((act) => (
        <li
        key={act.id}
        className="bg-gray-200 p-2 rounded-md text-sm"
        >
          <div className="font-semibold truncate w-35">{act.text}</div>
          <div className="text-xs text-gray-500">{act.time}</div>
        </li>
      ))}
    </ul>
  )}
</div>

        <div className="">
          <h2 className="md:text-2xl text-xl font-bold mb-4 text-center ">Skill section</h2>
<div className="flex flex-col">

<input
  type="text"
  placeholder="Search skills..."
  value={skillSearch}
  onChange={(e) => setSkillSearch(e.target.value)}
  className="border rounded-lg p-2 mb-4 ml-2"
/>

<select
  value={skillFilter}
  onChange={(e) => setSkillFilter(e.target.value)}
  className="border rounded-lg p-2 mb-4 md:w-40 md:mx-2 mx-10"
>
  <option value="all">All Skills</option>
  <option value="Frontend">Frontend</option>
  <option value="Backend">Backend</option>
  <option value="Database">Database</option>
  <option value="Tools">Tools</option>
</select>
  </div>

          {filteredSkills.length === 0 ? (
            <p className="text-gray-700 mb-4 font-semibold text-center">
              No skills added yet.
            </p>
          ) : (
            
            <ul className="list-disc list-inside text-gray-700 w-50 sm:w-100">
              {filteredSkills.map((skill) => (
                
                <li key={skill._id} className="flex md:gap-50 gap-15 mb-2 justify-between">
                  <span className="font-semibold text-black truncate md:w-40 w-30">{skill.name}</span>
                  <div className="flex gap-2 items-center">
                    {/* EDIT */}
                    <img
                      src="/pencil.svg"
                      alt="edit"
                      className="md:w-5 md:h-5 h-4 w-4 cursor-pointer"
                      onClick={() => editSkill(skill)}
                      />
                    {/* DELETE */}
                    <img
                      src="/delete.svg"
                      alt="delete"
                      className="md:w-5 h-4 md:h-5 w-5 cursor-pointer"
                      onClick={() => deleteSkill(skill._id)}
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
              className="md:px-4 px-3 py-1 md:py-2 bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300 hover:cursor-pointer"
            >
              Add Skill
            </button>
          </div>

          {showInput && (
            
            <div className="flex md:flex-row flex-col items-center gap-2 my-4 ">
              <input
                onChange={(e) => setinput(e.target.value)}
                type="text"
                value={input}
                placeholder="Enter new skill"
                className="md:px-4 px-2 md:py-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 md:mr-2"
                />
                <select
  value={skillCategory}
  onChange={(e) => setSkillCategory(e.target.value)}
  className="border rounded-lg p-2"
>
  <option value="Frontend">Frontend</option>
  <option value="Backend">Backend</option>
  <option value="Database">Database</option>
  <option value="Tools">Tools</option>
</select>
              <button
                onClick={() => {
                  addskill();
                }}
                disabled={isDisabled}
                className={`md:px-4 px-2 md:py-2 py-1 rounded-lg transition duration-300 ${
                  isDisabled
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-gray-500 cursor-pointer"
                }`}
                >
                Add
              </button>
            </div>
          )}
        </div>


        <div className="mx-auto md:w-160 w-60 md:px-2 ">
          <h3 className="md:text-2xl text-xl font-bold my-4 text-center">Project section</h3>

<div className="flex md:flex-row flex-col gap-5 mb-4">
          <input
  type="text"
  placeholder="Search projects..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="border py-1 rounded-lg px-2 md:w-100 w-50 mx-auto"
/>



  </div>
<div className="bg-gray-300 p-4 rounded-lg mb-4 md:w-100 mx-auto">

<h2 className="font-bold md:text-xl text-lg mb-3 text-center">
Project Categories
</h2>

<div className="flex gap-2 md:flex-row flex-col mb-3">

<input
  type="text"
  value={newCategory}
  placeholder="Enter category"
  onChange={(e) =>
    setNewCategory(e.target.value)
  }
  className="border rounded-lg p-2"
/>
<button
  onClick={
    editingCategory !== null
    ? updateCategory
    : addCategory
  }
  className="bg-blue-500 hover:bg-blue-600 text-white md:px-3 px-2 md:py-2 py-1 transition duration-300 cursor-pointer rounded"
>

  {editingCategory !== null
    ? "Update"
    : "Add"}
</button>
    

</div>

{categories.map((cat) => (
  <div
    key={cat._id}
    className="flex justify-between mb-2 font-semibold gap-2"
  >
    <span className="md:w-auto w-100 truncate">
      {cat.name}
    </span>

    <div className="flex gap-2">
      <button className="hover:cursor-pointer transition duration-300 bg-green-500 hover:bg-green-600 px-2 py-1 rounded-md"
        onClick={() => {
          setEditingCategory(cat._id);
          setNewCategory(cat.name);
        }}
        >
        Edit
      </button>

      <button className="hover:cursor-pointer transition duration-300 bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
        onClick={() => deleteCategory(cat._id)}
      >
        Delete
      </button>
    </div>
  </div>
))}

</div>

<div className="flex md:flex-row flex-col items-center gap-3 justify-center">

  <div className="font-semibold border px-2 py-2 rounded-lg">Categories: {categories.length}</div>

<div className="flex md:gap-3 gap-1">
<select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border rounded-lg py-1 md:py-2 md:px-3 px-0 sm:px-1 ml-2"
>
  <option value="all">All Projects</option>
  <option value="completed">Completed</option>
  <option value="ongoing">Ongoing</option>
  <option value="featured">Featured</option>
  <option value="newest">Newest First</option>
<option value="oldest">Oldest First</option>
</select>


<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="border rounded-md md:p-2 sm:p-1 md:w-fit w-30"
>
  <option value="all">All Categories</option>

   {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>
    </div>

<button
  onClick={() => window.open("/preview", "_blank")}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer transition duration-300"
>
  Preview Portfolio
</button>

  </div>
          <div className="grid md:grid-cols-2 grid-col-1 md:gap-4 gap-2 md:w-auto w-45 mx-5 my-4">
            {sortedProjects.length === 0 ? (
              <div className="text-gray-600 text-center">No Projects Found.</div>
            ) : (
              sortedProjects.map((p) => (
                <React.Fragment key={p._id}>

                <div className="bg-gray-300 rounded-lg md:p-4 p-2">
                  {p.image ? (
                    <img
                    src={p.image}
                    alt={p.title}
                    className="rounded-lg md:w-fit w-50 mb-4"
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
                    <span className="text-gray-500 ">(Invalid link)</span>
                  )}
                  <div>{p.description}</div>
                
                 <div className="text-sm text-gray-600">
  Created: {new Date(p.createdAt).toLocaleDateString()}
</div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-green-600 text-white md:px-3 px-2 py-1 rounded hover:cursor-pointer hover:bg-green-700 transition duration-300"
                      >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white md:px-3 px-2 py-1 rounded hover:cursor-pointer hover:bg-red-600 transition duration-300"
                      >
                      Delete
                    </button>

                  </div>
                  </div>

           {editingId === p._id && (
             <div className="bg-gray-200 rounded-md md:p-4 mt-4">

    <input
      type="text"
      placeholder="Title"
      value={editForm.title}
      onChange={(e) =>
        setEditForm({ ...editForm, title: e.target.value })
      }
      className="md:w-full w-50 mb-2 px-4 py-2 border rounded-lg"
      />

    <input
      type="text"
      placeholder="Project Link"
      value={editForm.link}
      onChange={(e) =>
        setEditForm({ ...editForm, link: e.target.value })
      }
      className="md:w-full w-50 mb-2 border rounded-lg p-2"
    />

   <div className="flex items-center gap-3 mb-2">
  <label className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded">
    Choose Image

    <input
      type="file"
      accept="image/*"
      onChange={handleEditProjectFile}
      className="hidden"
      />
  </label>

  <span className="text-sm">
     {editProjectFile?.name || "No file selected"}
  </span>
</div>


    <textarea
      placeholder="Description"
      value={editForm.description}
      onChange={(e) =>
        setEditForm({ ...editForm, description: e.target.value })
      }
      className="md:w-full w-50 mb-2 border rounded-lg p-2"
      />

     <div className="flex md:flex-row flex-col gap-2 pt-2 pb-3 items-center">
      <div>Select Category type:</div>
          <select className="font-semibold border rounded-md p-2"
            value={editForm.category}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                category: e.target.value,
              })
            }
            >
   {categories.map((cat) => (
     <option key={cat._id} value={cat.name}>
    {cat.name}
  </option>
))}
          </select>
            </div>

    {/* FEATURED */}
    <label className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={editForm.featured}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            featured: e.target.checked,
          })
        }
      />
      Featured Project
    </label>

    {/* STATUS */}
    <select
      value={editForm.status}
      onChange={(e) =>
        setEditForm({ ...editForm, status: e.target.value })
      }
      className="md:w-full w-50 mb-2 border rounded-lg p-2"
      >
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
    </select>

    <button
      onClick={handleUpdateProject}
      className="bg-green-500 text-white px-4 py-2 rounded"
      >
      Update Project
    </button>
  </div>
)}
       </React.Fragment>
                
              ))
            )}
           
            
          </div>
          <div className="flex gap-4 my-4">
            <button
              onClick={() => {
                setShowForm(!showForm);
              }}
              className="md:px-4 px-2 font-normal text-black text-md md:py-2 py-1 bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300 hover:cursor-pointer w-auto mx-auto"
              >
              Add Project
            </button>

          </div>

{showForm && (
  <div className="bg-gray-200 rounded-lg p-4 mt-4">

    <input
      type="text"
      placeholder="Title"
      value={addForm.title}
      onChange={(e) =>
        setAddForm({ ...addForm, title: e.target.value })
      }
      className="md:w-full w-50 mb-2 px-4 py-2 border rounded-lg"
      />

    <input
      type="text"
      placeholder="Project Link"
      value={addForm.link}
      onChange={(e) =>
        setAddForm({ ...addForm, link: e.target.value })
      }
      className="md:w-full w-50 mb-2 px-4 py-2 border rounded-lg"
      />

    


<div className="flex items-center gap-3 mb-2">
  <label className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded">
    Choose Image

    <input
      type="file"
      accept="image/*"
      onChange={handleProjectFile}
      className="hidden"
      />
  </label>

  <span className="text-sm">
    {projectFile?.name || "No file selected"}
  </span>
</div>





    <textarea
      placeholder="Description"
      value={addForm.description}
      onChange={(e) =>
        setAddForm({ ...addForm, description: e.target.value })
      }
      className="md:w-full w-50 px-4 py-2 border rounded-lg"
    />
    <div className="flex md:flex-row flex-col gap-2 pt-2 pb-3 items-center">
      <div className="">Select Category type:</div>
          <select
  value={addForm.category}
  onChange={(e) =>
    setAddForm({ ...addForm, category: e.target.value })
  }
  className="font-semibold border rounded-md p-2"
>
   {categories.map((cat) => (
     <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>
            </div>

    {/* FEATURED */}
    <label className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={addForm.featured}
        onChange={(e) =>
          setAddForm({
            ...addForm,
            featured: e.target.checked,
          })
        }
      />
      Featured Project
    </label>

    {/* STATUS */}
    <select
      value={addForm.status}
      onChange={(e) =>
        setAddForm({ ...addForm, status: e.target.value })
      }
      className="md:w-full w-50 mb-2 border rounded-lg p-2"
    >
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
    </select>

    <button
      onClick={handleAddProject}
      className="bg-blue-500 text-white px-4 py-2 rounded"
      >
      Save Project
    </button>

  </div>
)}

 </div>
      </div>
              </div>
</ProtectedRoute>
    </>
  );
}
