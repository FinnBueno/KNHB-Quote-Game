import { useEffect, useState } from "react";
import firebase from "firebase/app";

type TypedSnapshot<T> = Omit<firebase.database.DataSnapshot, 'val'> & {
  val: () => T | undefined
}

interface FirebaseDataResult<T> {
  data?: TypedSnapshot<T>;
  isLoading: boolean;
  error?: string;
}

export const useFirebaseData = <T>(path: string): FirebaseDataResult<T> => {
  const [data, setData] = useState<firebase.database.DataSnapshot | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    firebase
      .database()
      .ref(path)
      .once("value")
      .then((result) => setData(result))
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  }, []);

  return {
    data: data ? {
      ...data,
      val: () => data ? data?.val() as T : undefined
    } : undefined,
    isLoading,
    error,
  };
};
