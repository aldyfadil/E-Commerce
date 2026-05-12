import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'user' | 'admin';
  wishlist: string[];
}

interface AuthStore {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setProfile: (profile: UserProfile | null) => void;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  setProfile: (profile) => set({ profile }),
  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          set({ user, profile: docSnap.data() as UserProfile, loading: false, initialized: true });
        } else {
          set({ user, profile: null, loading: false, initialized: true });
        }
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
  },
}));
