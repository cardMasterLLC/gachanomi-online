import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/client";
import { useRouter } from "next/router";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthLoading(true);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setPoints(0);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        authLoading,
        points,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
