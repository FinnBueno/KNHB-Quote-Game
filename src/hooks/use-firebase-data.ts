import { useEffect, useState } from "react";
import firebase from "firebase/app";

interface FirebaseDataResult<T> {
  data?: T;
  isLoading: boolean;
  error?: string;
}

export const useFirebaseData = <T>(path: string): FirebaseDataResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    firebase
      .database()
      .ref(path)
      .once("value")
      .then((result) => setData(result.val() as T))
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};
