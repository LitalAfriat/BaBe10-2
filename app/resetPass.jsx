import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Loading from "../components/Loading";

import { useAuth } from "../firebase/authContext";

export default function ResetPass() {
    const { forgatPass } = useAuth();
    const emailRef = useRef("");
    const [loading, setLoading] = useState(false);

    const handlePassRecovery = async () => {
        setLoading(true);
        let response = await forgatPass(emailRef.current);
        if (!response.success) {
            Alert.alert("שכחתי סיסמה", response.msg);
        } else {
            router.replace("/emailReqSuccess");
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className=' justify-center'
            style={{ flex: 1, transform: [{ translateY: -60 }] }}>
            <StatusBar style='dark' />
            <TouchableOpacity
                onPress={() => router.replace("/signInRegister")}
                style={{
                    height: hp(10),
                    width: hp(10),
                    zIndex: 1,
                    position: "absolute",
                    top: hp(10),
                }}>
                <MaterialCommunityIcons
                    name='keyboard-backspace'
                    size={45}
                    color='#61B331'
                    top={35}
                    left={25}
                />
            </TouchableOpacity>

            <View className=' items-center'>
                <Image
                    style={{ height: hp(35), marginTop: hp(-3) }}
                    resizeMode='contain'
                    source={require("../assets/images/pass.png")}
                />
            </View>
            <View className='gap-7 items-center' style={{ marginTop: hp(3) }}>
                <Text
                    style={{ height: hp(5), fontSize: hp(4) }}
                    className=' tracking-wider text-center text-4xl items-center text-neutral-800'>
                    שכחת סיסמה?
                </Text>
                <Text
                    style={{ top: -45, padding: hp(2), fontSize: hp(2) }}
                    className=' tracking-wider text-center text-4xl items-center text-neutral-800'>
                                            אל דאגה! זה קורה, הכנס בבקשה את כתובת הדוא"ל שלך.
                </Text>

                <View
                    style={{ height: hp(4), paddingRight: hp(3), top:-45, alignItems:"center" }}
                    className='flex-row gap-3 px-6 items-center justify-center rounded-xl'>
                    <Octicons
                        name='mail'
                        size={hp(2.7)}
                        color='gray'
                        style={{ transform: [{ translateX: 40 }] }}
                    />
                    <TextInput
                        onChangeText={(value) => (emailRef.current = value)}
                        style={{
                            fontSize: hp(2),
                            borderBottomWidth: 1.5,
                            borderBottomColor: "#EFF5ED",
                            paddingHorizontal: 12,
                            
                        }}
                        className='flex-1 font-poppins text-neutral-700 text-right '
                        placeholder='הכנס דוא”ל'
                        placeholderTextColor={"gray"}
                    />
                </View>

                <View className='gap-4'>
                    {loading ? (
                        <View
                            className='justify-center'
                            style={{
                                height: hp(5.5),
                                width: hp(40),
                                alignItems: "center",
                                borderRadius: 25,
                                justifyContent: "center",
                                top: hp(3),
                            }}>
                            <Loading size={hp(40)} />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handlePassRecovery}
                            style={{
                                height: hp(5.5),
                                width: hp(40),
                                alignItems: "center",
                                backgroundColor: "#61B331",
                                borderRadius: 25,
                                justifyContent: "center",
                                top: hp(-3),
                            }}>
                            <Text
                                style={{ fontSize: hp(2.7) }}
                                className='text-white font-bold tracking-wider rounded-xl justify-center items-center'>
                                שלח
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
