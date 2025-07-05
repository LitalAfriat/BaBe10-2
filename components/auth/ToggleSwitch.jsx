import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    Extrapolation,
    interpolateColor,
} from "react-native-reanimated";
import { debounce } from 'lodash';

const InterpolateXInput = [0, 1];

const ToggleSwitch = ({ onChange, value = false, containerStyle }) => {
    const [toggled, setToggled] = useState(value);
    const shareValue = useSharedValue(value ? 1 : 0);

    const containerScale = {
        height: 60,
        width: 260,
    };
    const switchScale = {
        height: 58,
        width: 140,
    };

    const onChangeToggle = () => {
        setToggled(!toggled);
        onChange?.(!toggled);
    };

    const onPressSwitch = debounce(() => {
        if (shareValue.value === 0) {
            shareValue.value = withTiming(1, {
                duration: 700,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
        } else {
            shareValue.value = withTiming(0, {
                duration: 700,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
        }
        onChangeToggle();
    },500);

    const switchAreaStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        shareValue.value,
                        InterpolateXInput,
                        [0, 118],
                        Extrapolation.CLAMP
                    ),
                },
            ],
            backgroundColor: interpolateColor(
                shareValue.value,
                InterpolateXInput,
                ["#61B331", "#61B331"]
            ),
        };
    });

    return (
        <TouchableOpacity
            onPress={onPressSwitch}
            activeOpacity={1}
            style={[styles.containerStyle, containerScale, containerStyle]}>
            <Animated.View
                style={[styles.switchButton, switchScale, switchAreaStyles]}
            />
            <View className="flex-row">
                <Text style={{end:25,fontSize:23,color: toggled ? "#61B331" : "white"}}>התחבר</Text>
                <Text style={{start:25,fontSize:23,color: toggled ? "white" : "#61B331"}}>הרשמה</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 500,
        borderColor: "#EAEAF5",
        borderWidth: 1,
    },
    switchButton: {
        position: "absolute",
        left: 0,
        borderRadius: 100,
    },
});

export default ToggleSwitch;
