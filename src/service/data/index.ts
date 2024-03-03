import { mergeProviders } from "@/base/hooks/model";
import { GameScriptsDataModel } from "./scripts";
import { GameEventDataModel } from "./events";

export const DataModelsProvider = mergeProviders([GameScriptsDataModel, GameEventDataModel]);
