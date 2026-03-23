import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  userToken: string | null;
  user: { name: string, email: string } | null;
  watchlist: any[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfileName: (name: string) => Promise<boolean>;
  addToWatchlist: (movie: any) => Promise<boolean>;
  removeFromWatchlist: (movieId: number) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(userToken: string | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // In Expo Router, the root index.tsx maps to an empty segment array
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === 'login' || firstSegment === '(auth)' || firstSegment === 'register';

    console.log({ inAuthGroup, segments })

    if (!userToken && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/login');
    } else if (userToken && inAuthGroup) {
      // Redirect away from the login page.
      router.replace('/(home)');
    }
  }, [userToken, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      let userToken;
      let userData = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        const userStr = await AsyncStorage.getItem('userData');
        if (userStr) {
          userData = JSON.parse(userStr);
          const wlStr = await AsyncStorage.getItem(`watchlist_${userData.email}`);
          if (wlStr) setWatchlist(JSON.parse(wlStr));
        }
      } catch (e) {
        // Restoring token failed
      }
      setUserToken(userToken || null);
      setUser(userData);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  useProtectedRoute(userToken, isLoading);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const usersStr = await AsyncStorage.getItem('registeredUsers');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const user = users.find((u: any) => u.email === email && u.password === pass);
        if (user) {
          const fakeToken = `token_${new Date().getTime()}`;
          await AsyncStorage.setItem('userToken', fakeToken);
          await AsyncStorage.setItem('userData', JSON.stringify({ name: user.name, email: user.email }));
          setUserToken(fakeToken);
          setUser({ name: user.name, email: user.email });
          const wlStr = await AsyncStorage.getItem(`watchlist_${user.email}`);
          if (wlStr) setWatchlist(JSON.parse(wlStr));
          setIsLoading(false);
          return true;
        }
      }
      setIsLoading(false);
      return false;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const usersStr = await AsyncStorage.getItem('registeredUsers');
      let users = [];
      if (usersStr) {
        users = JSON.parse(usersStr);
      }

      const userExists = users.find((u: any) => u.email === email);
      if (userExists) {
        setIsLoading(false);
        return false; // User already exists!
      }

      users.push({ name, email, password: pass });
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));

      const fakeToken = `token_${new Date().getTime()}`;
      await AsyncStorage.setItem('userToken', fakeToken);
      await AsyncStorage.setItem('userData', JSON.stringify({ name, email }));
      setUserToken(fakeToken);
      setUser({ name, email });
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  };

  const updateProfileName = async (newName: string) => {
    if (!user) return false;
    try {
      const usersStr = await AsyncStorage.getItem('registeredUsers');
      if (usersStr) {
        let users = JSON.parse(usersStr);
        const index = users.findIndex((u: any) => u.email === user.email);
        if (index !== -1) {
          users[index].name = newName;
          await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
          await AsyncStorage.setItem('userData', JSON.stringify({ ...user, name: newName }));
          setUser({ ...user, name: newName });
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const addToWatchlist = async (movie: any) => {
    if (!user) return false;
    try {
      const newWatchlist = [...watchlist, movie];
      setWatchlist(newWatchlist);
      await AsyncStorage.setItem(`watchlist_${user.email}`, JSON.stringify(newWatchlist));
      return true;
    } catch {
      return false;
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return false;
    try {
      const newWatchlist = watchlist.filter(m => m.id !== movieId);
      setWatchlist(newWatchlist);
      await AsyncStorage.setItem(`watchlist_${user.email}`, JSON.stringify(newWatchlist));
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setUserToken(null);
    setUser(null);
    setWatchlist([]);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, watchlist, isLoading, login, register, logout, updateProfileName, addToWatchlist, removeFromWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
}
