import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({
                ...user,
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                userId: userId,
            });
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes("(auth/invalid-email)")) msg = "דוא”ל שגוי";
            if (msg.includes("(auth/invalid-credential)"))
                msg = "שם משתמש או הסיסמה שגויים ";
            return { success: false, msg };
        }
    };
    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    };

    const register = async (fullName, phoneNumber, email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("response.user :", response?.user);

            const myKids = [];
            await setDoc(doc(db, "users", response?.user?.uid), {
                fullName,
                phoneNumber,
                email,
                myKids,
            });
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;
            if (msg.includes("(auth/invalid-email)")) msg = "דוא”ל שגוי";
            if (msg.includes("(auth/email-already-in-use)"))
                msg = "הדוא”ל הזה כבר בשימוש";
            if (
                msg.includes(
                    "Firebase: Password should be at least 6 characters (auth/weak-password)."
                )
            )
                msg = "הסיסמה צריכה להיות בת 6 תווים לפחות";

            return { success: false, msg };
        }
    };

    const forgatPass = async (email) => {
        try {
            const response = await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes("(auth/invalid-email)")) msg = "דוא”ל לא קיים";
            if (msg.includes("(auth/missing-email).")) msg = " הכנס דוא”ל ";
            return { success: false, msg };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                register,
                logout,
                forgatPass,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be wrapped inside AuthContextProvider");
    }
    return value;
};
