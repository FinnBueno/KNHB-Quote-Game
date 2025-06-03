import firebase from "firebase";
export const getGameId = () =>
  firebase.auth().currentUser?.email?.split("@")[0];

export const getGameRef = (path: string) =>
  firebase.database().ref(`${getGameId()}/${path}`);
