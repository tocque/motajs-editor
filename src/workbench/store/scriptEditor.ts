import { createModel } from "@/base/hooks/model";
import { GameScriptsDataModel } from "@/service/data/scripts";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as monaco from "monaco-editor";

export interface OpenedScriptFile {
  path: string;
  version: number;
  saveVersion: number;
  model: monaco.editor.ITextModel;
}

const useScriptEditor = () => {
  const [openedFiles, setOpenedFiles] = useState<OpenedScriptFile[]>([]);
  const [currentFileId, setCurrentFileId] = useState<string>();

  const { readScript, writeScript } = GameScriptsDataModel();

  const currentFile = useMemo(() => openedFiles.find((e) => e.path === currentFileId), [openedFiles, currentFileId]);

  const activeFile = (path: string) => {
    setCurrentFileId(path);
  };

  const openFile = (path: string) => {
    if (openedFiles.find((e) => e.path === path)) {
      activeFile(path);
      return;
    }
    setCurrentFileId(path);
    const content = readScript(path);
    const model = monaco.editor.createModel(content, "javascript", monaco.Uri.parse(`metaphysic://${path}.js`));
    const version = model.getAlternativeVersionId();
    setOpenedFiles(
      openedFiles.concat([
        {
          path,
          version,
          saveVersion: version,
          model,
        },
      ]),
    );
    model.onDidChangeContent(() => {
      setOpenedFiles((openedFiles) => {
        const index = openedFiles.findIndex((e) => e.path === path);
        if (index === -1) return openedFiles;
        return openedFiles.with(index, {
          ...openedFiles[index],
          version: model.getAlternativeVersionId(),
        });
      });
    });
  };

  const saveFile = (path: string) => {
    setOpenedFiles((openedFiles) => {
      const index = openedFiles.findIndex((e) => e.path === path);
      if (index === -1) return openedFiles;
      const file = openedFiles[index];
      writeScript(file.path, file.model.getValue());
      return openedFiles.with(index, {
        ...openedFiles[index],
        saveVersion: file.model.getAlternativeVersionId(),
      });
    });
  };

  const closeFile = (path: string) => {
    const index = openedFiles.findIndex((e) => e.path === path);
    if (path === currentFileId) {
      const nextIndex = index === 0 ? 0 : index - 1;
      const next = openedFiles[nextIndex];
      if (next) {
        setCurrentFileId(next.path);
      } else {
        setCurrentFileId(void 0);
      }
    }
    openedFiles[index].model.dispose();
    setOpenedFiles(openedFiles.filter((e) => e.path !== path));
  };

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  return {
    openFile,
    activeFile,
    saveFile,
    closeFile,
    openedFiles,
    currentFile,
    expandedKeys,
    setExpandedKeys,
  };
};

export const ScriptEditorModel = createModel(useScriptEditor);
