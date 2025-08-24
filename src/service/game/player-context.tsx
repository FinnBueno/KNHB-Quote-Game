import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { useParticipants } from "./participants";
import { QUERY_REFS } from "src/service/queries";
import { useGameId } from "./game-id-context";

type Quote = {
  content: string;
  answer: string;
  id: number;
  votes: { [key: string]: string };
  showAnswer?: boolean;
};

export type Game = {
  quote?: Quote;
  persistAnswers: () => void;
  vote: (_id: string, _voter: string) => void;
  next: (_after: (_success: boolean) => void) => void;
} | undefined;

export const GameContext = React.createContext<Game>({ persistAnswers: () => {}, vote: () => {}, next: () => {} });

export const GameProvider: React.FC<{}> = (props) => {
  const [quote, setQuote] = useState<Quote | undefined>(undefined);
  const { gameId } = useGameId();
  const participants = useParticipants();

  useEffect(() => {
    const activeQuoteListener = (data: firebase.database.DataSnapshot) => setQuote(data.val());

    if (!gameId) return;

    const activeQuote = QUERY_REFS.activeQuote({ gameId });
    activeQuote.on('value', activeQuoteListener);

    return () => activeQuote.off('value', activeQuoteListener);
  }, [gameId]);

  const vote = (id: string, playerId: string) => {
    if (!gameId) return;
    QUERY_REFS.currentQuoteVoteForPlayer({ gameId, playerId }).set(id);
  };

  const next = (after: (_success: boolean) => void) => {
    if (!gameId) return;

    const activeQuoteRef = QUERY_REFS.activeQuote({ gameId });
    const quoteId = quote ? (quote.id + 1) : 0;
    const isGameOverRef = QUERY_REFS.isGameOver({ gameId });

    QUERY_REFS.quoteById({ gameId, quoteId }).once('value', snapshot => {
      if (snapshot.exists()) {
        isGameOverRef.set(false);
        activeQuoteRef.set({
          ...snapshot.val(),
          id: quoteId
        }, e => after(e === null));
      } else {
        // game is over!
        isGameOverRef.set(true);
        activeQuoteRef.remove();
      }
    })
  };

  const persistAnswers = () => {
    if (!gameId) return;

    const activeQuote = QUERY_REFS.activeQuote({ gameId })
    activeQuote.once('value', snapshot => {
      const val = snapshot.val();
      if (!val) return;
      if (!val.votes) return;

      Object.keys(val.votes).forEach(playerId => {
        const vote = val.votes[playerId];
        if (val.answer.toLowerCase() === vote) {
          const newScore = (participants?.find(p => p.id === playerId)?.score || 0) + 1;
          QUERY_REFS.playerScore({ gameId, playerId }).set(newScore);
        }
      });
    });
  }

  return (
    <GameContext.Provider
      value={{ quote, persistAnswers, vote, next }}
    >
      {props.children}
    </GameContext.Provider>
  );
}

export const usePlayerControls = () => useContext(GameContext);
