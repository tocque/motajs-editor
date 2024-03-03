import { IconFolderOpen } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";
import { FC } from "react";
import { ProjectModel } from "../store/project";

const BlankPage: FC = () => {
  const { setProject } = ProjectModel();

  const openProject = async () => {
    const dirHandle = await window.showDirectoryPicker();
    setProject(dirHandle);
  };

  return (
    <div>
      <Button onClick={openProject} icon={<IconFolderOpen />}>
        打开工程
      </Button>
    </div>
  );
};

export default BlankPage;
