import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { Flex, Heading } from "rebass";
import { SyncLoader } from 'react-spinners';
import { Participant } from "../game/participants";
import { QUERY_REFS } from "../queries";
import { useGameId } from "../game/game-id-context";

export type Auth = {
    admin: {
        loading?: boolean;
        error?: boolean;
        isAdmin?: boolean;
        setLoading: (_: boolean) => void;
    }
    loading: boolean;
    error?: boolean;
    user?: Participant;
    setParticipant: (_?: string) => void;
} | undefined;

export const AuthContext = React.createContext<Auth>({ admin: { setLoading: _ => {} }, loading: true, user: undefined, setParticipant: () => {} });

const LOCAL_STORAGE_PLAYER_ID_KEY = 'localAuthIdentifier';

export const AuthProvider: React.FC<{}> = (props) => {
  const { gameId } = useGameId();

  const [locallySavedPlayerId, setLocallySavedPlayerId] = useState<string | undefined>(localStorage.getItem(LOCAL_STORAGE_PLAYER_ID_KEY) || undefined);

  const [auth, setAuth] = useState<Participant | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(false);

  const fetchInitialAuthState = () => {
    setLoading(true);

    if (!gameId) {
      setLoading(false);
      return;
    }

    if (!locallySavedPlayerId) {
      setLoading(false);
      setAuth(undefined);
      return;
    }

    QUERY_REFS.participant({ gameId, playerId: locallySavedPlayerId }).once('value', snapshot => {
      setLoading(false);
      setAuth(snapshot.exists() ? {
        ...snapshot.val(),
        id: locallySavedPlayerId,
      } : undefined);
    }, _ => {
      setLoading(false);
      setError(true);
    });
  }

  const authStateChanged = (user: firebase.User | null) => {
    setAdmin(!!user);
    setAdminLoading(false);
  }

  useEffect(fetchInitialAuthState, [locallySavedPlayerId]);
  useEffect(() => {
    setAdminLoading(true);
    firebase.app().auth().onAuthStateChanged(authStateChanged, () => setAdminError(true));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: auth,
        setParticipant: (id) => {
          setLoading(true);
          if (id) {
            localStorage.setItem(LOCAL_STORAGE_PLAYER_ID_KEY, id);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_PLAYER_ID_KEY);
          }
          setLocallySavedPlayerId(id);
        },
        loading,
        error,
        admin: isAdmin ? {
          loading: adminLoading,
          error: adminError,
          isAdmin,
          setLoading: () => setAdminLoading(true),
        } : {
          setLoading: () => setAdminLoading(true),
        },
      }}
    >
      {loading ? <LoadingPage /> : (
        error ? <ErrorPage /> : props.children
      )}
    </AuthContext.Provider>
  );
}

const ErrorPage: React.FC<{}> = () => (
  <Heading variant='heading1'>Error</Heading>
);

const LoadingPage: React.FC<{}> = () => (
  <Flex style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginTop: -40 / 2,
    marginLeft: -108 / 2,
  }} justifyContent='center' alignItems='center'>
    <SyncLoader size={32} loading />
  </Flex>
);

export const useAuth = () => useContext(AuthContext);
