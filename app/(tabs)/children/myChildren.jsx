import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ArrowBack from "../../../components/ArrowBack";
import {
    getDocs,
    collection,
    getDoc,
    doc,
    query,
    where,
    documentId,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import Loading from "../../../components/Loading";

export default function MyChildren() {
    const [loading, setLoading] = useState(false);
    let [fetchedData, setFetchedData] = useState("");

    useFocusEffect(
        useCallback(() => {
            getKids();
        }, [])
    );

    const getKids = async () => {
        setLoading(true);
        const currentUser = auth.currentUser;

        try {
            // First, get the current user's document to retrieve the myKids array
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const myKids = userDocSnap.data().myKids || [];

                if (myKids.length > 0) {
                    // Only perform the query if myKids is not empty
                    const kidsCollectionRef = collection(db, "kids");
                    const kidsQuerySnapshot = await getDocs(
                        query(
                            kidsCollectionRef,
                            where(documentId(), "in", myKids)
                        )
                    );

                    setFetchedData(
                        kidsQuerySnapshot.docs.map((doc) => [
                            doc.id,
                            doc.data(),
                        ])
                    );
                    // Log the myKids array

                    console.log("myKids array:", kidsQuerySnapshot);
                } else {
                    // If myKids is empty, set fetchedData to an empty array
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
        <View className=' flex-1 bg-white'>
            <StatusBar style='dark' />
            <ArrowBack backScreen={"/(tabs)/home"} />

            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    top: 50,
                }}>
                <View className='flex-row'>
                    <View>
                        <Image
                            style={{
                                borderRadius: 20,
                                height: 150,
                                width: 150,
                                top: hp(0.5),
                                left: wp(15),
                            }}
                            source={require("../../../assets/images/myKids.png")}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 26,
                                padding: 8,
                                color: "#61B331",
                                textAlign: "right",
                                top: 100,
                                right: -44,
                            }}>
                            הילדים שלי
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "#EFF5ED",
                        borderRadius: 35,
                        height: 524,
                        width: 364,
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <View style={{ padding: 30, alignItems: "flex-end" }}>
                        <TouchableOpacity
                            className='border-x-2 border border-slate-200'
                            onPress={() =>
                                router.replace(`/(tabs)/children/addChild`)
                            }
                            style={{
                                height: hp(4),
                                width: hp(24),
                                backgroundColor: "#61B331",
                                borderRadius: 25,
                                justifyContent: "center",
                                paddingRight: 30,
                                shadowColor: "#727273",
                                shadowRadius: 4,
                                shadowOpacity: 0.3,
                                shadowOffset: { width: 0, height: 5 },
                            }}>
                            <Text
                                style={{
                                    fontSize: hp(2.4),
                                }}
                                className='text-white text-right'>
                                הוסף ילד/ה +
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View className='flex-row justify-center'>
                            <Loading size={hp(19)} />
                        </View>
                    ) : (
                        <View
                            className='flex justify-center '
                            style={{
                                height: hp(45),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <FlatList
                                style={{ margin: -24 }}
                                data={fetchedData}
                                vertical={true}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{
                                            marginRight: 15,
                                            margin: 8,
                                            height: hp(5),
                                            width: hp(35),
                                            backgroundColor: "#FAFEF5",
                                            borderRadius: 25,
                                            shadowColor: "#727273",
                                            shadowRadius: 4,
                                            shadowOpacity: 0.3,
                                            shadowOffset: {
                                                width: 0,
                                                height: 5,
                                            },
                                            justifyContent: "center",
                                        }}
                                        onPress={() =>
                                            router.replace(
                                                `/(tabs)/children/${JSON.stringify(
                                                    item
                                                )}`
                                            )
                                        }>
                                        <View>
                                            <Text
                                                style={{
                                                    textAlign: "right",
                                                    paddingRight: 30,
                                                    fontSize: hp(1.8),
                                                }}>
                                                {item[1]?.name +
                                                    " " +
                                                    item[1]?.lastName}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
