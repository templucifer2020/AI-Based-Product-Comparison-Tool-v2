import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'productinsight-ai',
  appId: '1:199735084454:web:f75b07f5e7d6c41439bb67',
  storageBucket: 'productinsight-ai.firebasestorage.app',
  apiKey: 'AIzaSyBwfiZ7MBLfKCa_PYUr-u70sRQo5ZnB7pU',
  authDomain: 'productinsight-ai.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '199735084454',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
