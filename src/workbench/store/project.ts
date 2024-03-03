import { createModel } from "@/base/hooks/model";
import { useState } from "react";

const useProject = () => {
  const [project, setProject] = useState<FileSystemDirectoryHandle>();

  return {
    project,
    setProject,
  };
}

export const ProjectModel = createModel(useProject);
