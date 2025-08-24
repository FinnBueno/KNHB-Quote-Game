import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { useGameId } from "src/service/game/game-id-context";

export const registerGameId = (): void => {
  const { gameid } = useParams<{ gameid: string }>();
  const { updateGameId } = useGameId();
  useEffect(() => {
    updateGameId(gameid);
  }, [gameid]);
}
