import { useRootNavigation, useRouter, useSegments, useRootNavigationState } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  apiKey : string;
  clave : string;
  comision : string;
  created_at : string;
  id : string;
  id_cargo : string;
  nombre : string;
  telefono : string;
  token : string;
  updated_at : string;
  usuario : string;
}

interface AuthContextValue {
  signIn: (e: string, p: string) => Promise<any>;
  signOut: () => Promise<any>;
  user: User | null;
  authInitialized: boolean;
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function Provider(props: ProviderProps) {
  const [user, setAuth] = React.useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  // This hook will protect the route access based on user authentication.
  const useProtectedRoute = (user: User | null) => {
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
      if (!navigationState?.key) return;

      const inAuthGroup = segments[0] === "(auth)";

      if ( !user && !inAuthGroup) {
        router.replace("/sign-in");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, [user, segments, authInitialized, navigationState]);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await getData('user');
        setAuth(user);
      } catch (error) {
        setAuth(null);
      } finally {
        setAuthInitialized(true);
      }
    })();
  }, []);

  /**
   *
   * @returns
   */
  const logout = async (): Promise<any> => {
    try {
      //const response = await appwrite.account.deleteSession("current");
      removeData('user');
      return { error: undefined, data: true };
    } catch (error) {
      return { error, data: undefined };
    } finally {
      setAuth(null);
    }
  };
  /**
   *
   * @param email
   * @param password
   * @returns
   */
  const login = async (
    email: string,
    password: string
  ): Promise<any> => {
    try {
      // validar credenciales
      const response = await fetch("https://api.logis.com.co/v1/secure", {
        method: 'POST',
        body: JSON.stringify({
            'user': email,
            'pass': password,
            'application': 'bares'
        }),
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
              storeData(data.user);
            }
          })

      const user = await getData('user');
      setAuth(user);
      return { data: user, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        user,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Define the useAuth hook
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
};

// localstorage
const storeData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async (key:any) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const removeData = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // saving error
  }
};