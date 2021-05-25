import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { useAuth } from "../auth";

export const ScoreContext = React.createContext<number>(0);

export const ScoreProvider: React.FC<{}> = (props) => {
    const auth = useAuth();
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        const scoreboardListener = (data: firebase.database.DataSnapshot) => setScore(data.val());

        if (auth?.user?.id) {
            const activeQuote = firebase.database().ref(`participants/${auth?.user?.id}/score`);
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
