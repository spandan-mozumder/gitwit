"use client";

import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const {
    data: projects,
    isLoading,
    error,
  } = api.project.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage("gitwit-projectId", "");

  const selectedProject = projects?.find((project) => project.id === projectId);

  if (process.env.NODE_ENV === "development") {
    console.debug("🔧 useProject → projectId from localStorage:", projectId);
  }

  return {
    projects,
    selectedProject,
    projectId,
    setProjectId,
    isLoading,
    error,
  };
};

export default useProject;
