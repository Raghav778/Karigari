import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const triggerWelcome = useCallback((name: string) => {
    setWelcomeName(name);
    setTimeout(() => setWelcomeName(null), 4000);
  }, []);

  return (
    <AuthContext.Provider value={{ user, welcomeName, triggerWelcome }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
