import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Pressable,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

export default function Categories() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View
            className='flex flex-row justify-center '
            style={{ marginTop: 70 }}>
            <TouchableOpacity
                onPress={() =>
                    router.replace({
                        pathname: `/(tabs)/menu/menu`,
                        params: { source: "search" },
                    })
                }>
                <View
                    style={{
                        alignItems: "center",
                        textAlign: "center",
                        margin: 7,
                        borderRadius: 20,
                        height: 75,
                        width: 75,
                        backgroundColor: "#EFF5ED",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <Image
                        className='size-26	'
                        style={{
                            borderRadius: 20,
                            height: 110,
                            width: 110,
                            alignItems: "center",
                            top: -10,
                        }}
                        source={require("../../assets/images/search.png")}
                    />
                </View>
                <Text style={{ color: "#858585", textAlign: "center" }}>
                    חיפוש
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace(`/(tabs)/children/myChildren`)}>
                <View
                    style={{
                        alignItems: "center",
                        textAlign: "center",
                        margin: 7,
                        borderRadius: 20,
                        height: 75,
                        width: 75,
                        backgroundColor: "#EFF5ED",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <Image
                        style={{
                            borderRadius: 20,
                            height: 110,
                            width: 110,
                            top: -10,
                        }}
                        source={require("../../assets/images/children.png")}
                    />
                </View>
                <Text style={{ color: "#858585", textAlign: "center" }}>
                    הילדים שלי
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace(`/(tabs)/orderHistory/history`)}>
                <View
                    style={{
                        alignItems: "center",
                        textAlign: "center",
                        margin: 7,
                        borderRadius: 20,
                        height: 75,
                        width: 75,
                        backgroundColor: "#EFF5ED",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <Image
                        style={{
                            borderRadius: 20,
                            height: 110,
                            width: 110,
                            top: -10,
                        }}
                        source={require("../../assets/images/my_orders.png")}
                    />
                </View>
                <Text style={{ color: "#858585", textAlign: "center" }}>
                    {" "}
                    היסטורית
                </Text>
                <Text style={{ color: "#858585", textAlign: "center" }}>
                    הזמנות
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View
                    style={{
                        alignItems: "center",
                        textAlign: "center",
                        margin: 7,
                        borderRadius: 20,
                        height: 75,
                        width: 75,
                        backgroundColor: "#EFF5ED",
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <Image
                        style={{
                            borderRadius: 20,
                            height: 100,
                            width: 100,
                        }}
                        source={require("../../assets/images/birthdays.png")}
                    />
                </View>
                <Text style={{ color: "#858585", textAlign: "center" }}>
                    ימי הולדת
                </Text>
            </TouchableOpacity>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>בקרוב!</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>אישור</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 65,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 20,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#61B331",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 40,
    },
});
