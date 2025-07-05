import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import ArrowBack from "../../../components/ArrowBack";
import { useAuth } from "../../../firebase/authContext";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons, Feather, Fontisto } from "@expo/vector-icons";
import {
    getAuth,
    updateEmail,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
} from "firebase/auth";
import {
    doc,
    updateDoc,
    getFirestore,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { router } from "expo-router";

export default function UserUpdate() {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const db = getFirestore();
    const auth = getAuth();
    const { logout } = useAuth();

    useEffect(() => {
        // Load current user data
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
            // Fetch additional user data from Firestore
            // This assumes you have a 'users' collection with documents keyed by user UID
            const userDocRef = doc(db, "users", user.uid);
            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFullName(userData.fullName || "");
                    setPhoneNumber(userData.phoneNumber || "");
                }
            });
        }
    }, []);

    const update = async () => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("Error", "No user is currently signed in");
            return;
        }

        try {
            // Update email if changed
            if (email !== user.email) {
                await promptForReauthentication(user);
                await updateEmail(user, email);
            }

            if (fullName !== user.displayName) {
                await updateProfile(user, { displayName: fullName });
            }

            // Update additional user info in Firestore
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                email,
                fullName,
                phoneNumber,
            });

            Alert.alert("Success", "User information updated successfully");
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                // Handle re-authentication
                Alert.alert(
                    "Re-authentication Required",
                    "Please re-enter your current password to update your information",
                    [
                        {
                            text: "OK",
                            onPress: () => promptForReauthentication(user),
                        },
                    ]
                );
            } else {
                Alert.alert("Error", error.message);
            }
        } finally {
            // setLoading(false);
        }
    };

    const promptForReauthentication = (user) => {
        return new Promise((resolve, reject) => {
            // This is a simplified example. In a real app, you'd want to use a modal or a separate screen for this.
            Alert.prompt(
                "Please enter your current password:",
                null,
                async (currentPassword) => {
                    if (currentPassword) {
                        try {
                            const credential = EmailAuthProvider.credential(
                                user.email,
                                currentPassword
                            );
                            await reauthenticateWithCredential(
                                user,
                                credential
                            );
                            resolve(); // Resolve the promise after successful re-authentication
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "Re-authentication failed: " + error.message
                            );
                            reject(error); // Reject the promise if re-authentication fails
                        }
                    } else {
                        reject(new Error("No password provided")); // Reject if no password is provided
                    }
                }
            );
        });
    };

    const deleteAccount = async () => {
        // Implement account deletion logic here
        // This should include user confirmation, deleting user data from Firestore, and then deleting the user account
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            await promptForReauthentication(user);
                            if (user) {
                                // Delete user data from Firestore
                                const userDocRef = doc(db, "users", user.uid);
                                await deleteDoc(userDocRef);

                                // Delete user account
                                await deleteUser(user)
                                    .then(async () => {
                                        await logout();
                                    })
                                    .catch(async (error) => {
                                        console.log(error);
                                        await logout();
                                    });

                                Alert.alert(
                                    "Success",
                                    "Your account has been deleted."
                                );
                                router.replace("/signInRegister");
                            }
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "Failed to delete account: " + error.message
                            );
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <View className=' flex-1 bg-white'>
            <StatusBar style='dark' />
            <ArrowBack backScreen={"/(tabs)/userDashboard"} />
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    top: 8,
                }}>
                <View>
                    <Image
                        className='z-10'
                        style={{
                            borderRadius: 20,
                            height: 200,
                            width: 200,
                            top: hp(3),
                            left: 4,
                        }}
                        source={require("../../../assets/images/updateUser.png")}
                    />
                </View>

                <View>
                    <Text
                        style={{
                            fontSize: 34,
                            padding: 8,
                            color: "#61B331",
                            textAlign: "right",
                            right: -70,
                            top: hp(-0.8),
                        }}>
                        עדכון פרטים
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: "#EFF5ED",
                        borderRadius: 35,
                        height: 524,
                        width: 364,
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <View
                        style={{ transform: [{ translateY: 60 }] }}
                        className='justify-center '>
                        <View
                            style={{ height: hp(7) }}
                            className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                            <Feather
                                name='user'
                                size={hp(2.5)}
                                color='gray'
                                style={{ transform: [{ translateX: 27 }] }}
                            />
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                style={{
                                    fontSize: hp(2),
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#FFFFFF",
                                    paddingHorizontal: 10,
                                }}
                                className='flex-1 font-poppins text-neutral-700 text-right '
                                placeholder='שם מלא'
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View
                            style={{ height: hp(7) }}
                            className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                            <Fontisto
                                name='mobile-alt'
                                size={hp(2.5)}
                                color='gray'
                                style={{
                                    transform: [
                                        { translateX: 27 },
                                        { translateY: -4 },
                                    ],
                                }}
                            />

                            <TextInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={{
                                    fontSize: hp(2),
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#FFFFFF",
                                    paddingHorizontal: 10,
                                }}
                                className='flex-1 font-poppins text-neutral-700 text-right '
                                placeholder='מספר נייד'
                                placeholderTextColor={"gray"}
                            />
                        </View>

                        <View
                            style={{ height: hp(7) }}
                            className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                            <Octicons
                                name='mail'
                                size={hp(2.5)}
                                color='gray'
                                style={{ transform: [{ translateX: 27 }] }}
                            />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={{
                                    fontSize: hp(2),
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#FFFFFF",
                                    paddingHorizontal: 10,
                                }}
                                className='flex-1 font-poppins text-neutral-700 text-right '
                                placeholder='הכנס דוא”ל'
                                placeholderTextColor={"gray"}
                            />
                        </View>

                        <View
                            style={{
                                alignItems: "center",
                                paddingTop: hp(6),
                            }}>
                            <TouchableOpacity
                                onPress={update}
                                style={{
                                    height: hp(6.5),
                                    width: hp(30),
                                    alignItems: "center",
                                    backgroundColor: "#61B331",
                                    borderRadius: 25,
                                    justifyContent: "center",
                                }}>
                                <Text
                                    style={{ fontSize: hp(2.7) }}
                                    className='text-white font-bold tracking-wider rounded-xl justify-center items-center'>
                                    עדכן
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={deleteAccount}>
                            <Text
                                style={{
                                    fontSize: hp(2),
                                    top: hp(3),
                                    textAlign: "center",
                                }}
                                className='underline underline-offset-1'>
                                מחק חשבון
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
