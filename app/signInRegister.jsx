import {
    KeyboardAvoidingView,
    ImageBackground,
    View,
    Platform,
} from "react-native";
import SignIn from "../components/auth/SignIn";
import Register from "../components/auth/Register";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import ToggleSwitch from "../components/auth/ToggleSwitch";

export default function SignInRegister() {
    const [toggleValue, setToggleValue] = useState(false);
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
            <ImageBackground
                className='items-center justify-center'
                style={{ width: "100%", height: "100%" }}
                resizeMode='cover'
                source={require("../assets/images/loginRegister.png")}>
                <StatusBar style='dark' />
                <View
                    className='items-center justify-center'
                    style={{
                        backgroundColor: "#EFF5ED",
                        borderRadius: 35,
                        height: 580,
                        width: 364,
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                        top: -25,
                    }}>

                    <View
                        className='absolute'
                        style={{ transform: [{ translateY: -220 }] }}>
                        <ToggleSwitch onChange={setToggleValue} value={toggleValue}/>
                    </View>
                    <View style={{ transform: [{ translateY: 140 }] }}>
                        {toggleValue ? <Register /> : <SignIn />}
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}
