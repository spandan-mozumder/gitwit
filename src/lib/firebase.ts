import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { set } from "date-fns";

const firebaseConfig = {
  apiKey: "AIzaSyDo-c8MR_4C9-4w5Cfi6GGcT6AJGM4u_rI",
  authDomain: "gitwit-15d76.firebaseapp.com",
  projectId: "gitwit-15d76",
  storageBucket: "gitwit-15d76.firebasestorage.app",
  messagingSenderId: "88481637742",
  appId: "1:88481637742:web:21e83e96b46d7cd5558d7f",
  measurementId: "G-F1RY35QX2K",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (setProgress) setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl as string);
          });
        },
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
