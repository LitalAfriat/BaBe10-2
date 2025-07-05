import {
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    FlatList,
    Dimensions,
    Platform,
    TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import ArrowBack from "../../../components/ArrowBack";
import React, { useState, useCallback, useEffect, useContext } from "react";
import HorizontalLine from "../../../components/HorizontalLine";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { db, auth } from "../../../firebase/firebaseConfig";
import {
    getDocs,
    collection,
    getDoc,
    doc,
    query,
    where,
    documentId,
} from "firebase/firestore";
import Modal from "react-native-modal";
import { CartContext } from "../../../components/cart/cartContext";

///////////////////////////////////////////////////////
export default function Sandwich() {
    let returnPage = "/(tabs)/home";
    let backScreen;

    const local = useLocalSearchParams();
    const sandwichRef = JSON.parse(local?.sandwich);

    const cart = useContext(CartContext);

    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight =
        Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get(
                  "REAL_WINDOW_HEIGHT"
              );

    const [checked, setChecked] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [fetchedData, setFetchedData] = useState("");
    const [pictureRef, setPictureRef] = useState(null);
    const [nameRef, setNameRef] = useState("");
    const [priceRef, setPriceRef] = useState(0);
    const [descriptionRef, setDescriptionRef] = useState("");
    const [ingredientsRef, setIngredientsRef] = useState([]);
    const [dishCounts, setDishCounts] = useState({});
    const [totalPrice, setTotalPrice] = useState({});

    useEffect(() => {
        if (local?.backScreen) {
            backScreen = JSON.parse(local?.backScreen);
        }
        if (backScreen === "menu") {
            returnPage = "/(tabs)/menu/menu";
        }
    }, []);

    useEffect(() => {
        let total = Object.values(dishCounts).reduce(
            (sum, count) => sum + count * priceRef,
            0
        );

        setTotalPrice(total.toFixed(2));
    }, [dishCounts]);

    // Round to two decimal places and convert to string with fixed decimal places

    useFocusEffect(
        useCallback(() => {
            setPictureRef(sandwichRef.picture);
            setNameRef(sandwichRef.name);
            setPriceRef(sandwichRef.price.toFixed(2));
            setTotalPrice(sandwichRef.total);
            setDescriptionRef(sandwichRef.description);
            setIngredientsRef(sandwichRef.ingredients);
            setChecked({});
            setLoading(true);
            setDishCounts({});
        }, [local?.sandwich])
    );

    useFocusEffect(
        useCallback(() => {
            getKids();
        }, [])
    );

    const toggleItem = (item) => {
        setChecked((prevState) => ({ ...prevState, [item]: !prevState[item] }));
    };

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

    const handleAddToCart = () => {
        let result;
        if (Object.keys(dishCounts).length) {
            result = fetchedData
                .filter(([id]) => dishCounts[id] > 0) // Filter out children with quantity 0
                .map(([id, info]) => ({
                    id,
                    ...info,
                    quantity: dishCounts[id],
                }));
        }
        console.log(sandwichRef.price);
        cart.addToCart({
            name: sandwichRef.name,
            price: sandwichRef.price,
            picture: sandwichRef.picture,
            unwantedIngredients: Object.keys(checked).map((element) =>
                element.trim()
            ),
            kids: result,
        });
        setModalVisible(!modalVisible);
        router.replace({
            pathname: `/(tabs)/menu/menu`,
        });
    };

    return (
        <View className='flex-1 bg-white'>
            <StatusBar style='dark' />
            <ArrowBack backScreen={returnPage} />

            <ScrollView>
                <View
                    className='justify-center items-center z-10'
                    style={{ marginTop: hp(10) }}>
                    <View style={{ alignItems: "center" }}>
                        <Image
                            source={{ uri: pictureRef }}
                            style={{
                                borderRadius: 25,
                                shadowColor: "#727273",
                                shadowRadius: 8,
                                shadowOpacity: 0.8,
                                shadowOffset: { width: 5, height: 5 },
                                height: hp(30),
                                width: wp(90),
                                top: hp(2),
                            }}
                        />
                    </View>
                    <View style={{ top: hp(3), padding: 9 }}>
                        <Text
                            style={{
                                textAlign: "right",
                                color: "#000000",
                                fontSize: 25,
                                top: 5,
                                padding: 7,
                            }}>
                            {nameRef}
                        </Text>
                        <Text
                            style={{
                                color: "#808080",
                                textAlign: "right",
                                fontSize: 22,
                                padding: 7,
                            }}>
                            ₪{priceRef}
                        </Text>
                        <Text
                            style={{
                                color: "black",
                                textAlign: "right",
                                alignItems: "center",
                                fontSize: 20,
                                padding: 7,
                            }}>
                            {descriptionRef}
                        </Text>
                        <View className='pb-6'>
                            <HorizontalLine />
                        </View>
                    </View>
                </View>

                <View className='mt-2' style={{ marginBottom: hp(6.5) }}>
                    <Text
                        style={{
                            color: "black",
                            textAlign: "right",
                            fontSize: hp(2.7),
                            paddingRight: wp(9),
                        }}
                        className='pb-4'>
                        בחרו שינויים
                    </Text>

                    {ingredientsRef.map((ingredient, index) => (
                        <View
                            className='flex flex-row-reverse'
                            key={index}
                            style={{
                                padding: 9,
                                paddingRight: wp(9),
                            }}>
                            <View>
                                <Checkbox
                                    style={{
                                        borderRadius: 50,
                                        width: 28,
                                        height: 28,
                                        borderWidth: 3.5,
                                    }}
                                    value={checked[ingredient]}
                                    onValueChange={() => {
                                        toggleItem(ingredient);
                                    }}
                                    color={"#61B331"}
                                />
                            </View>
                            <View>
                                <Text
                                    className='text-neutral-700 pr-4'
                                    style={{ fontSize: 20 }}>
                                    {"ללא " + ingredient + "."}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View className='absolute left-10' style={{ top: hp(82) }}>
                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true);
                    }}
                    style={{
                        height: hp(6),
                        width: wp(40),
                        backgroundColor: "#61B331",
                        borderRadius: 20,
                        shadowColor: "#727273",
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                    }}>
                    <Text
                        style={{
                            flex: 1,
                            fontSize: hp(2.5),
                            textAlign: "center",
                            margin: 5,
                        }}
                        className='text-white rounded-xl p-2 '>
                        הוסף
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={modalVisible}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                coverScreen={true}
                onBackdropPress={() => setModalVisible(false)}
                style={{ flex: 1, justifyContent: "flex-end", margin: 0 }}>
                <View
                    style={{
                        height: deviceHeight / 2,
                        borderRadius: 20,
                        backgroundColor: "white",
                    }}>
                    <Pressable
                        style={{
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                        }}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Image
                            style={{ width: 70, height: 70 }}
                            source={require("../../../assets/images/backX.png")}
                        />
                    </Pressable>

                    <Text
                        style={{
                            color: "#61B331",
                            fontSize: 26,
                            textAlign: "center",
                        }}>
                        בחר ילד/ה
                    </Text>

                    <View style={{ alignItems: "center", height: 230 }}>
                        <FlatList
                            data={fetchedData}
                            vertical={true}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={{ paddingRight: 8 }}
                            renderItem={({ item }) => (
                                <View
                                    className='flex justify-between'
                                    style={{
                                        margin: 8,
                                        marginTop: hp(2),
                                        height: hp(5),
                                        width: hp(35),
                                        backgroundColor: "#EFEFF0",
                                        borderRadius: 25,
                                        shadowColor: "#727273",
                                        shadowRadius: 4,
                                        shadowOpacity: 0.3,
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        flexDirection: "row",
                                        textAlign: "right",
                                        paddingTop: hp(1.5),
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            paddingLeft: wp(2),
                                            top: -2,
                                        }}>
                                        <Pressable
                                            onPress={() => {
                                                setDishCounts((prevCounts) => ({
                                                    ...prevCounts,
                                                    [item[0]]: Math.max(
                                                        0,
                                                        (prevCounts[item[0]] ||
                                                            0) - 1
                                                    ),
                                                }));
                                            }}
                                            style={{ marginRight: 15 }}>
                                            <AntDesign
                                                name='minuscircleo'
                                                size={24}
                                                color='#61B331'
                                            />
                                        </Pressable>
                                        <View>
                                            <Text style={{ paddingTop: 4 }}>
                                                {dishCounts[item[0]] || 0}
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={() => {
                                                setDishCounts((prevCounts) => ({
                                                    ...prevCounts,
                                                    [item[0]]:
                                                        (prevCounts[item[0]] ||
                                                            0) + 1,
                                                }));
                                            }}
                                            style={{ marginLeft: 15 }}>
                                            <AntDesign
                                                name='pluscircleo'
                                                size={24}
                                                color='#61B331'
                                            />
                                        </Pressable>
                                    </View>

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
                                </View>
                            )}
                        />
                    </View>
                    <View
                        style={{
                            bottom: hp(6),
                            paddingLeft: wp(12),
                            flexDirection: "row",
                            position: "absolute",
                        }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    handleAddToCart();
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
                                    top: hp(1.5),
                                }}>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: hp(2.5),
                                        textAlign: "center",
                                        margin: 5,
                                    }}
                                    className='text-white rounded-xl p-2 '>
                                    הוסף לסל
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{ paddingTop: hp(3), paddingLeft: wp(17) }}>
                            <Text style={{ fontSize: 20, color: "#61B331" }}>
                                ₪{totalPrice}{" "}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
