import { AbstractResourceFile, BaseResourceFile, beautifyFileDataJSON } from "./base";
import { useEffect, useMemo, useState } from "react";
import { FileSystemModel } from "./fs";
import { createModel } from "@/base/hooks/model";

type GameResource = Record<string, string>;

class GameResourceFile extends AbstractResourceFile<GameResource> {
  constructor(
    baseResourceFile: BaseResourceFile,
    private readonly resourceId: string,
  ) {
    super(baseResourceFile);
  }

  // protected override serialize(data: GameResource): string {
  //   const dataJSON = beautifyFileDataJSON(data);
  //   // return `main.floors.${this.resourceId} =\n${dataJSON}`;
  //   return "gameResources.ts error";
  // }

  protected override unserialize(rawData: Buffer): GameResource {
    // const [prefixLine, ...dataLines] = rawData.split("\n");
    // return JSON.parse(dataLines.join(""));
    console.log(rawData);
    return { test: "" };
  }
}

const useGameResourceFileDict = () => {
  const fs = FileSystemModel();
  const resourceFileDict = useMemo(() => new Map<string, GameResourceFile>(), [fs]);

  const touch = (path: string, resourceId: string) => {
    const File = new BaseResourceFile(fs, `project/${path}/${resourceId}`, "buffer");
    const newResourceFile = new GameResourceFile(File, resourceId);
    resourceFileDict.set(resourceId, newResourceFile);
    return newResourceFile;
  };

  const read = async (path: string, resourceId: string) => {
    const resourceFile = resourceFileDict.get(resourceId);
    if (resourceFile) return resourceFile.read();
    const newResourceFile = touch(path, resourceId);
    return newResourceFile.read();
  };

  // const write = async (resourceId: string, data: Record<string, string>) => {
  //   const resourceFile = resourceFileDict.get(resourceId);
  //   if (resourceFile) return resourceFile.write(data);
  //   const newResourceFile = touch(resourceId);
  //   await newResourceFile.write(data);
  // };

  return {
    read,
  };
};

export const GameResourceFileDictModel = createModel(useGameResourceFileDict);

export const useGameDataFile = (path: string, resourceId: string) => {
  const gameResourceFileDict = GameResourceFileDictModel();
  const [data, setData] = useState<GameResource>();

  const read = async () => {
    const data = await gameResourceFileDict.read(path, resourceId);
    setData(data);
  };

  useEffect(() => {
    setData(void 0);
    read();
  }, [resourceId]);

  // const write = async (data: GameResource) => {
  //   setData(data);
  //   gameResourceFileDict.write(resourceId, data);
  // };

  return {
    data,
  };
};
