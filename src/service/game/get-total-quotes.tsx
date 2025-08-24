import { useEffect, useState } from "react";
import firebase from "firebase";
import { QUERY_REFS } from "../queries";
import { registerGameId } from "src/hooks/use-game-id";

export const useTotalQuotes = (gameId?: string) => {
  const [totalQuotes, setTotalQuotes] = useState<number>(0);

  useEffect(() => {
    if (!gameId) return;
    const allQuotes = QUERY_REFS.allQuotes({ gameId });
    const handle = (snapshot: firebase.database.DataSnapshot) => setTotalQuotes(() => snapshot.numChildren());
    allQuotes.on('value', handle);
    return () => allQuotes.off('value', handle);
  }, [gameId]);

  return totalQuotes;
}