import { useEffect, useState } from "react";
import firebase from "firebase";

export const useFinished = () => {
    const [hasFinished, setHasFinished] = useState<boolean>(false);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => setHasFinished(!!snapshot.val());
        firebase.database().ref('isGameOver').on('value', handle);
        return () => firebase.database().ref('isGameOver').off('value', handle);
    }, []);

    return hasFinished;
}