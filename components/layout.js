"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="layout">
        <Sidebar
  isOpen={sidebarOpen}
  toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
/>

      <main
  className="content"
  onClick={() => {
    if (sidebarOpen) setSidebarOpen(false);
  }}
>
  {children}
  <Footer />
</main>
      </div>
    </>
  );
}