import React, { useContext, useEffect, useState } from "react";
import {
    Ionicons,
    FontAwesome,
    Entypo,
    MaterialIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import {
    CartContextProvider,
    CartContext,
} from "../../components/cart/cartContext";
import { View, Text } from "react-native";

export default function TabLayout() {
    const [basketQuantity, setBasketQuantity] = useState(0);

    return (
        <CartContextProvider>
            <Tabs
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: "#61B331",
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name='home'
                    options={{
                        title: "ראשי",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name='home' size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='menu/menu'
                    options={{
                        title: "תפריט",
                        tabBarIcon: ({ color, size }) => (
                            // <Ionicons name='search' size={size} color={color} />
                            <MaterialIcons
                                name='menu-book'
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name='myBasket'
                    options={{
                        title: "הסל שלי",
                        tabBarIcon: ({ color, size }) => {
                            //  <Ionicons name='cart' size={size} color={color} />
                            const cart = useContext(CartContext);
                            let showCart = cart.getCart();

                            useEffect(() => {
                                setBasketQuantity(cart.getNumItems());
                            }, [showCart]);

                            return (
                                <View style={{ position: "relative" }}>
                                    <Entypo
                                        name='shopping-basket'
                                        size={size}
                                        color={color}
                                    />
                                    {basketQuantity == 0 ? (
                                        <></>
                                    ) : (
                                        <View
                                            style={{
                                                height: 14,
                                                width: 14,
                                                borderRadius: 7,
                                                backgroundColor: color,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                position: "absolute",
                                                top: -6,
                                                fontWeight: "500",
                                                // right: -8,
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: "white",
                                                }}>
                                                {" "}
                                                {basketQuantity}{" "}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        },
                    }}
                />
                <Tabs.Screen
                    name='userDashboard'
                    options={{
                        title: "אזור אישי",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome
                                name='user'
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='children/myChildren'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='children/addChild'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='children/[childUpdate]'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='user/userUpdate'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='menu/[sandwich]'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='orderHistory/history'
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name='orderHistory/[order]'
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
        </CartContextProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "white",
        borderBlockColor: "white",
    },
});
