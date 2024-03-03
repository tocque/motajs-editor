import { GameScriptsDataModel, ScriptTreeNode } from "@/service/data/scripts";
import { Tabs, Tree } from "@douyinfe/semi-ui";
import { TreeNodeData, TreeProps } from "@douyinfe/semi-ui/lib/es/tree";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Fill, LeftResizable } from "react-spaces";
import styles from './index.module.less';
import { ScriptEditorModel } from "../store/scriptEditor";
import MonacoEditor from "@/base/components/MonacoEditor";
import Tab from "./Tab";
import { useHotkeys } from 'react-hotkeys-hook';

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

const ScriptEditor: FC = () => {

  const { functionsTree } = GameScriptsDataModel();
  const {
    openFile,
    activeFile,
    saveFile,
    closeFile,
    openedFiles,
    currentFile,
    expandedKeys,
    setExpandedKeys,
  } = ScriptEditorModel();

  const treeData = useMemo(() => {
    if (!functionsTree) return void 0;
    const toTreeNode = (node: ScriptTreeNode): TreeNodeData => {
      return {
        label: node.title,
        key: node.path,
        children: node.children?.map(e => toTreeNode(e)),
      }
    };
    return toTreeNode(functionsTree).children;
  }, [functionsTree]);

  useHotkeys('ctrl+s', () => {
    if (currentFile) {
      saveFile(currentFile.path);
    }
  }, [saveFile], {
    enableOnContentEditable: true,
    preventDefault: true,
  });

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
              if (typeof val === 'string') {
                openFile(val);
              }
            }}
          />
        </div>
      </LeftResizable>
      <Fill>
        <Tabs
          className={styles.tabs}
          type="card"
          tabList={openedFiles.map((e) => ({
            itemKey: e.path,
            tab: (
              <Tab
                key={e.path}
                title={e.path.split('/').at(-1)!}
                unsave={e.version !== e.saveVersion}
                onClose={() => {
                  closeFile(e.path);
                }}
              />
            ),
          }))}
          activeKey={currentFile?.path}
          onChange={(key) => {
            activeFile(key);
          }}
        >
          <MonacoEditor
            className={styles.editor}
            options={{
              automaticLayout: true,
            }}
            model={currentFile?.model}
          />
        </Tabs>
      </Fill>
    </Fill>
  );
};

export default ScriptEditor;
