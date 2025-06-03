import firebase from "firebase";
import { createContext, FC, useContext, useEffect, useState } from "react";

type AvailableGames = {
  identifier: string;
  name: string;
  thumbnail: string;
}[];

const ListAvailableGamesContext = createContext<AvailableGames>([]);

export const AvailableGamesProvider: FC<{}> = (props) => {
  const [availableGames, setAvailableGames] = useState<AvailableGames>([]);

  useEffect(() => {
    const handle = (snapshot: firebase.database.DataSnapshot) => setAvailableGames(Object.values(snapshot.val()));
    firebase.database().ref('availableGames').once('value', handle);
  }, []);

  return (
    <ListAvailableGamesContext.Provider value={availableGames}>
      {props.children}
    </ListAvailableGamesContext.Provider>
  );
};

export const useListOfAvailableGames = () => useContext(ListAvailableGamesContext);