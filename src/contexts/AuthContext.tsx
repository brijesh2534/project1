import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';

// 1. DEFINE STATIC CREDENTIALS
const STATIC_ADMIN = {
  email: 'admin.brijesh@gmail.com',
  password: 'Brijesh2534'
};

// Mock User object to satisfy TypeScript when using static login
const MOCK_USER: any = {
  uid: 'static-admin-001',
  email: STATIC_ADMIN.email,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
  displayName: 'Admin Brijesh',
  phoneNumber: null,
  photoURL: null,
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. CHECK LOCAL STORAGE FOR STATIC SESSION ON LOAD
    const isStaticAuth = localStorage.getItem('static_auth') === 'true';
    if (isStaticAuth) {
      setUser(MOCK_USER);
      setLoading(false);
      return; 
    }

    // Otherwise, listen to Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    // 3. CHECK STATIC CREDENTIALS FIRST
    if (email === STATIC_ADMIN.email && password === STATIC_ADMIN.password) {
      setUser(MOCK_USER);
      localStorage.setItem('static_auth', 'true'); // Persist login
      return;
    }

    // If not static, try Firebase
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    // 4. CLEAR STATIC SESSION AND FIREBASE SESSION
    localStorage.removeItem('static_auth');
    setUser(null);
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}