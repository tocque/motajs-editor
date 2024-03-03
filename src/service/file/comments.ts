import { createModel } from "@/base/hooks/model";
import { AbstractTextFile, BaseTextFile, useBaseTextFile } from "./base";
import { useEffect, useMemo, useState } from "react";

export interface CommentNode {
  _type: string;
  _data: any;
}

type Comment = CommentNode;

class CommentFile extends AbstractTextFile<string> {
  constructor(
    baseTextFile: BaseTextFile,
    private readonly prefix: string) {
    super(baseTextFile);
  }

  protected override serialize(data: string): string {
    return data;
  }

  protected override unserialize(rawData: string): string {
    return rawData;
  }
}

const commentFileHookFactory = (path: string, prefix: string) => {
  const useCommentFile = () => {
    const baseTextFile = useBaseTextFile(path, 'utf-8');
    const commentFile = useMemo(() => new CommentFile(baseTextFile, prefix), [baseTextFile]);
    const [rawData, setRawData] = useState<string>();

    const data = useMemo(() => {
      if (!rawData) return void 0;
      return eval(`(function () {${rawData};return ${prefix};})()`) as Comment;
    }, [rawData]);

    const read = async () => {
      const data = await commentFile.read();
      setRawData(data);
    }

    useEffect(() => {
      setRawData(void 0);
      read();
    }, [commentFile]);

    const write = async (data: string) => {
      setRawData(data);
      commentFile.write(data);
    };

    return {
      data,
      write,
    };
  }
  return useCommentFile;
}

export const CommentFileModels = {
  // common: createModel(commentFileHookFactory("_server/table/comment.js", "comment_c456ea59_6018_45ef_8bcc_211a24c627dc")),
  // data: createModel(commentFileHookFactory("_server/table/data.comment.js", "data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc")),
  events: createModel(commentFileHookFactory("_server/table/events.comment.js", "events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc")),
  functions: createModel(commentFileHookFactory("_server/table/functions.comment.js", "functions_comment_c456ea59_6018_45ef_8bcc_211a24c627dc")),
  plugins: createModel(commentFileHookFactory("_server/table/plugins.comment.js", "plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc")),
};
