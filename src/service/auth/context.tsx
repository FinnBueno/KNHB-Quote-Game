import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { Flex, Heading } from "rebass";
import { SyncLoader } from 'react-spinners';
import { Participant } from "../game/participants";

export type Auth = {
  admin: {
    loading?: boolean;
    error?: boolean;
    gameId?: string;
    setLoading: (_: boolean) => void;
    getGameRef: (_: string) => firebase.database.Reference;
  }
  loading: boolean;
  error?: boolean;
  user?: Participant;
  setParticipant: (_?: string) => void;
} | undefined;

const DEFAULT_AUTH: Auth = {
  admin: {
    setLoading: _ => {},
    getGameRef: _ => { throw new Error('No ref can be created without being signed in as admin'); }
  },
  loading: true,
  user: undefined,
  setParticipant: () => {}
};

export const AuthContext = React.createContext<Auth>(DEFAULT_AUTH);

export const AuthProvider: React.FC<{}> = (props) => {

  const [localAuthIdentifier, setLocalAuthIdentifier] = useState<string | undefined>(localStorage.getItem('localAuthIdentifier') || undefined);

  const [auth, setAuth] = useState<Participant | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [adminId, setAdminId] = useState<string | undefined>();
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(false);

  const fetchInitialAuthState = () => {
    setLoading(true);
    firebase.database().ref(`participants/${localAuthIdentifier}`).once('value', snapshot => {
      setLoading(false);
      setAuth(snapshot.exists() ? {
        ...snapshot.val(),
        id: localAuthIdentifier,
      } : undefined);
    }, _ => {
      setLoading(false);
      setError(true);
    });
  };

  const authStateChanged = (user: firebase.User | null) => {
    setAdminId(user?.email ? user?.email?.split('@')[0] : undefined);
    setAdminLoading(false);
  };

  useEffect(fetchInitialAuthState, [localAuthIdentifier]);
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
            localStorage.setItem('localAuthIdentifier', id);
          } else {
            localStorage.removeItem('localAuthIdentifier');
          }
          setLocalAuthIdentifier(id);
        },
        loading,
        error,
        admin: adminId ? {
          loading: adminLoading,
          error: adminError,
          gameId: adminId,
          setLoading: () => setAdminLoading(true),
          getGameRef: (path: string) => firebase.database().ref(`${adminId}/${path}`)
        } : {
          setLoading: () => setAdminLoading(true),
          getGameRef: (_: string) => { throw new Error('No ref can be created without being signed in as admin'); }
        },
      }}
    >
      {loading ? <LoadingPage /> : (
        error ? <ErrorPage /> : props.children
      )}
    </AuthContext.Provider>
  );
};

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
