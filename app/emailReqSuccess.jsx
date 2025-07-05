import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import React from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";

export default function ResetPass() {
    const handlePassRecovery = () => {
        router.replace("/signInRegister");
    };

    return (
        <View
            className='items-center cover'
            style={{ backgroundColor: "#EFF5ED" }}>
            <View
                className='items-center '
                style={{
                    transform: [{ translateY: 150 }],
                    backgroundColor: "#FFFF",
                    borderRadius: 35,
                    height: 580,
                    width: 364,
                    shadowColor: "#727273",
                    shadowRadius: 4,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 5 },
                    top: 5,
                }}>
                <StatusBar style='dark' />
                <View className=' items-center'>
                    <Image
                        style={{ height: hp(35), marginTop: hp(-3) }}
                        resizeMode='contain'
                        source={require("../assets/images/network-email.gif")}
                    />
                </View>
                <View
                    className='gap-4 items-center'
                    style={{ marginTop: hp(3), top: -60, padding: 20 }}>
                    <Text
                        style={{ height: hp(4), fontSize: hp(3.5) }}
                        className=' tracking-wider text-center text-4xl items-center text-neutral-800'>
                        הבקשה הוגשה בהצלחה
                    </Text>
                    <Text
                        style={{ padding: hp(-2), fontSize: hp(2), top: -2 }}
                        className=' tracking-wider text-center text-4xl items-center text-neutral-800'>
                        ברגעים אלה נשלח לדוא"ל שלך שחזור סיסמה.
                    </Text>

                    <View className='gap-4'>
                        <TouchableOpacity
                            onPress={handlePassRecovery}
                            style={{
                                height: hp(5.5),
                                width: hp(20),
                                alignItems: "center",
                                backgroundColor: "#61B331",
                                borderRadius: 15,
                                justifyContent: "center",
                                top: hp(1),
                            }}>
                            <Text
                                style={{ fontSize: hp(2.7) }}
                                className='text-white font-bold tracking-wider rounded-xl justify-center items-center'>
                                חזרה
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
