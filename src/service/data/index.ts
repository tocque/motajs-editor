import { mergeProviders } from "@/base/hooks/model";
import { GameScriptsDataModel } from "./scripts";
import { GameEventDataModel } from "./events";
import { GameResourcesDataModel } from "./resources";

export const DataModelsProvider = mergeProviders([GameScriptsDataModel, GameEventDataModel, GameResourcesDataModel]);
