import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
// import "../global.css";
import { AuthContextProvider, useAuth } from "../firebase/authContext";
import "../global.css";

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        //check if user is authenticated or not
        if (typeof isAuthenticated == "undefined") return;
        const inApp = segments[0] == "(app)";
        if (isAuthenticated && !inApp) {
            //redirect to home
            router.replace("/(tabs)/home");
        } else if (isAuthenticated == false) {
            //redirect to signIn
            router.replace("signInRegister");
        }
    }, [isAuthenticated]);

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}
