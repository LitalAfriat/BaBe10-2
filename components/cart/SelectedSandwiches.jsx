import { View, Text, Image, Pressable } from "react-native";
import React, { useContext } from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CartContext } from "./cartContext";

export default function SelectedSandwiches({
    nameRef = "",
    priceRef = 0,
    quantityRef = 0,
    pictureRef,
    nameKids = "",
    item = {},
}) {
    const cart = useContext(CartContext);

    return (
        <View>
            <Pressable
                className='border-4 border-blue-700'
                style={{
                    paddingLeft: wp(2.5),
                    top: hp(1),
                    width: wp(15),
                    height: hp(10),
                    justifyContent: "center",
                }}
                onPress={() => {
                    cart.removeFromCart(item);
                }}>
                <FontAwesome6 name='circle-xmark' size={28} color='black' />
            </Pressable>

            <View className='absolute top-1 right-5'>
                <Image
                    source={{ uri: pictureRef }}
                    style={{
                        borderRadius: 20,
                        height: hp(19),
                        width: wp(38),
                        backgroundColor: "#EFF5ED",
                        shadowColor: "#727273",
                        shadowRadius: 2,
                        shadowOpacity: 0.3,
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                    }}
                />
            </View>
            <View style={{ top: hp(-2) }}>
                <Text
                    style={{
                        paddingBottom: hp(1),
                        paddingRight: wp(45),
                        textAlign: "right",
                        fontSize: 16,
                        fontWeight: "bold",
                    }}>
                    {nameRef}
                </Text>

                <Text
                    style={{
                        paddingBottom: hp(1),

                        paddingRight: wp(45),
                        textAlign: "right",
                        fontSize: 16,
                    }}>
                    מיועד ל:
                    {nameKids}.
                </Text>

                <Text
                    style={{
                        paddingBottom: hp(1),

                        paddingRight: wp(45),
                        textAlign: "right",
                    }}>
                    מנות: {quantityRef}
                </Text>
                <Text
                    style={{
                        paddingBottom: hp(1),

                        paddingRight: wp(45),
                        textAlign: "right",
                        fontSize: 16,
                        color: "#808080",
                    }}>
                    ₪ {priceRef.toFixed(2) * quantityRef}
                </Text>
            </View>
        </View>
    );
}
