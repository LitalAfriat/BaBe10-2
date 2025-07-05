import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
    addDoc,
    collection,
    updateDoc,
    doc,
    arrayUnion,
    getDoc,
} from "firebase/firestore";
import { router } from "expo-router";
import Loading from "../../../components/Loading";

export default function AddChild() {
    const [nameRef, setNameRef] = useState("");
    const [lastNameRef, setLastNameRef] = useState("");
    const [classRef, setClassRef] = useState("");
    const [allergiesRef, setAllergiesRef] = useState("");
    const [schoolRef, setSchoolRef] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [checked, setChecked] = useState(undefined);

    const [loading, setLoading] = useState(false);

    const resetForm = useCallback(() => {
        setNameRef("");
        setLastNameRef("");
        setClassRef("");
        setAllergiesRef("");
        setSchoolRef("");
        setChecked(undefined);
    }, []);

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

    const registerKid = async () => {
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

        // Check the length
        if (
            (nameRef.length && lastNameRef.length < 2) ||
            (nameRef.length && lastNameRef.length > 15)
        ) {
            Alert.alert(" שם מלא חייב להיות באורך של בין 2 ל-15 תווים ");
            return;
        }

        // TODO: LITAL FIX THIS
        // Check for allowed characters
        // const allowedCharacters = /^[a-zA-Z\s'-]+$/;
        // if (!allowedCharacters.test(nameRef.current && lastNameRef)) {
        //     Alert.alert(
        //         " שם/שם משפחה  יכול להכיל רק אותיות ,רווחים ונקודות"
        //     );
        //     return;
        // }

        const currentUser = auth.currentUser;
        if (currentUser.uid) {
            try {
                setLoading(true);
                // --------------------------------------------------------------------
                let newKidRef = collection(db, "kids");

                let respond = await addDoc(newKidRef, {
                    name: nameRef,
                    lastName: lastNameRef,
                    school: schoolRef,
                    class: classRef,
                    allergies: allergiesRef,
                });
                // --------------------------------------------------------------------
                const collectionRef = doc(db, "users", currentUser.uid);

                await updateDoc(collectionRef, {
                    myKids: arrayUnion(respond.id),
                });

                // --------------------------------------------------------------------

                setLoading(false);
                console.log("Document added successfully");
                resetForm();
                router.replace("/(tabs)/children/myChildren");
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }

        // const currentMyKids = auth.currentUser;
        // if (currentMyKids.uid) {
        //     try {
        //         let newKidRef = doc(
        //             collection(db, "users", currentUser.uid, "MyKids")
        //         );
        //         setLoading(true);
        //         await setDoc(newKidRef, {
        //            key: currentKid.uid,

        //         });
        //         setLoading(false);
        //         console.log("Document added successfully");
        //         resetForm();
        //         router.replace("/(tabs)/children/myChildren");
        //     } catch (error) {
        //         console.error("Error adding document: ", error);
        //     }
        // }
    };

    const handleCheckboxChange = (value) => {
        setChecked(value);
        if (value === true) setAllergiesRef("");
    };

    return (
        <View style={{ flex: 1 }} className='bg-white'>
            <KeyboardAwareScrollView
                extraScrollHeight={120}
                style={{ flex: 1 }}>
                <StatusBar style='dark' />
                <ArrowBack backScreen={"/(tabs)/children/myChildren"} />

                <View
                    style={{
                        height: hp(90),
                    }}
                    className='flex-1 justify-center items-center z-10'>
                    <Image
                        style={{
                            position: "absolute",
                            height: hp(60),
                            width: wp(100),
                            top: hp(-18),
                        }}
                        source={require("../../../assets/images/childsDetails.png")}
                    />

                    <View
                        style={{
                            top: hp(8),
                            backgroundColor: "#EFF5ED",
                            borderRadius: 35,
                            height: 600,
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

                        <View
                            className='gap-10 px-7  '
                            style={{
                                borderWidth: 2, // Sets thickness
                                borderColor: "#FF0000",
                            }}>
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
                                    placeholder='שם הילד/ה'
                                    placeholderTextColor={"gray"}
                                    value={nameRef}
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
                                    placeholder='שם משפחה'
                                    placeholderTextColor={"gray"}
                                    value={lastNameRef}
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
                                    placeholder='כיתה'
                                    placeholderTextColor={"gray"}
                                    value={classRef}
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
                                    top: checked === false ? hp(57) : hp(48),
                                }}
                                className='absolute left-10'>
                                <TouchableOpacity
                                    onPress={registerKid}
                                    style={{
                                        // top:
                                        //     checked === false ? hp(57) : hp(48),
                                        height: hp(5),
                                        width: wp(35),
                                        backgroundColor: "#61B331",
                                        borderRadius: 25,
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
                                        }}
                                        className='text-white rounded-xl p-2'>
                                        הוסף
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
