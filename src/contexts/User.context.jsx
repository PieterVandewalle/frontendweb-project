import { useAuth0 } from "@auth0/auth0-react";
import useMeApi from "../api/me";
import { createContext, useState, useMemo, useContext, useEffect, useCallback } from "react";

export const UserContext = createContext();
export const useUserInfo = () => useContext(UserContext);

export function UserProvider({
  children,
}) {
  const { getProfile } = useMeApi();
  const [user, setUser] = useState(null);
  const { id, username } = user || {};
  const { isAuthenticated } = useAuth0();
  const [error, setError] = useState(null);

  const getUserInfo = useCallback(async () => {
    setError(null);
    try {
      const user = await getProfile();
      setUser(user);
    } catch (error) {
      setError(error.message);
    }
  }, [getProfile]);


  useEffect(() => {
    if (isAuthenticated) {
      getUserInfo();
    } else {
      setUser(null);
    }
  }, [isAuthenticated, getUserInfo]);


  const value = useMemo(() => ({ id, username, getUserInfo, error }), [id, username, getUserInfo, error]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

