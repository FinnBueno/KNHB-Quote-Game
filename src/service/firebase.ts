import firebase from "firebase/app";
import "firebase/auth";

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () =>
  firebase.auth().signInWithPopup(googleProvider);

export const signInAsGameMaster = (gameId: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(`${gameId}@fake.email`, password);
