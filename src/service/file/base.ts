import { FsaNodeFs } from "memfs/lib/fsa-to-node";
import { IOptions } from "memfs/lib/node/types/options";
import { FileSystemModel } from "./fs";
import { useMemo } from "react";
import { EMPTY } from "@/base/empty";

const INDENT = " ".repeat(4);

export const beautifyFileDataJSON = (data: Record<string, any>) => {
  const lines = Object.entries(data).map(([k, v]) => `${INDENT}"${k}": ${JSON.stringify(v)}`);
  return ['{', lines.join(",\n"), '}'].join('\n');
}

class WriteQueue<T> {
  private isWriting = false;
  private nextTask?: T;

  async write(data: T, op: (data: T) => Promise<void>) {
    if (this.isWriting) {
      this.nextTask = data;
      return;
    }
    this.isWriting = true;
    await op(data);
    this.isWriting = false;
    if (this.nextTask) {
      this.write(this.nextTask, op);
    }
  }
}

export class BaseTextFile {

  constructor(
    private readonly fs: FsaNodeFs,
    private readonly path: string,
    private readonly encoding: IOptions['encoding']) {
    
  }

  async read() {
    return this.fs.promises.readFile(this.path, { encoding: this.encoding }) as Promise<string>;
  }

  private writeQueue = new WriteQueue<string>;

  async write(data: string) {
    await this.writeQueue.write(data, (data) => this.fs.promises.writeFile(this.path, data, { encoding: this.encoding }));
  }
}

export const useBaseTextFile = (path: string, encoding: IOptions['encoding']) => {
  const fs = FileSystemModel();
  const baseTextFile = useMemo(() => new BaseTextFile(fs, path, encoding), [fs, path, encoding]);

  return baseTextFile;
}

export abstract class AbstractTextFile<T> {

  constructor(
    protected readonly baseTextFile: BaseTextFile) {
  }

  protected abstract serialize(data: T): string;

  protected abstract unserialize(rawData: string): T;

  protected cache: T | typeof EMPTY = EMPTY;

  async read() {
    if (this.cache === EMPTY) {
      const rawData = await this.baseTextFile.read();
      this.cache = this.unserialize(rawData);
    }
    return this.cache as T;
  }

  async write(data: T) {
    this.cache = data;
    const rawData = this.serialize(data);
    await this.baseTextFile.write(rawData);
  }
}
