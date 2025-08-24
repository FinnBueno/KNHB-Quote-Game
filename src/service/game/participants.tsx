import { useEffect, useState } from "react";
import firebase from "firebase";
import { useParams } from "react-router-dom";
import { QUERY_REFS } from "../queries";
import { useGameId } from "./game-id-context";

export type Participant = {
    id: string;
    name: string;
    picture: string;
    caption: string;
    score: number;
}

export const useParticipants = (specificGameId?: string) => {
  const { gameId } = useGameId();

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

    if (!gameId) return;

    const ref = QUERY_REFS.participants({ gameId });
    ref.on('value', handle);
    return () => ref.off('value', handle);
  }, [gameId]);

  return participants;
}