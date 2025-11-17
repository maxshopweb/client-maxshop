import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAhEO_mUUcOz_biVKcqOrz2Q6xj7LwHJ9A",
  authDomain: "maxshop-86609.firebaseapp.com",
  projectId: "maxshop-86609",
  storageBucket: "maxshop-86609.firebasestorage.app",
  messagingSenderId: "94563935971",
  appId: "1:94563935971:web:ab33cd599e8be2a9ba87d6",
  measurementId: "G-KH58135XXY"
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