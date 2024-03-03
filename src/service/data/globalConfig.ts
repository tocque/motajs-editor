import { createModel } from "@/base/hooks/model";
import { GameDataFileModels } from "../file/gameData"

const useGameGlobalConfigs = () => {
  const rawGlobalConfigs = GameDataFileModels.data();

}

export const GameGlobalConfigsModel = createModel(useGameGlobalConfigs);
