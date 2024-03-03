import { createModel } from "@/base/hooks/model";
import { CommentFileModels, CommentNode } from "../file/comments";
import { useMemo } from "react";
import { RecordTree } from "../base";
import { get, set, update } from "lodash-es";
import { produce } from "immer";
import { GameDataFileModels } from "../file/gameData";

export interface EventTreeNode {
  title: string;
  desc?: string;
  path: string;
  children?: EventTreeNode[];
}

const useGameEventData = () => {
  const functionsData = GameDataFileModels.events();
  const functionsComment = CommentFileModels.events();

  const functionsTree = useMemo(() => {
    if (!functionsData.data?.commonEvent || !functionsComment.data) return void 0;
    const Nodelist = Object.entries(functionsData.data.commonEvent).map(([k, v]) => k);
    const toScriptTreeNode = (data: RecordTree<string>, comment: CommentNode, path: string[]): EventTreeNode => {
      if (comment._type === "event") {
        return {
          title: path.at(-1) ?? "",
          desc: comment._data,
          path: path.join("/"),
        };
      } else if (comment._type === "object") {
        const f = comment._data;
        const children =
          typeof f === "function"
            ? Nodelist.map((key) => {
                return toScriptTreeNode(data[key] as RecordTree<string>, f(key) as CommentNode, path.concat([key]));
              })
            : Object.entries(comment._data).map(([k, v]) => {
                return toScriptTreeNode(data[k] as RecordTree<string>, v as CommentNode, path.concat([k]));
              });
        return {
          title: path.at(-1) ?? "",
          path: path.join("/"),
          children,
        };
      } else {
        throw Error();
      }
    };
    return toScriptTreeNode(functionsData.data, functionsComment.data, ["events"]);
  }, [functionsData, functionsComment]);

  const readEvent = (path: string) => {
    const [scope, ...innerPath] = path.split("/");
    if (scope === "events") {
      if (!functionsData.data) throw Error();
      return get(functionsData.data, innerPath);
    }
  };

  const writeEvent = (path: string, data: string) => {
    const [scope, ...innerPath] = path.split("/");
    if (scope === "events") {
      if (!functionsData.data) throw Error();
      functionsData.write(
        produce(functionsData.data, (draft) => {
          set(draft, innerPath, data);
        }),
      );
    }
  };

  return {
    functionsTree,
    readEvent,
    writeEvent,
  };
};

export const GameEventDataModel = createModel(useGameEventData);
