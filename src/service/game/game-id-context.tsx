import React, { useContext, useState } from "react";

export const GameIdContext = React.createContext<{ gameId: string | undefined, updateGameId: (_: string) => void }>({ gameId: undefined, updateGameId: () => {}});

export const GameIdProvider: React.FC<{}> = (props) => {
  const [gameId, updateGameId] = useState<string | undefined>(undefined);

  return (
    <GameIdContext.Provider value={{ gameId, updateGameId }}>
      {props.children}
    </GameIdContext.Provider>
  );
}

export const useGameId = () => useContext(GameIdContext);
