import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAL-ho5hIkUJdmjnW2DpSrHnYMVMXpGIMs",
  authDomain: "maiz-56c5e.firebaseapp.com",
  projectId: "maiz-56c5e",
  storageBucket: "maiz-56c5e.appspot.com",
  messagingSenderId: "748649640094",
  appId: "1:748649640094:web:64afd7ce863a5d4ac5cb8f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
export const database = getFirestore(app);
export const storage = getStorage(app);

export default app;
