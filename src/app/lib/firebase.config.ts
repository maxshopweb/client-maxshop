import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase solo una vez
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    
    // Configurar persistencia local para mantener sesión después de verificar email
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error al configurar persistencia de Firebase:', error);
    });
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    storage = getStorage(app);
  }
}

export { app, auth, storage };