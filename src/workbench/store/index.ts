import { mergeProviders } from "@/base/hooks/model";
import { PanelsModel } from "./panels";
import { ScriptEditorModel } from "./scriptEditor";
import { ThemeModel } from "./theme";
import { ProjectModel } from "./project";

export const GlobalProvider = mergeProviders([
  ThemeModel,
  ProjectModel,
]);

export const WorkbenchProvider = mergeProviders([
  PanelsModel,
  ScriptEditorModel,
]);
