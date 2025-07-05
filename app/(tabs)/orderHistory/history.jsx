import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ArrowBack from "../../../components/ArrowBack";
import { db, auth } from "../../../firebase/firebaseConfig";
import Loading from "../../../components/Loading";
import { router, useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
    getDocs,
    collection,
    getDoc,
    doc,
    query,
    where,
    documentId,
} from "firebase/firestore";

export default function history() {
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState("");
    const [total, setTotal] = useState(0);

    let numItems = 0;
    let totalPrice = 0;

    console.log(total);
    useFocusEffect(
        useCallback(() => {
            getOrders();
        }, [])
    );

    const getOrders = async () => {
        setLoading(true);
        const currentUser = auth.currentUser;

        try {
            // First, get the current user's document to retrieve the myOrder array
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const myOrders = userDocSnap.data().myOrders || [];

                if (myOrders.length > 0) {
                    // Only perform the query if myOrder is not empty
                    const ordersCollectionRef = collection(db, "orders");
                    const ordersQuerySnapshot = await getDocs(
                        query(
                            ordersCollectionRef,
                            where(documentId(), "in", myOrders)
                        )
                    );

                    setFetchedData(
                        ordersQuerySnapshot.docs.map((doc) => [
                            doc.id,
                            doc.data(),
                        ])
                    );
                    // Log the myOrder array

                    console.log(
                        "myOrder array:",
                        ordersQuerySnapshot.docs[0].data()
                    );
                } else {
                    // If myOrder is empty, set fetchedData to an empty array
                    console.log("User has no kids");
                    setFetchedData([]);
                }
            } else {
                console.log("No such user document!");
                setFetchedData([]);
            }
        } catch (error) {
            console.error("Error fetching kids:", error);
            setFetchedData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                alignContent: "center",
                alignItems: "center",
            }}>
            <StatusBar style='dark' />
            <ArrowBack backScreen={"/(tabs)/home"} />
            <Text
                style={{
                    textAlign: "right",
                    top: hp(12),
                    padding: 11,
                    fontSize: 26,
                    color: "#61B331",
                    left: wp(14),
                }}>
                היסטוריית הזמנות
            </Text>

            <View
                style={{
                    height: hp(65),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <FlatList
                    style={{
                        top: hp(15),
                        margin: -24,
                    }}
                    data={fetchedData}
                    vertical={true}
                    renderItem={({ item }) => {
                        // let sandwichQuantity = 0;
                        // let total1 = 0;

                        // console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
                        // item[1].orderInfo[0].kids.forEach((counter) => {
                        //     console.log(counter.quantity);

                        //     sandwichQuantity =
                        //         sandwichQuantity + counter.quantity;

                        //     total1 +=
                        //         counter.quantity * item[1].orderInfo[0].price;
                        // });
                        // console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

                        // console.log(sandwichQuantity);
                        // console.log(total1);
                        // console.log(item[1].orderInfo);

                        let sandwichQuantity = 0;
                        let total1 = 0;
                        console.log(item[1].orderInfo);
                        item[1].orderInfo.forEach((item) => {
                            item.kids.forEach((counter) => {
                                console.log(counter.quantity);
                                sandwichQuantity =
                                    sandwichQuantity + counter.quantity;
                                total1 += counter.quantity * item.price;
                            });
                            console.log(total1);
                        });

                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    router.replace({
                                        pathname:
                                            "/(tabs)/orderHistory/[order]",
                                        params: {
                                            order: JSON.stringify(item),
                                        },
                                    })
                                }>
                                <View
                                    class='justify-self-auto '
                                    style={{
                                        padding: 10,
                                        borderRadius: 20,
                                        height: hp(7),
                                        width: wp(78),
                                        backgroundColor: "#EFF5ED",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        marginBottom: 10,
                                    }}>
                                    <View
                                        style={{
                                            top: hp(2.5),
                                        }}>
                                        <Text>
                                            <AntDesign
                                                name='left'
                                                size={24}
                                                color='black'
                                            />
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: "right",
                                                fontSize: 16,
                                                marginBottom: 1,
                                                paddingRight: 5,
                                                top: hp(-1),
                                            }}>
                                            הזמנה
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingRight: 5,
                                            }}>
                                            <Text
                                                style={{
                                                    color: "#808080",
                                                    textAlign: "left",
                                                    top: hp(-1.1),
                                                    paddingLeft: wp(3),
                                                }}>
                                                {"      "} ₪{total1}
                                                {console
                                                    .log
                                                    // item[1].orderInfo[0].kids[0]
                                                    //     .quantity *
                                                    //     item[1].orderInfo[0]
                                                    //         .price
                                                    ()}
                                            </Text>

                                            <Text
                                                style={{
                                                    color: "#808080",
                                                    textAlign: "right",
                                                    top: hp(-1.1),
                                                    paddingLeft: wp(12),
                                                }}>
                                                {`${new Date(
                                                    item[1].timestamp
                                                ).getHours()}:${new Date(
                                                    item[1].timestamp
                                                ).getMinutes()}`}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: "#808080",
                                                    textAlign: "right",
                                                    top: hp(-1.1),
                                                }}>
                                                ,
                                                {`${new Date(
                                                    item[1].timestamp
                                                ).toLocaleDateString()}`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
}
