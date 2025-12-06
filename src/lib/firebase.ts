import { initializeApp } from "firebase/app";
import { doc, Firestore, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIRE_API_KEY,
  authDomain: process.env.FIRE_AUTH_DOMAIN,
  projectId: process.env.FIRE_PROJECT_ID,
  storageBucket: process.env.FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_MESSAGE_ID,
  appId: process.env.FIRE_APP_ID,
  measurementId: process.env.FIRE_MEASUREMENT,
};

let app: any;
let firestoreDb: Firestore;

const initializeFirebaseApp = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore();

    return app;
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      result: error,
    };
  }
};

export const uploadProcesedData = async () => {
  const dataToUpload = {
    key1: "Goncang",
    key2: "Samudera nasution",
  };

  try {
    const document = doc(firestoreDb, "message", "some-testing-unique-id");
    let dataUpload = await setDoc(document, dataToUpload);

    return dataUpload;
  } catch (error) {
    console.log(error);
  }
};

const getFirebaseApp = () => app;

export { initializeFirebaseApp, getFirebaseApp, firestoreDb };
