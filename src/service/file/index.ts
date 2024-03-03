import { mergeProviders } from "@/base/hooks/model";
import { GameDataFileModels } from "./gameData";
import { GameMapFileDictModel } from "./gameMap";
import { GameScriptsFileModels } from "./gameScripts";
import { CommentFileModels } from "./comments";

export const FileModelsProvider = mergeProviders([
  ...Object.values(GameDataFileModels),
  ...Object.values(GameScriptsFileModels),
  ...Object.values(CommentFileModels),
  GameMapFileDictModel,
]);
