import { GameScriptsDataModel, ScriptTreeNode } from "@/service/data/scripts";
import { Tabs, Tree } from "@douyinfe/semi-ui";
import { TreeNodeData, TreeProps } from "@douyinfe/semi-ui/lib/es/tree";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Fill, LeftResizable } from "react-spaces";
import styles from "./index.module.less";
import { ScriptEditorModel } from "../store/scriptEditor";
import MonacoEditor from "@/base/components/MonacoEditor";
// import Tab from "./Tab";
import { useHotkeys } from "react-hotkeys-hook";
import { EventTreeNode, GameEventDataModel } from "@/service/data/events";
import { GameResourcesDataModel } from "@/service/data/resources";

const RenderLabel: TreeProps["renderFullLabel"] = (props) => {
  const { className, onExpand, onClick, data, expandIcon } = props;
  const { label } = data;
  const isLeaf = !(data.children && data.children.length);
  return (
    <li className={className} role="treeitem" onClick={isLeaf ? onClick : onExpand}>
      {isLeaf ? null : expandIcon}
      <span>{label}</span>
    </li>
  );
};

const ResourceEditor: FC = () => {
  const { resourcesTree } = GameResourcesDataModel();
  const { openFile, activeFile, saveFile, closeFile, openedFiles, currentFile, expandedKeys, setExpandedKeys } =
    ScriptEditorModel();

  const treeData = useMemo(() => {
    if (!resourcesTree) return void 0;
    const toTreeNode = (node: EventTreeNode): TreeNodeData => {
      return {
        label: node.title,
        key: node.path,
        children: node.children?.map((e) => toTreeNode(e)),
      };
    };
    return toTreeNode(resourcesTree).children;
  }, [resourcesTree]);

  return (
    <Fill>
      <LeftResizable size={320} minimumSize={240} style={{ background: "var(--semi-color-bg-2)" }}>
        <div className={styles.scriptTreeContainer}>
          <Tree
            renderFullLabel={RenderLabel}
            treeData={treeData}
            expandedKeys={expandedKeys}
            value={currentFile?.path}
            onExpand={setExpandedKeys}
            onChange={(val) => {
              console.log(val);
            }}
          />
        </div>
      </LeftResizable>
    </Fill>
  );
};

export default ResourceEditor;
