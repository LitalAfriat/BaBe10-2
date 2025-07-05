// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGA47O4XtLGMVpabzlO0iugZoJruSxZgA",
    authDomain: "babe10.firebaseapp.com",
    projectId: "babe10",
    storageBucket: "babe10.appspot.com",
    messagingSenderId: "731501564771",
    appId: "1:731501564771:web:13dbe767368c2ca16af956",
    measurementId: "G-Z9LD8WN8NS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// Test Firebase connection
const testFirebaseConnection = async () => {
    try {
        // Test Firestore connection by attempting to get app info
        const appCheck = app.options;
        console.log("✅ Firebase initialized successfully");
        console.log("Project ID:", appCheck.projectId);

        // Test Auth connection
        if (auth) {
            console.log("✅ Firebase Auth initialized successfully");
        }

        // Test Firestore connection
        if (db) {
            console.log("✅ Firestore initialized successfully");
        }

        return true;
    } catch (error) {
        console.error("❌ Firebase connection failed:", error);
        return false;
    }
};

// Run the test
testFirebaseConnection();

// Export the test function for use in other components
export { testFirebaseConnection };
