import { View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ArrowBack({ backScreen, color }) {
    return (
        <TouchableOpacity
            onPress={() => router.replace(backScreen)}
            style={{
                height: hp(15),
                width: hp(15),
                position: "absolute",
                top: hp(6),
                left: wp(7),
                zIndex: 20,
            }}>
            <View className='p-1'>
                <MaterialCommunityIcons
                    name='keyboard-backspace'
                    size={50}
                    color={color ? color : "#61B331"}
                />
            </View>
        </TouchableOpacity>
    );
}
