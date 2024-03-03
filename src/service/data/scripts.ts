import { createModel } from "@/base/hooks/model";
import { GameScriptsFileModels } from "../file/gameScripts";
import { CommentFileModels, CommentNode } from "../file/comments";
import { useMemo } from "react";
import { RecordTree } from "../base";
import { get, set, update } from "lodash-es";
import { produce } from "immer";

export interface ScriptTreeNode {
  title: string;
  desc?: string;
  path: string;
  children?: ScriptTreeNode[];
}

const useGameScriptsData = () => {
  const functionsData = GameScriptsFileModels.functions();
  const functionsComment = CommentFileModels.functions();

  const functionsTree = useMemo(() => {
    if (!functionsData.data || !functionsComment.data) return void 0;
    const toScriptTreeNode = (data: RecordTree<string>, comment: CommentNode, path: string[]): ScriptTreeNode => {
      if (comment._type === 'textarea') {
        return {
          title: path.at(-1) ?? '',
          desc: comment._data,
          path: path.join('/'),
        };
      } else if (comment._type === 'object') {
        const children = Object.entries(comment._data).map(([k, v]) => {
          return toScriptTreeNode(data[k] as RecordTree<string>, v as CommentNode, path.concat([k]));
        });
        return {
          title: path.at(-1) ?? '',
          path: path.join('/'),
          children,
        }
      } else {
        throw Error();
      }
    }
    return toScriptTreeNode(functionsData.data, functionsComment.data, ['functions']);
  }, [functionsData, functionsComment]);

  const readScript = (path: string) => {
    const [scope, ...innerPath] = path.split('/');
    if (scope === 'functions') {
      if (!functionsData.data) throw Error();
      return get(functionsData.data, innerPath);
    }
  }

  const writeScript = (path: string, data: string) => {
    const [scope, ...innerPath] = path.split('/');
    if (scope === 'functions') {
      if (!functionsData.data) throw Error();
      functionsData.write(produce(functionsData.data, (draft) => {
        set(draft, innerPath, data);
      }));
    }
  }

  return {
    functionsTree,
    readScript,
    writeScript,
  }
}

export const GameScriptsDataModel = createModel(useGameScriptsData);
