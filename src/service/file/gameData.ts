import { AbstractTextFile, BaseTextFile, beautifyFileDataJSON, useBaseTextFile } from "./base";
import { useEffect, useMemo, useState } from "react";
import { RecordTree } from "../base";
import { createModel } from "@/base/hooks/model";

class GameDataFile<T extends Record<string, any>> extends AbstractTextFile<T> {
  constructor(
    baseTextFile: BaseTextFile,
    private readonly prefix: string,
    private readonly beautify = false) {
    super(baseTextFile);
  }

  protected override serialize(data: T): string {
    const dataJSON = this.beautify ? beautifyFileDataJSON(data) : JSON.stringify(data, null, 4);
    return `var ${this.prefix} =\n${dataJSON}`;
  }

  protected override unserialize(rawData: string): T {
    const [prefixLine, ...dataLines] = rawData.split('\n');
    return JSON.parse(dataLines.join(''));
  }
}

const gameDataFileHookFactory = <T extends Record<string, any> = RecordTree<any>>(path: string, prefix: string, beautify = false) => {
  const useGameDataFile = () => {
    const baseTextFile = useBaseTextFile(path, 'utf-8');
    const gameDataFile = useMemo(() => new GameDataFile<T>(baseTextFile, prefix, beautify), [baseTextFile]);
    const [data, setData] = useState<T>();

    const read = async () => {
      const data = await gameDataFile.read();
      setData(data);
    }

    useEffect(() => {
      setData(void 0);
      read();
    }, [gameDataFile]);

    const write = async (data: T) => {
      setData(data);
      gameDataFile.write(data);
    };

    return {
      data,
      write,
    };
  }

  return useGameDataFile;
}

export const GameDataFileModels = {
  data: createModel(gameDataFileHookFactory("project/data.js", "data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d")),
  maps: createModel(gameDataFileHookFactory("project/maps.js", "maps_90f36752_8815_4be8_b32b_d7fad1d0542e", true)),
  icons: createModel(gameDataFileHookFactory("project/icons.js", "icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1")),
  items: createModel(gameDataFileHookFactory("project/items.js", "items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a")),
  enemys: createModel(gameDataFileHookFactory("project/enemys.js", "enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80", true)),
  events: createModel(gameDataFileHookFactory("project/events.js", "events_c12a15a8_c380_4b28_8144_256cba95f760", true)),
};
