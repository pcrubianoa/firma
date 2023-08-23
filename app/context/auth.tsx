import { useRootNavigation, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { appwrite } from "../lib/appwrite-service";
import { Models } from "appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the AuthContextValue interface
interface SignInResponse {
  data: Models.User<Models.Preferences> | undefined;
  error: Error | undefined;
}

interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

interface AuthContextValue {º
  signIn: (e: string, p: string) => Promise<any>;
  signUp: (e: string, p: string, n: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  user: Models.User<Models.Preferences> | null;
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
  const [user, setAuth] =
    React.useState<Models.User<Models.Preferences> | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  // This hook will protect the route access based on user authentication.
  const useProtectedRoute = (user: Models.User<Models.Preferences> | null) => {
    const segments = useSegments();
    const router = useRouter();

    // checking that navigation is all good;
    const [isNavigationReady, setNavigationReady] = useState(false);
    const rootNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener("state", (event) => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    React.useEffect(() => {
      if (!isNavigationReady) {
        return;
      }

      const inAuthGroup = segments[0] === "(auth)";

      if (!authInitialized) return;

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.push("/sign-in");
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.push("/");
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  };

  useEffect(() => {
    (async () => {
      try {
        //const user = await appwrite.account.get();
        const user = await getData('user');
        //console.log(user);
        setAuth(user);
        //setAuthInitialized(true);
        //console.log("initialize ", user);
      } catch (error) {
        //console.log("error", error);
        setAuth(null);
      } finally {
        setAuthInitialized(true); // Mover esta línea al final
      }
      // setAuthInitialized(true);
      // console.log("initialize ", user);
    })();
  }, []);

  /**
   *
   * @returns
   */
  const logout = async (): Promise<SignOutResponse> => {
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
              console.log('data.user: ', data.user);
              storeData(data.user);
            }
          })


      // const response = await appwrite.account.createEmailSession(
      //   email,
      //   password
      // );

      const user = await getData('user');
      setAuth(user);
      return { data: user, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  /**
   * 
   * @param email 
   * @param password 
   * @param username 
   * @returns 
   */
  const createAcount = async (
    email: string,
    password: string,
    username: string
  ): Promise<SignInResponse> => {
    try {
      console.log(email, password, username);

      // create the user
      await appwrite.account.create(
        appwrite.ID.unique(),
        email,
        password,
        username
      );

      // create the session by logging in
      await appwrite.account.createEmailSession(email, password);

      // get Account information for the user
      const user = await appwrite.account.get();
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
        signUp: createAcount,
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