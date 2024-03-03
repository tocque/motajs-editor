import { useMemo, useState } from "react";
import EventEditor from "../EventEditor";
import GlobalConfigs from "../GlobalConfigs";
import MapEditor from "../MapEditor";
import ResourceExplorer from "../ResourceExplorer";
import ScriptEditor from "../ScriptEditor";
import { createModel } from "@/base/hooks/model";

export enum Panels {
  MapEditor = 'MapEditor',
  GlobalConfigs = 'GlobalConfigs',
  ResourceExplorer = 'ResourceExplorer',
  EventEditor = 'EventEditor',
  ScriptEditor = 'ScriptEditor',
} 

export const PANELS = [
  { itemKey: Panels.MapEditor, text: '地图编辑', component: MapEditor },
  { itemKey: Panels.GlobalConfigs, text: '全局设置', component: GlobalConfigs },
  { itemKey: Panels.ResourceExplorer, text: '资源管理', component: ResourceExplorer },
  { itemKey: Panels.EventEditor, text: '事件编辑', component: EventEditor },
  { itemKey: Panels.ScriptEditor, text: '脚本编辑', component: ScriptEditor },
];

const usePanels = () => {
  const [panel, setPanel] = useState<Panels>();

  const panelInfo = useMemo(() => PANELS.find(e => e.itemKey === panel), [panel]);

  return {
    panel,
    panelInfo,
    setPanel,
  };
}

export const PanelsModel = createModel(usePanels);

