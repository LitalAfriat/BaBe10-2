import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { router } from "expo-router";

export default function Slider({ sliderList }) {
    return (
        <View className='mt-5'>
            <FlatList
                data={sliderList}
                horizontal={true}
                inverted={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            router.replace({
                                pathname: "/(tabs)/menu/[sandwich]",
                                params: {
                                    sandwich: JSON.stringify(item),
                                },
                            })
                        }
                        className='h-[200px] w-[300px] mr-1  rounded-lg object-contain flex-1 items-center justify-center'
                        style={{
                            alignItems: "center",
                            textAlign: "right",
                            margin: 9,
                            borderRadius: 20,
                            height: 186,
                            width: 159,
                            backgroundColor: "#EFF5ED",
                            shadowColor: "#727273",
                            shadowRadius: 2,
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 5 },
                        }}>
                        <View>
                            <Image
                                source={{ uri: item?.picture }}
                                className='h-[147px] w-[159px]  '
                                style={{
                                    borderRadius: 25,
                                    shadowColor: "#727273",
                                    shadowRadius: 8,
                                    shadowOpacity: 0.8,
                                    shadowOffset: { width: 5, height: 5 },
                                }}
                            />
                            <View style={{ top: hp(0.1) }}>
                                <Text
                                    className='py-1'
                                    style={{ textAlign: "center" }}>
                                    {item.name}
                                </Text>
                                <Text
                                    className=' pr-1 '
                                    style={{
                                        color: "#858585",
                                        textAlign: "center",
                                    }}>
                                    ₪{item?.price.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
