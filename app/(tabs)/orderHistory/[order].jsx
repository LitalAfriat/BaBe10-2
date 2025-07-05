import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ArrowBack from "../../../components/ArrowBack";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import HorizontalLine from "../../../components/HorizontalLine";

export default function Order() {
    let returnPage = "/(tabs)/orderHistory/history";
    let backScreen;

    const local = useLocalSearchParams();
    const orderRef = JSON.parse(local?.order);

    const [sumRef, setSumRef] = useState(0);
    const [nameRef, setNameRef] = useState("");
    const [priceRef, setPriceRef] = useState(0);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (local?.backScreen) {
            backScreen = JSON.parse(local?.backScreen);
        }
        if (backScreen === "history") {
            returnPage = "/(tabs)/orderHistory/history/";
        }
    }, []);

    useEffect(() => {
        let sandwichQuantity = 0;
        let total1 = 0;
        console.log(orderRef[1].orderInfo);
        orderRef[1].orderInfo.forEach((item) => {
            item.kids.forEach((counter) => {
                console.log(counter.quantity);
                sandwichQuantity = sandwichQuantity + counter.quantity;
                total1 += counter.quantity * item.price;
            });
            console.log(total1);
            setTotal(total1);
        });
    }, [orderRef]);

    useEffect(() => {
        setNameRef(orderRef.name);
        setPriceRef(orderRef.price);
    }, [orderRef]);

    useFocusEffect(
        useCallback(() => {
            setNameRef(orderRef.name);
            setPriceRef(orderRef.price);
            setTotal(orderRef.total1);
        }, [local?.order])
    );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#EFF5ED",
                alignContent: "right",
                alignItems: "right",
                padding: 15,
            }}>
            <StatusBar style='dark' />
            <ArrowBack backScreen={returnPage} />
            <ScrollView>
                <Text
                    style={{
                        textAlign: "right",
                        top: hp(12),
                        fontSize: 30,
                        color: "black",
                        // left: wp(34),
                        padding: 15,
                    }}>
                    הזמנה
                </Text>
                <Text
                    style={{
                        textAlign: "right",
                        top: hp(14),
                        right: wp(2),
                        fontSize: 22,
                        color: "#808080",
                    }}>
                    {`${new Date(orderRef[1].timestamp)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(
                        new Date(orderRef[1].timestamp).getMonth() + 1
                    )
                        .toString()
                        .padStart(2, "0")}/${new Date(orderRef[1].timestamp)
                        .getFullYear()
                        .toString()
                        .padStart(2, "0")}`}
                    ,{"    "} ב-
                    {`${new Date(orderRef[1].timestamp).getHours()}:${new Date(
                        orderRef[1].timestamp
                    )
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                </Text>
                <View
                    class='justify-self-auto '
                    style={{
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 20,
                        // height: hp(105),
                        // width: wp(84),
                        // backgroundColor: "#EFF5ED",
                        top: hp(15),
                        alignContent: "center",
                    }}>
                    <Text
                        style={{
                            textAlign: "right",

                            fontSize: 22,
                            color: "#3C2F2F",
                        }}>
                        פריטים שהזמנת:
                    </Text>
                    <View className='flex flex-nowrap justify-center'>
                        <FlatList
                            scrollEnabled={false}
                            data={orderRef[1].orderInfo}
                            vertical={true}
                            renderItem={({ item }) => {
                                let sandwichQuantity = 0;
                                let total1 = 0;
                                let kid1 = "";

                                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
                                item.kids.forEach((counter) => {
                                    console.log(counter.quantity);

                                    console.log("++++++++");

                                    console.log(counter.name);
                                    kid1 += counter.name + ", " + "";

                                    console.log(kid1);

                                    sandwichQuantity =
                                        sandwichQuantity + counter.quantity;
                                    total1 += counter.quantity * item.price;
                                });
                                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

                                console.log(total1);

                                return (
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: "right",

                                                fontSize: 22,
                                                color: "#3C2F2F",
                                            }}>
                                            {item.name}
                                            {/* {console.log(item)} */}
                                        </Text>
                                        <Text
                                            style={{
                                                textAlign: "right",

                                                fontSize: 20,
                                                color: "#808080",
                                            }}>
                                            {" "}
                                            ללא{" "}
                                            {item.unwantedIngredients +
                                                ", " +
                                                ""}
                                        </Text>
                                        <Text
                                            style={{
                                                textAlign: "right",

                                                fontSize: 22,
                                                color: "#3C2F2F",
                                            }}>
                                            {sandwichQuantity} x ₪{item.price}
                                        </Text>

                                        <Text
                                            style={{
                                                textAlign: "right",

                                                fontSize: 22,
                                                color: "#3C2F2F",
                                            }}>
                                            שם הילד/ה:{" "}
                                            {/* {orderRef[1].orderInfo[0].kids[0].name} */}
                                            {kid1}{" "}
                                        </Text>
                                        <Text
                                            style={{
                                                textAlign: "right",

                                                fontSize: 22,
                                                color: "#3C2F2F",
                                            }}>
                                            מסירה:{" "}
                                            {
                                                orderRef[1].orderInfo[0].kids[0]
                                                    .school
                                            }
                                        </Text>
                                        <HorizontalLine />
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                textAlign: "right",
                                fontWeight: "bold",
                                // bottom: hp(5),

                                fontSize: 22,
                                color: "#3C2F2F",
                            }}>
                            סה”כ {"  "}₪{total}
                        </Text>
                        <Text
                            style={{
                                textAlign: "right",
                                fontWeight: "bold",

                                fontSize: 22,
                                color: "#3C2F2F",
                            }}>
                            פרטי תשלום
                        </Text>
                        <Text
                            style={{
                                textAlign: "right",

                                fontSize: 22,
                                color: "#3C2F2F",
                            }}>
                            כרטיס אשראי{" "}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        alignItems: "center",
                        marginBottom: hp(26),
                    }}>
                    <TouchableOpacity
                        // onPress={() => setModalVisible(true)}
                        style={{
                            height: hp(6),
                            width: wp(40),
                            backgroundColor: "#3C2F2F",
                            borderRadius: 20,
                            shadowColor: "#727273",
                            shadowRadius: 4,
                            shadowOpacity: 0.3,
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            top: hp(18),
                        }}>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: hp(2.5),
                                textAlign: "center",
                                margin: 5,
                            }}
                            className='text-white rounded-xl p-2 '>
                            להזמין שוב
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
