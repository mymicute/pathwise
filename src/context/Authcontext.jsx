import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, userName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      userName,
      email,
      selectedCareer: 'General',
      triviaAnswers: {},
      lessons: {},
      streak: 0,
      createdAt: new Date().toISOString(),
      authProvider: 'password'
    });
    
    return userCredential.user;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(doc(db, 'users', user.uid), {
        userName: user.displayName || user.email.split('@')[0],
        email: user.email,
        selectedCareer: 'General',
        triviaAnswers: {},
        lessons: {},
        streak: 0,
        createdAt: new Date().toISOString(),
        authProvider: 'google',
        photoURL: user.photoURL
      });
    }
    
    return user;
  }

  async function logout() {
    return signOut(auth);
  }

  async function updateUserData(updates) {
    if (!currentUser) return;
    await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        setUserData(docSnap.exists() ? docSnap.data() : null);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userData, 
      signup, 
      login, 
      loginWithGoogle,
      logout, 
      updateUserData, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}