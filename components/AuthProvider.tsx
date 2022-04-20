import { auth, provider } from "@lib/firebase";
import {
  Button,
  Center,
  Loader,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { getAuth, signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import GoogleIcon from "./GoogleIcon";
import Logo from "./Logo";

interface User extends FirebaseUser {
  token: string;
}

const AuthContext = createContext<User>({} as User);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  useEffect(() => {
    const auth = getAuth();
    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(undefined);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      setCurrentUser({ ...user, token });
      setLoading(false);
    });
  }, []);
  if (loading)
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader size="xl" variant="bars" />
      </Center>
    );
  if (!currentUser)
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Stack align="center">
          <Logo colorScheme={colorScheme} />
          <Button
            leftIcon={<GoogleIcon />}
            variant="default"
            color="gray"
            onClick={() => signInWithPopup(auth, provider)}
          >
            Continue with Google
          </Button>
        </Stack>
      </Center>
    );
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
