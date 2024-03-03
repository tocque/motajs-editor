import { AbstractTextFile, BaseTextFile, beautifyFileDataJSON, useBaseTextFile } from "./base";
import { useEffect, useMemo, useState } from "react";
import { RecordTree } from "../base";
import { createModel } from "@/base/hooks/model";
import { mapRecord } from "@/base/utils";

type GameScripts = RecordTree<string>;

class GameScriptsFile extends AbstractTextFile<GameScripts> {
  constructor(
    baseTextFile: BaseTextFile,
    private readonly prefix: string) {
    super(baseTextFile);
  }

  protected override serialize(data: GameScripts): string {
    const INDENT = '\t';
    const serializeRecursively = (data: GameScripts, indent: string): string => {
      const nextIndent = indent + INDENT;
      const lines = Object.entries(data).map(([k, v]) => {
        const key = `${nextIndent}"${k}": `;
        if (typeof v === 'string') {
          return `${key}${v}`;
        }
        return `${key}${serializeRecursively(v, nextIndent)}`;
      });
      return [`{`, lines.join(",\n"), `${indent}}`].join('\n');
    }
    const dataJSON = serializeRecursively(data, '');
    return `var ${this.prefix} =\n${dataJSON}`;
  }

  protected override unserialize(rawData: string): GameScripts {
    const [prefixLine, ...dataLines] = rawData.split('\n');
    const obj = eval(`(${dataLines.join('\n')})`) as RecordTree<() => unknown>;
    const toScriptText = (obj: RecordTree<() => unknown>): RecordTree<string> => {
      return mapRecord(obj, (k, v) => {
        if (typeof v === 'function') {
          return v.toString();
        }
        return toScriptText(v);
      });
    };
    return toScriptText(obj);
  }
}

const gameScriptsFileHookFactory = (path: string, prefix: string) => {
  const useGameScriptsFile = () => {
    const baseTextFile = useBaseTextFile(path, 'utf-8');
    const gameDataFile = useMemo(() => new GameScriptsFile(baseTextFile, prefix), [baseTextFile]);
    const [data, setData] = useState<GameScripts>();

    const read = async () => {
      const data = await gameDataFile.read();
      setData(data);
    }

    useEffect(() => {
      setData(void 0);
      read();
    }, [gameDataFile]);

    const write = async (data: GameScripts) => {
      setData(data);
      gameDataFile.write(data);
    };

    return {
      data,
      write,
    };
  }
  return useGameScriptsFile;
}

export const GameScriptsFileModels = {
  functions: createModel(gameScriptsFileHookFactory('project/functions.js', 'functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a')),
  plugins: createModel(gameScriptsFileHookFactory('project/plugins.js', 'plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1')),
}
