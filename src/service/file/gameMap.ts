import { AbstractTextFile, BaseTextFile, beautifyFileDataJSON } from "./base";
import { useEffect, useMemo, useState } from "react";
import { FileSystemModel } from "./fs";
import { createModel } from "@/base/hooks/model";

type GameMap = Record<string, string>;

class GameMapFile extends AbstractTextFile<GameMap> {
  constructor(
    baseTextFile: BaseTextFile,
    private readonly mapId: string) {
    super(baseTextFile);
  }

  protected override serialize(data: GameMap): string {
    const dataJSON = beautifyFileDataJSON(data);
    return `main.floors.${this.mapId} =\n${dataJSON}`;
  }

  protected override unserialize(rawData: string): GameMap {
    const [prefixLine, ...dataLines] = rawData.split('\n');
    return JSON.parse(dataLines.join(''));
  }
}

const useGameMapFileDict = () => {
  const fs = FileSystemModel();
  const mapFileDict = useMemo(() => new Map<string, GameMapFile>(), [fs]);

  const touch = (mapId: string) => {
    const baseTextFile = new BaseTextFile(fs, `project/floors/${mapId}.js`, "utf-8");
    const newMapFile = new GameMapFile(baseTextFile, mapId);
    mapFileDict.set(mapId, newMapFile);
    return newMapFile;
  };

  const read = async (mapId: string) => {
    const mapFile = mapFileDict.get(mapId);
    if (mapFile) return mapFile.read();
    const newMapFile = touch(mapId);
    return newMapFile.read();
  }

  const write = async (mapId: string, data: Record<string, string>) => {
    const mapFile = mapFileDict.get(mapId);
    if (mapFile) return mapFile.write(data);
    const newMapFile = touch(mapId);
    await newMapFile.write(data);
  };

  return {
    read,
    write,
  };
}

export const GameMapFileDictModel = createModel(useGameMapFileDict);

export const useGameDataFile = (mapId: string) => {
  const gameMapFileDict = GameMapFileDictModel();
  const [data, setData] = useState<GameMap>();

  const read = async () => {
    const data = await gameMapFileDict.read(mapId);
    setData(data);
  }

  useEffect(() => {
    setData(void 0);
    read();
  }, [mapId]);

  const write = async (data: GameMap) => {
    setData(data);
    gameMapFileDict.write(mapId, data);
  };

  return {
    data,
    write,
  };
}
