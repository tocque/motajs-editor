import { mergeProviders } from "@/base/hooks/model";
import { GameScriptsDataModel } from "./scripts";

export const DataModelsProvider = mergeProviders([
  GameScriptsDataModel,
]);