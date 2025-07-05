import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

export default function News({ newsList }) {
    return (
        <LinearGradient
            colors={["#0FA401", "#61B331"]}
            start={{ x: 0.1, y: 0.8 }}
            end={{ x: 0.4, y: 1 }}
            style={{
                width: wp(90),
                height: hp(21),
                borderRadius: 20,
                marginTop: 45,
                padding: 5,
            }}
            className='flex-1 items-contain justify-contain '>
            <FlatList
                data={newsList}
                vertical={true}
                inverted={false}
                renderItem={({ item }) => (
                    <View>
                        <Text className='text-[18px] color-white text-right h-[0px] w-[385px]  px-16 p-6 gap-10 rounded-lg object-contain font-bold rhigt-'>
                            {item.headline}
                        </Text>
                        <Text className='text-[18px] color-white text-right h-[100px] w-[385px] px-16 p-2 rounded-lg object-contain'>
                            {item.message}
                        </Text>
                    </View>
                )}
            />
            <View
                className='flex-1 items-left justify-center'
                style={{ white: 50, height: 90 }}>
                <Image
                    className='justify-center '
                    style={{
                        borderRadius: 20,
                        height: 125,
                        width: 80,
                        top: -65,
                    }}
                    source={require("../../assets/images/message.png")}
                />
            </View>
        </LinearGradient>
    );
}
