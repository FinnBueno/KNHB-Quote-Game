import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { useAuth } from "../auth";
import { QUERY_REFS } from "../queries";
import { useGameId } from "./game-id-context";

export const ScoreContext = React.createContext<number>(0);

export const ScoreProvider: React.FC<{}> = (props) => {
  const { gameId } = useGameId();
  const auth = useAuth();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const scoreboardListener = (data: firebase.database.DataSnapshot) => setScore(data.val());

    const playerId = auth?.user?.id;
    if (playerId && gameId) {
      const activeQuote = QUERY_REFS.playerScore({ gameId, playerId });
      activeQuote.on('value', scoreboardListener);
      return () => activeQuote.off('value', scoreboardListener);
    }
  }, [auth?.user?.id]);

  return (
    <ScoreContext.Provider
      value={score}
    >
      {props.children}
    </ScoreContext.Provider>
  );
}

export const useScore = () => useContext(ScoreContext);
