import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    Pressable,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CartContext } from "../../components/cart/cartContext";
import { router } from "expo-router";
import SelectedSandwiches from "../../components/cart/SelectedSandwiches";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

export default function MyBasket() {
    const [text, onChangeText] = useState("");
    const [basketQuantity, setBasketQuantity] = useState(0);
    const [total, setTotal] = useState(0);
    const [modal, setModal] = useState(false);

    const cart = useContext(CartContext);
    let showCart = cart.getCart();

    const registerOrder = async () => {
        const currentUser = auth.currentUser;
        if (currentUser.uid) {
            try {
                const ts = new Date().getTime();
                let docRef = await addDoc(collection(db, "orders"), {
                    timestamp: ts,
                    orderInfo: showCart,
                });

                const collectionRef = doc(db, "users", currentUser.uid);

                await updateDoc(collectionRef, {
                    myOrders: arrayUnion(docRef.id),
                });

                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            cart.cleanCart();
            router.replace("/(tabs)/home");
        }
    };

    useEffect(() => {
        let numItems = 0;
        let totalPrice = 0;
        showCart.forEach((itemSandwich) => {
            itemSandwich.kids.forEach((itemKid) => {
                numItems += itemKid.quantity;
                totalPrice += itemKid.quantity * itemSandwich.price;
            });
        });
        console.log(totalPrice);

        setBasketQuantity(numItems);
        setTotal(totalPrice);
    }, [showCart]);

    return (
        <KeyboardAwareScrollView
            extraScrollHeight={120}
            style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar style='dark' />

            <Text
                style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "right",
                    justifyContent: "right",
                    paddingTop: hp(8),
                    paddingRight: wp(8),
                    paddingBottom: hp(2),
                }}>
                {basketQuantity} פריטים בסל
            </Text>

            <View className='flex flex-nowrap '>
                {showCart.length ? (
                    <View className='flex justify-center'>
                        <FlatList
                            scrollEnabled={false}
                            data={showCart}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        paddingBottom: hp(5),
                                    }}>
                                    <SelectedSandwiches
                                        nameRef={item.name}
                                        pictureRef={item.picture}
                                        priceRef={item.price}
                                        quantityRef={(() => {
                                            let sum = 0;
                                            item.kids.forEach((kid) => {
                                                sum += kid.quantity;
                                            });
                                            return sum;
                                        })()}
                                        nameKids={(() => {
                                            let nK = "";
                                            item.kids.forEach((kid) => {
                                                nK += kid.name + ",";
                                            });
                                            return nK;
                                        })()}
                                        item={item}
                                    />
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            textAlign: "right",
                        }}>
                        עגלה ריקה
                    </Text>
                )}
            </View>

            <View
                style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}>
                <Text
                    style={{
                        left: wp(25),
                        textAlign: "right",
                        fontSize: 16,
                        paddingBottom: 2,
                    }}>
                    הערות ההזמנה:
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        // padding: 8,
                        borderRadius: 20,
                        height: hp(12),
                        width: wp(80),
                        borderColor: "#E3E1F0",
                        backgroundColor: "#EFF5ED",
                        textAlign: "right",
                        padding: 8,
                    }}
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={180}
                    onChangeText={onChangeText}
                    value={text}
                />
            </View>

            <View
                style={{
                    marginRight: wp(9),
                    marginTop: hp(2),
                }}>
                <Text
                    style={{
                        textAlign: "right",
                        fontSize: 26,
                        color: "#61B331",
                    }}>
                    {""} סה”כ: {total} {""}₪
                </Text>
            </View>
            <View
                style={{
                    alignItems: "center",
                }}>
                <TouchableOpacity
                    onPress={() => {
                        setModal(true);

                        registerOrder();
                    }}
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
                        top: hp(2),
                    }}>
                    <Text
                        style={{
                            flex: 1,
                            fontSize: hp(2.5),
                            textAlign: "center",
                            margin: 5,
                        }}
                        className='text-white rounded-xl p-2'>
                        לתשלום
                    </Text>
                </TouchableOpacity>

                <Modal animationType='fade' transparent={true} visible={modal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modal}>
                            <Text style={styles.modalText}>
                                ההזמנה יצאה לדרך!
                            </Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModal(!modal)}>
                                <Text style={styles.textStyle}>אישור</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity
                    // onPress={() => setModal(true)}
                    onPress={() => router.replace("menu/menu")}
                    style={{
                        top: hp(3),
                    }}>
                    <Text
                        style={{
                            flex: 1,
                            fontSize: hp(2.5),
                            textAlign: "center",
                            margin: 5,
                        }}
                        className='text-blake rounded-xl p-6 underline underline-offset-1 '>
                        חזרה לתפריט
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modal: {
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
        fontSize: 25,
    },
});
