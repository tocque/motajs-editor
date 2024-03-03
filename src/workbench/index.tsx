import { FC } from "react";
import { ViewPort, Top, Bottom, Fill } from "react-spaces";
import Topbar from "./Topbar";
import Statusbar from "./Statusbar";
import { ProjectModel } from "./store/project";
import BlankPage from "./BlankPage";
import { FileSystemModel } from "@/service/file/fs";
import { FileModelsProvider } from "@/service/file";
import { GlobalProvider, WorkbenchProvider } from "./store";
import { PanelsModel } from "./store/panels";
import { DataModelsProvider } from "@/service/data";

const PanelView: FC = () => {
  const { panelInfo } = PanelsModel();

  if (!panelInfo?.component) {
    return null;
  }

  const Panel = panelInfo?.component;

  return <Panel />;
};

const WorkbenchCore: FC = () => {
  const { project } = ProjectModel();

  if (!project) {
    return <BlankPage />;
  }

  return (
    <FileSystemModel.Provider initialState={project}>
      <FileModelsProvider>
        <DataModelsProvider>
          <WorkbenchProvider>
            <ViewPort>
              <Top size={48}>
                <Topbar />
              </Top>
              <Fill>
                <PanelView />
              </Fill>
              <Bottom size={28}>
                <Statusbar />
              </Bottom>
            </ViewPort>
          </WorkbenchProvider>
        </DataModelsProvider>
      </FileModelsProvider>
    </FileSystemModel.Provider>
  );
};

const Workbench = () => {
  return (
    <GlobalProvider>
      <WorkbenchCore />
    </GlobalProvider>
  );
};

export default Workbench;
