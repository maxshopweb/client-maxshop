import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAhEO_mUUcOz_biVKcqOrz2Q6xj7LwHJ9A",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "maxshop-86609.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "maxshop-86609",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "maxshop-86609.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "94563935971",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:94563935971:web:ab33cd599e8be2a9ba87d6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-KH58135XXY"
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