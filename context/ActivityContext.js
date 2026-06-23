"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("activities");
    if (saved) setActivities(JSON.parse(saved));
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

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);