import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { useParticipants } from "./participants";

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
    const participants = useParticipants();

    useEffect(() => {
        const activeQuoteListener = (data: firebase.database.DataSnapshot) => setQuote(data.val());

        const activeQuote = firebase.database().ref('activeQuote');
        activeQuote.on('value', activeQuoteListener);

        return () => activeQuote.off('value', activeQuoteListener);
    }, []);

    const vote = (id: string, voter: string) => firebase.database().ref(`activeQuote/votes/${voter}`).set(id);

    const next = (after: (_success: boolean) => void) => {
        const activeQuoteRef = firebase.database().ref(`activeQuote`);
        const newId = quote ? (quote.id + 1) : 0;
        firebase.database().ref(`quotes/${newId}`).once('value', snapshot => {
            if (snapshot.exists()) {
                
                firebase.database().ref('isGameOver').set(false);
                activeQuoteRef.set({
                    ...snapshot.val(),
                    id: newId
                }, e => after(e === null));
            } else {
                // game is over!
                firebase.database().ref('isGameOver').set(true);
                activeQuoteRef.remove();
            }
        })
    };

    const persistAnswers = () => {
        const activeQuote = firebase.database().ref('activeQuote');
        activeQuote.once('value', snapshot => {
            const val = snapshot.val();
            if (!val) return;
            if (!val.votes) return;

            Object.keys(val.votes).forEach(key => {
                const vote = val.votes[key];
                if (val.answer.toLowerCase() === vote) {
                    const newScore = (participants?.find(p => p.id === key)?.score || 0) + 1;
                    firebase.database().ref(`participants/${key}/score`).set(newScore);
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

export const useGame = () => useContext(GameContext);
