import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons } from "@expo/vector-icons";
import Loading from "../Loading";
import { useAuth } from "../../firebase/authContext";
import { Link } from "expo-router";

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleComingSoon = () => {
        Alert.alert("Feature", "Coming Soon");
    };

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("התחבר", "נא למלא את כל השדות!");
            return;
        }
        setLoading(true);
        const response = await login(emailRef.current, passwordRef.current);
        //login process
        setLoading(false);
        if (!response.success) {
            Alert.alert("Sign In", response.msg);
        }
    };

    return (
        <View
            style={{ transform: [{ translateY: -110 }] }}
            className='justify-center '>
            <View
                style={{ height: hp(7) }}
                className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                <Octicons
                    name='mail'
                    size={hp(2.7)}
                    color='gray'
                    style={{ transform: [{ translateX: 27 }] }}
                />
                <TextInput
                    onChangeText={(value) => (emailRef.current = value)}
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
            <View className='gap-0  justify-center'>
                <View
                    style={{ height: hp(7) }}
                    className=' justify-center flex-row gap-2 px-2 items-center rounded-xl '>
                    <Octicons
                        name='lock'
                        size={hp(2.7)}
                        color='gray'
                        style={{
                            transform: [{ translateX: 29 }, { translateY: -1 }],
                        }}
                    />
                    <TextInput
                        onChangeText={(value) => (passwordRef.current = value)}
                        style={{
                            fontSize: hp(2),
                            borderBottomWidth: 1,
                            borderBottomColor: "#FFFFFF",
                            paddingHorizontal: 10,
                        }}
                        className='flex-1 font-poppins text-neutral-700 text-right'
                        placeholder='סיסמה '
                        secureTextEntry
                        placeholderTextColor={"gray"}
                    />
                </View>
                <TouchableOpacity>
                    <Text
                        style={{
                            fontSize: hp(1.8),
                            transform: [{ translateX: 40 }],
                        }}
                        className='font-semibold text-neutral-500'>
                        <Link replace href='/resetPass'>
                            שכחת סיסמה?
                        </Link>
                    </Text>
                </TouchableOpacity>
            </View>

            {/* submit button */}

            <View style={{ alignItems: "center", paddingTop: 45 }}>
                {loading ? (
                    <View
                        className='flex-row justify-center'
                        style={{
                            height: hp(6.5),
                            width: hp(30),
                            alignItems: "center",
                            borderRadius: 25,
                            justifyContent: "center",
                        }}>
                        <Loading size={hp(40)} />
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleLogin}
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
                            התחבר
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <View className='items-center '>
                <Text
                    style={{ fontSize: hp(1.8), padding: 30 }}
                    className='font-semibold text-neutral-500 justify-center  items-center'>
                    או
                </Text>

                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={handleComingSoon}>
                        <Image
                            source={require("../../assets/images/apple.png")}
                            style={{
                                marginRight: 20,
                                height: hp(5),
                                width: hp(5),
                                transform: [{ translateY: -4 }],
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleComingSoon}>
                        <Image
                            source={require("../../assets/images/google.png")}
                            style={{ height: hp(5), width: hp(5) }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleComingSoon}>
                        <Image
                            source={require("../../assets/images/facebook.png")}
                            style={{
                                marginLeft: 20,
                                height: hp(5),
                                width: hp(5),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
