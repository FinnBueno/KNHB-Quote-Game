import { useEffect, useState } from "react";
import firebase from "firebase";
import { QUERY_REFS } from "../queries";
import { useGameId } from "./game-id-context";

export const useFinished = () => {
  const { gameId } = useGameId();
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  useEffect(() => {
    const handle = (snapshot: firebase.database.DataSnapshot) => setHasFinished(!!snapshot.val());
    if (!gameId) return;

    const gameOverRef = QUERY_REFS.isGameOver({ gameId });
    gameOverRef.on('value', handle);
    return () => gameOverRef.off('value', handle);
  }, [gameId]);

  return hasFinished;
}