import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";
import { useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userdata, locationState, theme) => {
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
  };

  // const login = (userdata, locationState, theme) => {
  //   const updatedUser = {
  //     ...userdata,
  //     token: userdata?.token, // Ensure token is included
  //     locationState,
  //     theme,
  //   };
  //   setUser(updatedUser);
  //   localStorage.setItem("user", JSON.stringify(updatedUser));
  // };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseuser = result.user;
      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image: firebaseuser.photoURL || "https://github.com/shadcn.png",
      };
      const response = await axiosInstance.post("/user/login", payload);
      const locationState = response.data.locationState;
      const hour = new Date().getHours();
      const southernStates = [
        "Tamil Nadu",
        "Kerala",
        "Karnataka",
        "Andhra Pradesh",
        "Telangana",
      ];

      const isSouthernState = southernStates.includes(locationState);
      const theme = hour >= 10 && hour < 12 ? "light" : "dark";
      login(
        {
          ...response.data.result,
          token: response.data.token,
        },
        locationState,
        theme,
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
      if (!firebaseuser) return;

      // ✅ 1. FIRST try localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser && !user) {
        setUser(JSON.parse(storedUser));
        return;
      }

      // ✅ 2. Only call backend if no local user exists
      try {
        const payload = {
          email: firebaseuser.email,
          name: firebaseuser.displayName,
          image: firebaseuser.photoURL || "https://github.com/shadcn.png",
        };

        const response = await axiosInstance.post("/user/login", payload);

        login({
          ...response.data.result,
          token: response.data.token,
        });
      } catch (error) {
        console.error(error);
        logout();
      }
    });

    return () => unsubcribe();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get("/user/me");

      const updatedUser = {
        ...res.data,
        token: user?.token,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  // useEffect(() => {
  //   const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
  //     if (firebaseuser) {
  //       try {
  //         const payload = {
  //           email: firebaseuser.email,
  //           name: firebaseuser.displayName,
  //           image: firebaseuser.photoURL || "https://github.com/shadcn.png",
  //         };
  //         const response = await axiosInstance.post("/user/login", payload);
  //         login({
  //           ...response.data.result,
  //           token: response.data.token,
  //         });
  //       } catch (error) {
  //         console.error(error);
  //         logout();
  //       }
  //     }
  //   });
  //   return () => unsubcribe();
  // }, []);

  return (
    <UserContext.Provider
      value={{ user, refreshUser, login, logout, handlegooglesignin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
