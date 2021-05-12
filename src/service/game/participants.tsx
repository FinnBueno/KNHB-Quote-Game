import { useEffect, useState } from "react";
import firebase from "firebase";

export type Participant = {
    id: string;
    name: string;
    picture: string;
    caption: string;
    score: number;
}

export const useParticipants = () => {
    const [participants, setParticipants] = useState<Participant[]>();

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => {
            if (!snapshot.exists()) return;
            const val = snapshot.val();
            const result: Participant[] = [];
            Object.keys(val).forEach(participantId => {
                result.push({
                    ...val[participantId],
                    id: participantId,
                });
            });
            setParticipants(result);
        };
        const ref = firebase.database().ref('participants');
        ref.on('value', handle);
        return () => ref.off('value', handle);
    }, []);

    return participants;
}