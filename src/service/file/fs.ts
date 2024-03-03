import { useMemo } from "react";
import { createInitializedModel } from "@/base/hooks/model";
import { FsaNodeFs } from "memfs/lib/fsa-to-node";

export const FileSystemModel = createInitializedModel((dirHandle: FileSystemDirectoryHandle) => {
  // @ts-ignore FileSystemDirectoryHandle 定义有问题
  const fs = useMemo(() => new FsaNodeFs(dirHandle), [dirHandle]);

  return fs;
});
