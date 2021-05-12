import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";

/**
 * participantId: amountOfVotes
 */
export type Votes = {
    [key: string]: number;
};

export const VotesContext = React.createContext<Votes>({});

export const VotesProvider: React.FC<{}> = (props) => {

    const [votes, setVotes] = useState<Votes>({});

    useEffect(() => {
        const votesUpdatedListener = (data: firebase.database.DataSnapshot) => {
            if (data.exists()) {
                const result: Votes = {};
                Object.values(data.val()).forEach((vote: any) => result[vote] = (result[vote] || 0) + 1)
                setVotes(result);
            } else {
                setVotes({});
            }
        };

        const activeQuote = firebase.database().ref('activeQuote/votes');
        activeQuote.on('value', votesUpdatedListener);

        return () => activeQuote.off('value', votesUpdatedListener);
    }, []);

    return (
        <VotesContext.Provider
            value={votes}
        >
            {props.children}
        </VotesContext.Provider>
    );
}

export const useVotes = () => useContext(VotesContext);
