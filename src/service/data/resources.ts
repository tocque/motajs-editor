import { createModel } from "@/base/hooks/model";
import { CommentFileModels, CommentNode } from "../file/comments";
import { useMemo } from "react";
import { RecordTree } from "../base";
import { get, set, update } from "lodash-es";
import { produce } from "immer";
import { GameDataFileModels } from "../file/gameData";

export interface ResourceTreeNode {
  title: string;
  desc?: string;
  path: string;
  children?: ResourceTreeNode[];
}

const useGameResourceData = () => {
  const resourceData = GameDataFileModels.data();

  const resourcesTree = useMemo(() => {
    if (!resourceData.data?.main) return void 0;
    console.log("data", resourceData);
    const resourceList = ["bgms", "images", "sounds", "tilesets"];
    const toResourceTreeNode = (
      data: string | Array<string> | RecordTree<string>,
      path: string[],
    ): ResourceTreeNode => {
      if (data instanceof Array) {
        const children = data.map((key) => {
          return toResourceTreeNode(key, path.concat(key));
        });
        return {
          title: path.at(-1) ?? "",
          path: path.join("/"),
          children,
        };
      } else if (typeof data === "object") {
        const children = resourceList.map((key) => {
          return toResourceTreeNode(data[key], path.concat(key));
        });
        return {
          title: path.at(-1) ?? "",
          path: path.join("/"),
          children,
        };
      } else if (typeof data === "string") {
        return {
          title: path.at(-1) ?? "",
          path: path.join("/"),
        };
      } else {
        throw new Error();
      }
    };
    console.log("tree", toResourceTreeNode(resourceData.data.main, ["resource"]));
    return toResourceTreeNode(resourceData.data.main, ["resource"]);
  }, [resourceData]);

  return {
    resourcesTree,
    // readEvent,
    // writeEvent,
  };
};

export const GameResourcesDataModel = createModel(useGameResourceData);
