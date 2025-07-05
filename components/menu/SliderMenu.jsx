import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Loading from "../Loading";

export default function SliderMenu({ sandwichList }) {
    // Pair up the items for two rows
    const pairedData = sandwichList.reduce((result, item, index) => {
        if (index % 2 === 0) {
            result.push([item, sandwichList[index + 1]]);
        }
        return result;
    }, []);

    return (
        <View>
            <FlatList
                data={pairedData}
                inverted={true}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={({ item }) => (
                    <View>
                        {item[0] && (
                            <TouchableOpacity
                                onPress={() =>
                                    router.replace({
                                        pathname: "/(tabs)/menu/[sandwich]",
                                        params: {
                                            sandwich: JSON.stringify(item[0]),
                                            backScreen: JSON.stringify("menu"),
                                        },
                                    })
                                }
                                style={{
                                    alignItems: "center",
                                    margin: 9,
                                    borderRadius: 20,
                                    height: 190,
                                    width: 160,
                                    backgroundColor: "#EFF5ED",
                                    shadowColor: "#727273",
                                    shadowRadius: 2,
                                    shadowOpacity: 0.3,
                                    shadowOffset: {
                                        width: 0,
                                        height: 5,
                                    },
                                }}>
                                <Image
                                    source={{ uri: item[0]?.picture }}
                                    style={{
                                        height: 150,
                                        width: 160,
                                        borderRadius: 25,
                                        shadowColor: "#727273",
                                        shadowRadius: 8,
                                        shadowOpacity: 0.8,
                                        shadowOffset: {
                                            width: 5,
                                            height: 5,
                                        },
                                    }}
                                />

                                <View>
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            paddingVertical: 2,
                                        }}>
                                        {item[0].name || ""}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#858585",
                                            textAlign: "center",
                                            padding: -3,
                                        }}>
                                        ₪{item[0]?.price.toFixed(2) || ""}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {item[1] && (
                            <TouchableOpacity
                                onPress={() =>
                                    router.replace({
                                        pathname: "/(tabs)/menu/[sandwich]",
                                        params: {
                                            sandwich: JSON.stringify(item[1]),
                                        },
                                    })
                                }
                                style={{
                                    alignItems: "center",
                                    margin: 9,
                                    borderRadius: 20,
                                    height: 190,
                                    width: 160,
                                    backgroundColor: "#EFF5ED",
                                    shadowColor: "#727273",
                                    shadowRadius: 2,
                                    shadowOpacity: 0.3,
                                    shadowOffset: {
                                        width: 0,
                                        height: 5,
                                    },
                                }}>
                                <Image
                                    source={{ uri: item[1]?.picture }}
                                    style={{
                                        height: 150,
                                        width: 160,
                                        borderRadius: 25,
                                        shadowColor: "#727273",
                                        shadowRadius: 8,
                                        shadowOpacity: 0.8,
                                        shadowOffset: {
                                            width: 5,
                                            height: 5,
                                        },
                                    }}
                                />
                                <View>
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            paddingVertical: 2,
                                        }}>
                                        {item[1].name || ""}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#858585",
                                            textAlign: "center",
                                            padding: -3,
                                        }}>
                                        ₪{item[1]?.price.toFixed(2) || ""}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
}
