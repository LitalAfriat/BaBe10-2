import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Pressable,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ArrowBack from "../../../components/ArrowBack";
import Checkbox from "expo-checkbox";
import SchoolsList from "../../../components/kids/SchoolsList";
import { db, auth } from "../../../firebase/firebaseConfig";
import {
    getDocs,
    doc,
    collection,
    updateDoc,
    deleteDoc,
    arrayRemove,
} from "firebase/firestore";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import Loading from "../../../components/Loading";

export default function ChildUpdate() {
    let local = useLocalSearchParams();
    let childRef = JSON.parse(local?.childUpdate);

    const currentUser = auth.currentUser;

    const [nameRef, setNameRef] = useState("");
    const [lastNameRef, setLastNameRef] = useState("");
    const [classRef, setClassRef] = useState("");
    const [allergiesRef, setAllergiesRef] = useState("");
    const [schoolRef, setSchoolRef] = useState("");

    const [checked, setChecked] = useState(undefined);

    const [schoolList, setSchoolList] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (childRef[1].allergies) {
                setChecked(false); // Child has allergies
                setAllergiesRef(childRef[1].allergies); // Set the allergies
            } else {
                setChecked(true); // Child doesn't have allergies
                setAllergiesRef(""); // Clear the allergies
            }

            setNameRef(childRef[1].name);
            setLastNameRef(childRef[1].lastName);
            setClassRef(childRef[1].class);
            setAllergiesRef(childRef[1].allergies);
            setSchoolRef(childRef[1].school);
        }, [local?.childUpdate])
    );

    useEffect(() => {
        getSchool();
    }, []);

    const getSchool = async () => {
        // So, when this code is executed, it will retrieve all documents from the "sliders" collection in the Firestore database and log their IDs and data to the console.

        const querySnapshot = await getDocs(collection(db, "School"));

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            setSchoolList((schoolList) => [...schoolList, doc.data()]);
        });
    };

    const updateKid = async () => {
        if (
            !nameRef ||
            !lastNameRef ||
            !schoolRef ||
            !classRef ||
            (!allergiesRef && checked === false) ||
            checked == undefined
        ) {
            Alert.alert("פרטי הילד/ה", "נא למלא את כל השדות!");
            return;
        }

        if (currentUser.uid) {
            try {
                setLoading(true);
                await updateDoc(doc(db, "kids", childRef[0]), {
                    name: nameRef,
                    lastName: lastNameRef,
                    school: schoolRef,
                    class: classRef,
                    allergies: allergiesRef,
                    allergies: checked ? "" : allergiesRef,
                    hasAllergies: !checked,
                });

                console.log("Document added successfully");
                router.replace("/(tabs)/children/myChildren");
            } catch (error) {
                console.error("Error adding document: ", error);
            }
            setLoading(false);
        }
    };

    const deleteKid = async () => {
        if (currentUser.uid) {
            setLoading(true);
            try {
                let respond = await deleteDoc(doc(db, "kids", childRef[0]));

                console.log(respond);

                const userDocRef = doc(db, "users", currentUser.uid);

                let respond1 = await updateDoc(userDocRef, {
                    myKids: arrayRemove(childRef[0]),
                });

                console.log(respond1);

                console.log("Document delete successfully");
                router.replace("/(tabs)/children/myChildren");
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
            setLoading(false);
        }
    };

    const handleCheckboxChange = (value) => {
        setChecked(value);
        if (value === true) {
            setAllergiesRef("");
        }
    };

    return (
        <View style={{ flex: 1 }} className='bg-white'>
            <KeyboardAwareScrollView extraScrollHeight={5} style={{ flex: 1 }}>
                <StatusBar style='dark' />
                <ArrowBack backScreen={"/(tabs)/children/myChildren"} />

                <View
                    style={{
                        height: hp(95),
                    }}
                    className='flex-1 justify-center items-center z-10'>
                    <View
                        style={{
                            top: hp(2),
                            backgroundColor: "#EFF5ED",
                            borderRadius: 35,
                            height: 650,
                            width: 364,
                            shadowColor: "#727273",
                            shadowRadius: 4,
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 5 },
                        }}>
                        <View>
                            <Text
                                className='text-right p-6'
                                style={{
                                    fontSize: 26,
                                    color: "#61B331",
                                }}>
                                פרטי הילד/ה
                            </Text>
                        </View>

                        <View className='gap-10 px-7  '>
                            <View className='flex-row'>
                                <TextInput
                                    onChangeText={(value) => setNameRef(value)}
                                    style={{
                                        fontSize: hp(2),
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#FFFFFF",
                                        paddingHorizontal: 10,
                                    }}
                                    className='flex-1 font-poppins text-neutral-700 text-right '
                                    value={nameRef}
                                    placeholder='שם הילד/ה'
                                    placeholderTextColor={"gray"}
                                />
                            </View>

                            <View className=' flex-row '>
                                <TextInput
                                    onChangeText={(value) =>
                                        setLastNameRef(value)
                                    }
                                    style={{
                                        fontSize: hp(2),
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#FFFFFF",
                                        paddingHorizontal: 10,
                                    }}
                                    className='flex-1 font-poppins text-neutral-700 text-right '
                                    value={lastNameRef}
                                    placeholder='שם משפחה'
                                    placeholderTextColor={"gray"}
                                />
                            </View>

                            <View className='flex-row z-10 justify-end'>
                                <View className='absolute'>
                                    <SchoolsList
                                        schoolList={schoolList}
                                        setSelected={setSchoolRef}
                                        value={schoolRef}
                                    />
                                </View>
                            </View>

                            <View
                                className='flex-row'
                                style={{ marginTop: hp(7) }}>
                                <TextInput
                                    onChangeText={(value) => setClassRef(value)}
                                    style={{
                                        fontSize: hp(2),
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#FFFFFF",
                                        paddingHorizontal: 10,
                                    }}
                                    className='flex-1 font-poppins text-neutral-700 text-right pt-2'
                                    value={classRef}
                                    placeholder='כיתה'
                                    placeholderTextColor={"gray"}
                                />
                            </View>

                            <View>
                                <Text
                                    style={{ fontSize: hp(2) }}
                                    className='text-neutral-700  text-right'>
                                    האם יש{" "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        אלרגיה למזון?
                                    </Text>{" "}
                                    סמן לא/כן
                                </Text>
                                <View className='flex-row justify-end pt-4'>
                                    <View
                                        className='flex-row'
                                        style={{ marginRight: wp(10) }}>
                                        <Text
                                            style={{
                                                marginRight: hp(1),
                                                fontSize: hp(2),
                                            }}
                                            className=' text-neutral-700 '>
                                            כן יש.
                                        </Text>
                                        <Checkbox
                                            value={checked === false}
                                            onValueChange={() =>
                                                handleCheckboxChange(false)
                                            }
                                            color={
                                                checked === false
                                                    ? "#61B331"
                                                    : undefined
                                            }
                                        />
                                    </View>

                                    <View className=' flex-row mr-3'>
                                        <Text
                                            style={{
                                                marginRight: hp(1),
                                                fontSize: hp(2),
                                            }}
                                            className='text-neutral-700'>
                                            לא אין.
                                        </Text>
                                        <Checkbox
                                            value={checked === true}
                                            onValueChange={() =>
                                                handleCheckboxChange(true)
                                            }
                                            color={
                                                checked === true
                                                    ? "#61B331"
                                                    : undefined
                                            }
                                        />
                                    </View>
                                </View>
                                {checked === false ? (
                                    <>
                                        <Text
                                            style={{
                                                fontSize: hp(2),
                                                marginTop: hp(1),
                                            }}
                                            className='text-neutral-700 text-right'>
                                            יש לפרט את כלל אלרגני המזון
                                            הרלוונטים בשדה המבוקש:
                                        </Text>

                                        <View className=' flex-row top-4'>
                                            <TextInput
                                                onChangeText={(value) =>
                                                    setAllergiesRef(value)
                                                }
                                                style={{
                                                    fontSize: hp(2),
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                        "#FFFFFF",
                                                    paddingHorizontal: 10,
                                                }}
                                                className='flex-1  font-poppins text-neutral-700 text-right '
                                                placeholder='אלרגני מזון'
                                                placeholderTextColor={"gray"}
                                                value={allergiesRef}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </View>
                        </View>
                        {loading ? (
                            <View className='flex-row justify-center'>
                                <Loading size={hp(19)} />
                            </View>
                        ) : (
                            <View
                                style={{
                                    top: hp(58),
                                    // top: hp(5),
                                    // width: wp(50),

                                    height: hp(15),
                                }}
                                className='absolute self-center'>
                                <View className='absolute self-center'>
                                    <TouchableOpacity
                                        onPress={updateKid}
                                        style={{
                                            height: hp(5),
                                            width: wp(35),
                                            backgroundColor: "#61B331",
                                            borderRadius: 25,
                                            shadowColor: "#727273",
                                            shadowRadius: 4,
                                            shadowOpacity: 0.3,
                                            shadowOffset: {
                                                width: 0,
                                                height: 5,
                                            },
                                        }}>
                                        <Text
                                            style={{
                                                flex: 1,
                                                fontSize: hp(2.5),
                                                textAlign: "center",
                                            }}
                                            className='text-white rounded-xl p-2'>
                                            עדכן
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={deleteKid}
                                    style={{
                                        height: hp(5),
                                        width: wp(35),
                                        top: hp(6),
                                    }}>
                                    <Text
                                        style={{
                                            flex: 1,
                                            fontSize: hp(2.5),
                                            textAlign: "center",
                                        }}
                                        className=' text-blak underline  underline-offset-1 rounded-xl p-2'>
                                        מחק
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            // </View>
                        )}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
