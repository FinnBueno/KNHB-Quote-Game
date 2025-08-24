import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { QUERY_REFS } from "../queries";
import { useGameId } from "./game-id-context";

/**
 * participantId: amountOfVotes
 */
export type Votes = {
    [key: string]: number;
};

export const VotesContext = React.createContext<Votes>({});

export const VotesProvider: React.FC<{}> = (props) => {
  const { gameId } = useGameId();

  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    if (!gameId) return;

    const votesUpdatedListener = (data: firebase.database.DataSnapshot) => {
      if (data.exists()) {
        const result: Votes = {};
        Object.values(data.val()).forEach((vote: any) => result[vote] = (result[vote] || 0) + 1)
        setVotes(result);
      } else {
        setVotes({});
      }
    };

    const activeQuote = QUERY_REFS.currentVotes({ gameId });
    activeQuote.on('value', votesUpdatedListener);

    return () => activeQuote.off('value', votesUpdatedListener);
  }, [gameId]);

  return (
    <VotesContext.Provider
      value={votes}
    >
      {props.children}
    </VotesContext.Provider>
  );
}

export const useVotes = () => useContext(VotesContext);
