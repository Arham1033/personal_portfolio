"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import React from "react";
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
  return <div className="text-center py-4 bg-indigo-500/50 text-white h-screen">Loading...</div>;
}

  return (
    <>
     <ProtectedRoute>

     <div className="
relative
min-h-screen
overflow-hidden
bg-[#030712]
text-white
flex
justify-center
px-2
md:px-8 xl:pl-0 md:pl-10 pl-10
">
    <div className="absolute -top-40 -left-32 h-112.5 w-112.5 rounded-full bg-indigo-500/80 blur-[140px]" />

<div className="absolute top-1/3 -right-32 h-125 w-125 rounded-full bg-cyan-500/80 blur-[170px]" />

<div className="absolute top-[40%] -left-32 h-125 w-125 rounded-full bg-blue-500/80 blur-[170px]" />

<div className="absolute bottom-0 left-1/2 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-purple-500/80 blur-[180px]" />

  <div
className="relative z-10 w-full max-w-7xl md:py-7 py-4 flex flex-col items-center
"
>

       <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 md:px-8 py-3 md:py-10 text-center shadow-[0_0_60px_rgba(99,102,241,0.15)] relative overflow-hidden">
<div className="absolute -top-24 left-0 h-56 w-56 rounded-full bg-indigo-500/50 blur-[120px]" />

<div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-cyan-500/50 blur-[120px]" />

      <div className="relative z-10 flex items-center justify-center gap-3">

           <Image
className="w-8 md:w-12 drop-shadow-[0_0_20px_rgba(99,102,241,.7)]"
              src="/welcome.svg"
              alt="Welcome Image"
              width={50}
              height={50}
            />
           <h1 className="text-2xl md:text-4xl font-extrabold bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Welcome to My Portfolio</h1>
          </div>


      <p className=" text-slate-300 md:text-lg">
            Explore my skills and projects
          </p>
        </div>


<div className="mb-4 flex gap-3 md:gap-5 flex-col md:flex-row flex-gap">
  <div>

  <h2 className="font-bold md:text-2xl text-xl mb-3 text-center mt-3 bg-linear-to-r from-gray-400 via-indigo-300 to-neutral-400 bg-clip-text text-transparent">Statistic cards</h2>

  <div className="grid md:grid-cols-2 gap-3 md:gap-5">

    {/* TOTAL PROJECTS */}
    <div className="
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
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
">
      <p className="text-sm uppercase tracking-widest text-slate-300">
Total Projects
</p>
      <div className="font-bold text-white text-lg">
{projects.length}
</div>
    </div>

    {/* FEATURED PROJECTS */}
    <div className="
group
rounded-2xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
p-4 md:p-6
flex 
items-center gap-2
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
">
     <p className="text-sm uppercase tracking-widest text-slate-300">
Featured Projects
</p>
      <div className="font-bold text-white text-lg">
        {projects.filter(p => p.featured).length}
      </div>
    </div>

    {/* SKILLS */}
    <div className="
group
rounded-2xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
p-4 md:p-6
flex 
items-center gap-2
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
">
      <p className="text-sm uppercase tracking-widest text-slate-300">
Skills
</p>
      <div className="font-bold text-white text-lg">{skills.length}</div>
    </div>

    {/* COMPLETED PROJECTS */}
    <div className="
group
rounded-2xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
p-4 md:p-6
flex 
items-center gap-2
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_35px_rgba(34,211,238,.25)]
">
      <p className="text-sm uppercase tracking-widest text-slate-300">
        Completed Projects
</p>
      <div className="font-bold text-white text-lg">
        {projects.filter(p => p.status === "completed").length}
      </div>
    </div>
</div>

  </div>
<div>

    <h1 className="text-center font-bold text-2xl mt-3 bg-linear-to-r from-gray-400 via-indigo-300 to-neutral-400 bg-clip-text text-transparent">User Statics</h1>
 <div
className="
md:mt-3 mt-2
rounded-2xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
p-4 md:p-7
w-full
max-w-md
shadow-[0_0_30px_rgba(99,102,241,.15)]
"
>
 <span className="text-slate-300 uppercase text-xs tracking-widest">
Projects This Month:
</span>
 <span className=" text-slate-300 text-sm ml-2">
{projectsThisMonth}
</span>

  <div className="space-y-3 border-t border-white/10 pt-4 text-slate-300 uppercase text-xs tracking-widest">
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
  </div>

<div
className="
w-fit
rounded-xl md:rounded-3xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
md:p-6 p-2
my-4 md:my-8
shadow-[0_0_40px_rgba(99,102,241,.15)]
"
>
  <h2 className="md:text-3xl text-xl font-bold md:mb-6 mb-4 text-white">Recent Activities</h2>

  {visibleActivities.length === 0 ? (
   <p className="text-slate-300 text-center py-6">No activity yet</p>
  ) : (
   <ul className="grid md:grid-cols-3 gap-2 md:gap-5 frid-cols-1">
      {visibleActivities.map((act) => (
       <li
key={act.id}
className="
group
xl:w-70
rounded-2xl
border
border-white/10
bg-white/5
backdrop-blur-lg
p-3
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_30px_rgba(34,211,238,.25)]
"
>
          <div className="font-semibold text-white truncate">{act.text}</div>
          <div className="text-sm text-slate-400 mt-2">{act.time}</div>
        </li>
      ))}
    </ul>
  )}
</div>

      <div
className="
w-fit
rounded-3xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/10
to-cyan-400/10
backdrop-blur-xl
md:p-8 p-3
shadow-[0_0_40px_rgba(99,102,241,.15)]
"
>
        <h2 className="md:text-3xl text-xl font-bold text-center">Skill section</h2>
<div className="flex flex-col">

<input
  type="text"
  placeholder="Search skills..."
  value={skillSearch}
  onChange={(e) => setSkillSearch(e.target.value)}
  className="
xl:w-130
rounded-xl
border
border-white/10
bg-white/5
px-4
py-2 md:py-3
my-4
text-white
placeholder:text-slate-500
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
"
/>

<select
  value={skillFilter}
  onChange={(e) => setSkillFilter(e.target.value)}
  className="
rounded-xl
border
border-white/10
bg-white/5
px-4
w-fit
py-2 md:py-3
text-white
focus:border-indigo-400
outline-none
"
>
 <option className="bg-[#3d3d3d] text-white" value="all">
  All Skills
</option>

<option className="bg-[#3d3d3d] text-white" value="Frontend">
  Frontend
</option>

<option className="bg-[#3d3d3d] text-white" value="Backend">
  Backend
</option>

<option className="bg-[#3d3d3d] text-white" value="Database">
  Database
</option>

<option className="bg-[#3d3d3d] text-white" value="Tools">
  Tools
</option>
</select>
  </div>

          {filteredSkills.length === 0 ? (
            <p className="text-slate-300 mb-2 md:mb-4 font-semibold text-center">
              No skills added yet.
            </p>
          ) : (
            
           <ul className="grid md:grid-cols-2 gap-2 md:gap-4 mt-3 md:mt-6">
              {filteredSkills.map((skill) => (
                
                <li
key={skill._id}
className="
group
flex
items-center
justify-between
rounded-2xl
border
border-white/10
bg-white/5
backdrop-blur-lg
md:p-4 p-2
transition-all
duration-300
hover:-translate-y-1
hover:border-purple-400
hover:shadow-[0_0_25px_rgba(168,85,247,.3)]
"
>
                  <span className="font-semibold text-white truncate">{skill.name}</span>
                  <div className="flex gap-1 md:gap-2 items-center">
                    {/* EDIT */}
                    <img
                      src="/pencil.svg"
                      alt="edit"
                     className="
                     w-7
h-7
p-1
cursor-pointer
opacity-70
transition-all
duration-300
hover:opacity-100
hover:scale-125
bg-linear-to-r
from-indigo-500
to-cyan-500
rounded-full
"
                      onClick={() => editSkill(skill)}
                      />
                    {/* DELETE */}
                    <img
                      src="/delete.svg"
                      alt="delete"
                   className="
w-7
h-7
p-1
cursor-pointer
opacity-70
transition-all
duration-300
hover:opacity-100
bg-linear-to-r
from-indigo-500
to-cyan-500
rounded-full
hover:scale-125
"
                      onClick={() => deleteSkill(skill._id)}
                      />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2 md:gap-4 my-4">
            <button
              onClick={() => {
                openMenu();
              }}
              className="
rounded-xl
bg-linear-to-r
from-indigo-500
to-cyan-500
cursor-pointer
px-4 md:px-6
py-2 md:py-3
font-semibold
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_30px_rgba(99,102,241,.45)]
"
            >
              Add Skill
            </button>
          </div>

          {showInput && (
            
          <div
className="
mt-4 md:mt-8
rounded-2xl
border
border-white/10
bg-white/5
backdrop-blur-xl
p-1 md:p-2
flex
flex-col
md:flex-row
items-center
gap-2 md:gap-4
"
>
              <input
                onChange={(e) => setinput(e.target.value)}
                type="text"
                value={input}
                placeholder="Enter new skill"
             className="
flex-1
rounded-xl
border
border-white/10
bg-white/5
px-4
py-2
text-white
placeholder:text-slate-300
outline-none
focus:border-indigo-400
"
                />
                <select
  value={skillCategory}
  onChange={(e) => setSkillCategory(e.target.value)}
className="
rounded-xl
border
border-white/10
bg-white/5
px-4
w-fit
py-2
text-white
focus:border-indigo-400
outline-none
"
>
 <option className="bg-[#3d3d3d] text-white" value="all">
  All Skills
</option>

<option className="bg-[#3d3d3d] text-white" value="Frontend">
  Frontend
</option>

<option className="bg-[#3d3d3d] text-white" value="Backend">
  Backend
</option>

<option className="bg-[#3d3d3d] text-white" value="Database">
  Database
</option>

<option className="bg-[#3d3d3d] text-white" value="Tools">
  Tools
</option>
</select>
<div className="flex justify-center items-center gap-2">

              <button
                onClick={() => {
                  addskill();
                }}
                disabled={isDisabled}
              className={`
rounded-xl
px-4 md:px-6
py-2
font-semibold
transition-all
duration-300
${
isDisabled
? "bg-green-500/60 cursor-not-allowed"
: "bg-linear-to-r cursor-pointer from-green-500 to-emerald-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,.4)]"
}
`}
                >
                Add
              </button>

               <button
      onClick={() => {
    setshowInput(false);
        setinput("");
        setSkillCategory("Frontend"); // optional: reset category
      }}
      className="cursor-pointer hover:scale-110 transition duration-300"
    >
      <img
        src="/back.svg"
        alt="Cancel"
     className="w-7 h-7 cursor-pointer transition-all duration-300 hover:scale-110 invert"
      />
    </button>
          </div>

            </div>
          )}
        </div>


       <div
className="
xl:w-280
md:mt-7
w-fit
mt-4
rounded-3xl
border
border-white/10
bg-white/5
bg-linear-to-br
from-indigo-500/20
to-cyan-400/10
backdrop-blur-xl
p-2 md:p-4
shadow-[0_0_50px_rgba(99,102,241,.15)]
"
>
         <h3 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8">Project section</h3>

<div className="flex md:flex-row flex-col gap-2 md:gap-5 mb-4">
          <input
  type="text"
  placeholder="Search projects..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
w-full
max-w-xl
mx-auto
rounded-xl
border
border-white/10
bg-white/5
px-4
py-2 md:py-3
text-white
placeholder:text-slate-300
focus:border-cyan-400
focus:ring-2
focus:ring-cyan-500/30
outline-none
"
/>



  </div>
<div
className="
rounded-2xl
border
border-white/10
bg-white/5
backdrop-blur-xl
p-2 md:p-6
max-w-2xl
mx-auto
mb-6
"
>

<h2 className="font-bold md:text-xl text-lg mb-3 text-center">
Project Categories
</h2>

<div className="flex gap-2 md:flex-row flex-col justify-between my-3 bg-white/10 p-1 md:p-2 rounded-xl">

<input
  type="text"
  value={newCategory}
  placeholder="Enter category"
  onChange={(e) =>
    setNewCategory(e.target.value)
  }
 className="
w-full
max-w-xl
mx-auto
rounded-xl
border
border-white/20
bg-white/5
px-4
py-2
text-white
placeholder:text-slate-300
focus:border-cyan-400
focus:ring-2
focus:ring-cyan-500/30
outline-none
"
/>
<button
  onClick={
    editingCategory !== null
    ? updateCategory
    : addCategory
  }
  className="rounded-xl
bg-linear-to-r
from-indigo-500
to-cyan-500
cursor-pointer
px-4 md:px-6
w-fit
py-2
font-semibold
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
>

  {editingCategory !== null
    ? "Update"
    : "Add"}
</button>
    

</div>

{categories.map((cat) => (
  <div
    key={cat._id}
    className="
flex
justify-between
items-center
rounded-xl
border
border-white/10
bg-white/5
p-2
mb-2
"
  >
    <span className=" md:w-100 truncate">
      {cat.name}
    </span>

    <div className="flex gap-2">
      <button 
        onClick={() => {
          setEditingCategory(cat._id);
          setNewCategory(cat.name);
        }}
        >
          <img
                      src="/pencil.svg"
                      alt="edit"
                   className="
w-7
h-7
p-1
cursor-pointer
opacity-70
transition-all
duration-300
hover:opacity-100
bg-linear-to-r
from-indigo-500
to-cyan-500
rounded-full
hover:scale-125
"
          
                      />
      </button>

      <button
        onClick={() => deleteCategory(cat._id)}
      >
          <img
                      src="/delete.svg"
                      alt="delete"
                   className="
w-7
h-7
p-1
cursor-pointer
opacity-70
transition-all
duration-300
hover:opacity-100
bg-linear-to-r
from-indigo-500
to-cyan-500
rounded-full
hover:scale-125
"
                      />
      </button>
    </div>
  </div>
))}

</div>

<div className="flex md:flex-row flex-col items-center gap-3 justify-center my-3 md:my-6">

  <div className="font-semibold px-2 py-2 rounded-lg
border
hover:scale-105
transition duration-300
border-white/10
bg-white/10
w-fit
text-slate-900
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)] bg-linear-to-br from-indigo-400 to-cyan-500">Categories: {categories.length}</div>

<div className="flex md:gap-3 gap-1 ">
<select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className=" rounded-lg py-1 md:py-2 md:px-3 px-0 sm:px-1 ml-2
border
border-white/10
bg-white/10
transition duration-300
w-fit cursor-pointer
text-white
hover:scale-105
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
>


  <option className="bg-[#3d3d3d] text-white" value="all">All Projects</option>
  <option className="bg-[#3d3d3d] text-white" value="completed">Completed</option>
  <option className="bg-[#3d3d3d] text-white" value="ongoing">Ongoing</option>
  <option className="bg-[#3d3d3d] text-white" value="featured">Featured</option>
  <option className="bg-[#3d3d3d] text-white" value="newest">Newest First</option>
<option className="bg-[#3d3d3d] text-white" value="oldest">Oldest First</option>
</select>


<select 
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="rounded-md md:p-2 sm:p-1 md:w-fit w-30 opacity-90 transition-all
duration-300
border
border-white/10
bg-white/10
px-0 md:px-4
hover:scale-105
cursor-pointer
py-2
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
>
  <option className="bg-[#3d3d3d] text-white" value="all">All Categories</option>

   {categories.map((cat) => (
    <option className="bg-[#3d3d3d] text-white" key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>
    </div>

<button
  onClick={() => window.open("/preview", "_blank")}
  className=" text-slate-900 px-4 py-2 rounded cursor-pointer transition duration-300 hover:scale-105
active:scale-95 border
font-semibold
border-white/10
bg-white/10
w-fit
focus:border-indigo-400
hover:shadow-[0_0_30px_rgba(99,102,241,.45)]
outline-none
bg-linear-to-br from-indigo-400 to-cyan-500"
>
  Preview Portfolio
</button>

  </div>
          <div className="grid md:grid-cols-3 sm:grid-col-2 grid-col-1 md:gap-4 gap-2 md:w-auto mx-4 md:mx-5 my-4">
            {sortedProjects.length === 0 ? (
              <div className="text-slate-300 text-center">No Projects Found.</div>
            ) : (
              sortedProjects.map((p) => (
                <React.Fragment key={p._id}>

          <div
className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-linear-to-br
from-white/5
to-white/2
backdrop-blur-xl
p-2 md:p-3
transition-all
duration-500
hover:-translate-y-3
hover:border-cyan-400
hover:shadow-[0_0_45px_rgba(34,211,238,.25)]
"
>
                  {p.image ? (
                    <img
                    src={p.image}
                    alt={p.title}
                   className="
w-full
h-52
object-cover
rounded-2xl
transition-transform
duration-500
group-hover:scale-105
"
                    onError={(e) => {
                      e.target.src = "/fallback.png";
                    }}
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-indigo-300 rounded-lg mb-4 text-gray-600 font-medium">
                      No image added
                    </div>
                  )}
               <div className="text-xl md:text-2xl font-bold text-white mt-2 md:mt-4">{p.title}</div>
                  {isValidUrl(p.link) ? (
                    <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-500 hover:underline hover:text-cyan-600 font-bold transition duration-300"
                    >
                      (Link)
                    </a>
                  ) : (
                    <span className="text-slate-300 ">(Invalid link)</span>
                  )}
               <div className=" text-slate-300 leading-7">
{p.description}
</div>
                
                 <div className="text-sm text-slate-300">
  Created: {new Date(p.createdAt).toLocaleDateString()}
</div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                     className="
rounded-lg
bg-linear-to-r
from-green-500
to-emerald-500
px-4
py-2
cursor-pointer
font-semibold
transition-all
duration-300
hover:scale-105
active:scale-95
"
                      >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                       className="
rounded-lg
bg-linear-to-r
from-red-500
to-rose-500
px-4
py-2
cursor-pointer
font-semibold
transition-all
duration-300
hover:scale-105
active:scale-95
"
                      >
                      Delete
                    </button>

                  </div>
                  </div>

           {editingId === p._id && (
          <div
className="
rounded-2xl
border
border-white/10
bg-white/5
backdrop-blur-xl
p-1 md:p-3
"
>

    <input
      type="text"
      placeholder="Title"
      value={editForm.title}
      onChange={(e) =>
        setEditForm({ ...editForm, title: e.target.value })
      }
      className="
w-full
rounded-lg
border
bg-white/5
px-4
py-2
border-white/40
text-white
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
"
      />

    <input
      type="text"
      placeholder="Project Link"
      value={editForm.link}
      onChange={(e) =>
        setEditForm({ ...editForm, link: e.target.value })
      }
      className="
w-full
rounded-lg
border
bg-white/5
px-4
py-2
text-white
border-white/40
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
my-2
"
    />

   <div className="flex items-center gap-3 mb-2">
  <label className="
cursor-pointer
rounded-lg
bg-linear-to-r
from-indigo-500
to-cyan-500
px-3
py-2
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_25px_rgba(99,102,241,.4)]
">
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
     className="
w-full
rounded-lg
border
bg-white/5
px-4
py-2
text-white
border-white/40
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
"
      />

     <div className="flex md:flex-row flex-col gap-2 pt-2 pb-3 items-center border
border-white/10
bg-white/10 rounded-lg
px-1">
      <div>Select Category type:</div>
          <select className="font-semibold border rounded-md p-2 border-white/40
bg-white/10
transition duration-300
w-fit cursor-pointer
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
            value={editForm.category}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                category: e.target.value,
              })
            }
            >
   {categories.map((cat) => (
     <option className="text-white bg-[#3d3d3d]" key={cat._id} value={cat.name}>
    {cat.name}
  </option>
))}
          </select>
            </div>

    {/* FEATURED */}
    <label className="flex items-center gap-2 my-2">
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
      className="md:w-full w-50 mb-2 border rounded-lg p-2 border-white/40
bg-white/10
transition duration-300 cursor-pointer
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
      >
      <option className="bg-[#3d3d3d]  text-white" value="ongoing">Ongoing</option>
      <option className="bg-[#3d3d3d] text-white" value="completed">Completed</option>
    </select>

    <button
      onClick={handleUpdateProject}
      className="bg-indigo-500 text-white px-4 py-2 rounded hover:scale-105
active:scale-95 transition duration-300 hover:cursor-pointer font-semibold hover:bg-indigo-600/80"
      >
      Update Project
    </button>
      <img
    src="/back.svg"
    alt="Cancel"
    className="w-6 h-6 cursor-pointer hover:scale-110 transition duration-300 mt-2 invert"
    onClick={() => {
      setEditingId(null);
      setEditProjectFile(null);
      setProjectPreview("");

      setEditForm({
        title: "",
        link: "",
        description: "",
        image: "",
        category: "Web Developement",
        featured: false,
        status: "ongoing",
      });
    }}
  />
  </div>
)}
       </React.Fragment>
                
              ))
            )}
           
            
          </div>
{showForm && (
  <div
className="
mt-3 md:mt-4
md:mx-0 mx-3
rounded-3xl
border
border-white/10
bg-white/5
backdrop-blur-xl
p-2 md:p-6
shadow-[0_0_40px_rgba(99,102,241,.15)]
"
>
    <img
       src="/back.svg"
       alt="Cancel"
       className="invert w-6 h-6 cursor-pointer hover:scale-110 transition duration-300 mb-2"
       onClick={() => {
         setShowForm(false);
   
         setProjectFile(null);
         setProjectPreview("");
   
         setAddForm({
           title: "",
           link: "",
           description: "",
           image: "",
           category: "Web Developement",
           featured: false,
           status: "ongoing",
          });
       }}
     />

    <input
      type="text"
      placeholder="Title"
      value={addForm.title}
      onChange={(e) =>
        setAddForm({ ...addForm, title: e.target.value })
      }
     className="
     w-full
rounded-xl
border
border-white/40
bg-white/5
px-4
py-2
text-white
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
"
      />

    <input
      type="text"
      placeholder="Project Link"
      value={addForm.link}
      onChange={(e) =>
        setAddForm({ ...addForm, link: e.target.value })
      }
       className="
       w-full
       rounded-xl
       border
border-white/40
bg-white/5
px-4
py-2
text-white
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
my-2
"
      />
<div className="flex items-center gap-3 mb-2">
  <label className="
cursor-pointer
rounded-lg
bg-linear-to-r
from-indigo-500
to-cyan-500
px-2 md:px-3
py-2
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_25px_rgba(99,102,241,.4)]
">
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
        className="
        w-full
        rounded-xl
        border
border-white/40
bg-white/5
px-4
py-2
text-white
placeholder:text-slate-300
focus:border-indigo-400
focus:ring-2
focus:ring-indigo-500/30
outline-none
transition
"
    />

    <div className="flex md:flex-row flex-col gap-2 pt-2 pb-3 items-center border
border-white/10
bg-white/10 rounded-lg
px-1">
      <div className="">Select Category type:</div>
          <select
  value={addForm.category}
  onChange={(e) =>
    setAddForm({ ...addForm, category: e.target.value })
  }
  className="font-semibold border rounded-md p-1 md:p-2 border-white/40
  bg-white/10
  transition duration-300
  w-fit cursor-pointer
  text-white
  focus:border-indigo-400
  outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
>
   {categories.map((cat) => (
     <option className="text-white bg-[#333333]"  key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>
            </div>

    {/* FEATURED */}
    <label className="flex items-center gap-2 my-2">
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
      className="md:w-full mb-2 border rounded-lg p-2 font-semibold  border-white/40
bg-white/10
transition duration-300
w-fit cursor-pointer
text-white
focus:border-indigo-400
outline-none hover:shadow-[0_0_30px_rgba(99,102,241,.45)]"
    >
      <option className="text-white bg-[#333333]" value="ongoing">Ongoing</option>
      <option className="text-white bg-[#333333]"  value="completed">Completed</option>
    </select>

<div>
    <button
      onClick={handleAddProject}
      className="bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600/80 transition duration-300 hover:scale-105"
      >
      Save Project
    </button>
        </div>

  </div>
)}

<div className="flex gap-4 my-4">

          <button
            onClick={() => {
              setShowForm(!showForm);
            }}
            className="
            rounded-xl
            bg-linear-to-r
mx-auto
from-indigo-500
via-purple-500
to-cyan-500
px-4 md:px-6
py-2 md:py-3
font-semibold
text-white
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_30px_rgba(99,102,241,.45)]
active:scale-95
cursor-pointer"
>
            Add Project
          </button>
              </div>
 </div>
      </div>
              </div>
</ProtectedRoute>
    </>
  );
}
