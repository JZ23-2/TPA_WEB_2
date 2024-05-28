import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATbAnwHGe-sIsLPOOm694uClKoKpw_Xoc",
  authDomain: "travelohi-4f176.firebaseapp.com",
  projectId: "travelohi-4f176",
  storageBucket: "travelohi-4f176.appspot.com",
  messagingSenderId: "104457616102",
  appId: "1:104457616102:web:93e305f3387d8b21831927",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
