
import {
  getAuth, signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './Secrets';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { query, collection, getDocs, getFirestore, where } from 'firebase/firestore';


let app, auth;
// this guards against initializing more than one "App"
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  auth = getAuth(app); // if auth already initialized
}

const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
}

const signOut = async () => {
  await fbSignOut(auth);
}

const signUp = async (displayName, email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: displayName });
}

const getAuthUser = () => {
  return auth.currentUser;
}

let unsubscribeFromAuthChanges = undefined;

const subscribeToAuthChanges = (navigation) => {
  if (unsubscribeFromAuthChanges) {
    unsubscribeFromAuthChanges();
  }
  unsubscribeFromAuthChanges = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const q = query(collection(db, "pet"), where('userId', '==', user.uid));
      try {
        let querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          navigation.navigate('Create');
        } else {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    } else {
      console.log('user is signed out!');
      navigation.navigate('Login');
    }
  })
}

export { signIn, signOut, signUp, getAuthUser, subscribeToAuthChanges }