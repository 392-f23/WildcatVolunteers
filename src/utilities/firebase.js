import {
  getDatabase,
  onValue,
  ref,
  update,
  push,
  set,
  remove,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZiQd4ge1UgAsId1xzCzzKY9m_3CtfZUQ",
  authDomain: "wildcat-volunteers.firebaseapp.com",
  databaseURL: "https://wildcat-volunteers-default-rtdb.firebaseio.com",
  projectId: "wildcat-volunteers",
  storageBucket: "wildcat-volunteers.appspot.com",
  messagingSenderId: "808377350355",
  appId: "1:808377350355:web:8a1dcc15c4c727e37ebc26",
  measurementId: "G-X436PNQYJ7"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// AUTHENTICATION UTILITIES
export const signInWithGoogle = () => {
  const auth = getAuth(firebase);
  signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
    // If the user is new or hasn't verified the email, send a verification email
    if (result.user && !result.user.emailVerified) {
      sendEmailVerification(result.user);
    }
  });
};

const storage = getStorage(firebase);
export const uploadImage = async (file) => {
  const filePath = `images/${file.name}_${Date.now()}`;
  const imgRef = storageRef(storage, filePath);
  await uploadBytes(imgRef, file);
  const downloadURL = await getDownloadURL(imgRef);
  return downloadURL;
};
export const signOut = () => firebaseSignOut(getAuth(firebase));

export const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => onAuthStateChanged(getAuth(firebase), setUser), []);

  return [user];
};

// DATABASE UTILITIES
export const useDbData = (path) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const database = getDatabase(); // Assuming you have a firebase database instance
    const dataRef = ref(database, path);

    return onValue(
      dataRef,
      (snapshot) => {
        setData(snapshot.val());
        setLoading(false); // Set loading to false when data is received
      },
      (error) => {
        setError(error);
        setLoading(false); // Set loading to false also on error
      }
    );
  }, [path]);

  return [data, loading, error]; // Return the loading state along with data and error
};


const makeResult = (error) => {
  const timestamp = Date.now();
  const message =
    error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback(
    (value) => {
      update(ref(database, path), value)
        .then(() => setResult(makeResult()))
        .catch((error) => setResult(makeResult(error)));
    },
    [database, path]
  );

  return [updateData, result];
};

export const useDbExist = (path, value) => {
  const [exists, setExists] = useState(null);
  const [error, setError] = useState(null);
  const checkExists = useCallback(() => {
    let dbRef = ref(database, `${path}/${value}`);
    get(dbRef)
      .then((snapshot) => {
        setExists(snapshot.exists());
      })
      .catch((err) => {
        setError(err);
        setExists(null);
      });
  }, [database, path, value]);
  return [checkExists, exists, error];
};

export const useDbAdd = (path, index = null) => {
  const [result, setResult] = useState(null);
  const makeResult = (error) => ({
    success: !error,
    error: error || null,
  });
  const addData = useCallback(
    (data) => {
      let dbRef;
      if (index) {
        dbRef = ref(database, `${path}/${index}`);
      } else {
        dbRef = push(ref(database, path));
      }
      set(dbRef, data)
        .then(() => setResult(makeResult()))
        .catch((error) => setResult(makeResult(error)));
    },
    [database, path, index]
  );
  return [addData, result];
};

export const useDbRemove = () => {
  const [result, setResult] = useState(null);
  const makeResult = (error) => ({
    success: !error,
    error: error || null,
  });
  const removeData = useCallback((path) => {
    remove(ref(database, path))
      .then(() => setResult(makeResult()))
      .catch((error) => setResult(makeResult(error)));
  }, []);
  return [removeData, result];
};
