import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../firebase/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";

import TermsModal from "../../components/TermsModal";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function UserDashboard() {
    const { logout, user } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
    };
    console.log("user data: ", user);

    return (
        <View className='gap-12 bg-white flex-1 '>
            <StatusBar style='dark' />

            <Text
                style={{
                    fontSize: 36,
                    padding: 11,
                    color: "#61B331",
                    textAlign: "center",
                    top: hp(12),
                }}>
                אזור אישי
            </Text>

            <View
                style={{
                    padding: 6,
                    top: hp(8),
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <FontAwesome name='user-circle-o' size={100} color='gray' />
            </View>

            <View className='justify-center items-center ' style={{ top: 60 }}>
                <Text
                    style={{
                        top: hp(1),
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: hp(2.4),
                    }}>
                    {user.fullName}
                </Text>
                <Text
                    style={{
                        top: hp(4),
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: hp(2.4),
                    }}>
                    {user.phoneNumber}
                </Text>

                <TouchableOpacity
                    onPress={() => router.replace(`/(tabs)/user/userUpdate`)}
                    style={{
                        height: hp(6),
                        width: hp(24),
                        backgroundColor: "#61B331",
                        borderRadius: 25,
                        justifyContent: "center",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                        top: hp(9),
                    }}>
                    <Text
                        style={{
                            fontSize: hp(2.4),
                        }}
                        className='text-white text-center'>
                        עדכון פרטים
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        height: hp(6),
                        width: hp(14),
                        backgroundColor: "#61B331",
                        borderRadius: 25,
                        justifyContent: "center",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                        top: hp(15),
                    }}>
                    <Text
                        style={{
                            fontSize: hp(2.4),
                        }}
                        className='text-white text-center'>
                        ניתוק
                    </Text>
                </TouchableOpacity>

                <TermsModal
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

                <Pressable onPress={() => setModalVisible(true)}>
                    <Text
                        style={{ fontSize: hp(1.8), top: hp(19) }}
                        className='underline underline-offset-1'>
                        תנאים כלליים/ניהול איסוף המידע
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
