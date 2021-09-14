import { useEffect, useState } from "react";
import firebase from "firebase";

export const useTotalQuotes = () => {
    const [totalQuotes, setTotalQuotes] = useState<number>(0);

    useEffect(() => {
        const handle = (snapshot: firebase.database.DataSnapshot) => setTotalQuotes(snapshot.val());
        firebase.database().ref('totalQuotes').on('value', handle);
        return () => firebase.database().ref('totalQuotes').off('value', handle);
    }, []);

    return totalQuotes;
}