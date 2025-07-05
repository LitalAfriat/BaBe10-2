import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Pressable,
    StyleSheet,
    Modal,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Octicons, Feather, Fontisto } from "@expo/vector-icons";
import Loading from "../Loading";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../../firebase/authContext";
import Checkbox from "expo-checkbox";
import TermsModal from "../../components/TermsModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCaptcha, setModalCaptcha] = useState(false);

    const fullNameRef = useRef("");
    const phoneNumberRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const passwordAuthenticationRef = useRef("");

    const [answer, setAnswer] = useState("");
    const [numbers, setNumbers] = useState({ num1: 0, num2: 0 });

    // Generate new numbers
    const generateNumbers = () => {
        setNumbers({
            num1: Math.floor(Math.random() * 10),
            num2: Math.floor(Math.random() * 10),
        });
        setAnswer("");
    };

    // Initialize on first render
    useEffect(() => {
        generateNumbers();
    }, []);

    const verify = () => {
        const userAnswer = parseInt(answer);
        const correctAnswer = numbers.num1 + numbers.num2;

        if (userAnswer === correctAnswer) {
            setModalCaptcha(!modalCaptcha);
            handleRegister();
        } else {
            setModalCaptcha(!modalCaptcha);
            Alert.alert("Wrong Answer");
        }
    };

    // const deviceWidth = Dimensions.get("window").width;
    // const deviceHeight =
    //     Platform.OS === "ios"
    //         ? Dimensions.get("window").height
    //         : require("react-native-extra-dimensions-android").get(
    //               "REAL_WINDOW_HEIGHT"
    //           );

    const showCaptcha = () => {
        if (
            !fullNameRef.current ||
            !phoneNumberRef.current ||
            !emailRef.current ||
            !passwordRef.current ||
            !passwordAuthenticationRef.current
        ) {
            Alert.alert("הרשמה", "נא למלא את כל השדות!");
            return;
        }
        if (passwordRef.current !== passwordAuthenticationRef.current) {
            alert("הסיסמאות אינן תואמות");
            return;
        }
        if (passwordRef.current.length < 6 || passwordRef.current.length > 10) {
            Alert.alert("הסיסמה חייבת להיות באורך של בין 6 ל-10 תווים.");
            return;
        }
        // Check for numeric character
        if (!/\d/.test(passwordRef.current)) {
            Alert.alert("הסיסמה חייבת להכיל לפחות תו מספרי אחד.");
            return;
        }
        // Check for special character
        // if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordRef.current)) {
        //     alert("הסיסמה חייבת להכיל לפחות תו מיוחד אחד.");
        //     return;
        // }
        // if (!/[A-Z]/.test(passwordRef.current)) {
        //     Alert.alert("הסיסמה חייבת להכיל לפחות אות אחת גדולה.");
        //     return;
        // }

        // Check the length
        if (fullNameRef.current.length < 2 || fullNameRef.current.length > 50) {
            Alert.alert(" שם מלא חייב להיות באורך של בין 2 ל-50 תווים ");
            return;
        }
        // Check for allowed characters
        const allowedCharacters = /^[a-zA-Z\s'-]+$/;
        if (!allowedCharacters.test(fullNameRef.current)) {
            Alert.alert(
                " שם מלא יכול להכיל רק אותיות, רווחים, מקפים, אפוסתרופים ונקודות"
            );
            return;
        }
        // Check for first and last name separated by a space
        const words = fullNameRef.current.split(" ");
        if (words.length < 2) {
            Alert.alert(
                " שם מלא חייב להכיל גם שם פרטי וגם שם משפחה מופרדים ברווח "
            );
            return;
        }
        // Check the length (for a US phone number)
        if (phoneNumberRef.current.length !== 10) {
            Alert.alert(" מספר הטלפון חייב להיות בן 10 ספרות");
            return false;
        }

        generateNumbers();
        setModalCaptcha(!modalCaptcha);
    };

    const handleRegister = async () => {
        setLoading(true);

        let response = await register(
            fullNameRef.current,
            phoneNumberRef.current,
            emailRef.current,
            passwordRef.current
        );

        setLoading(false);

        console.log("got result: ", response);
        if (!response.success) {
            Alert.alert("הרשמה", response.msg);
        }

        //Register process
    };

    return (
        <View
            style={{ transform: [{ translateY: -115 }] }}
            className='justify-center '>
            <View
                style={{ height: hp(7) }}
                className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                <Feather
                    name='user'
                    size={hp(2.5)}
                    color='gray'
                    style={{ transform: [{ translateX: 27 }] }}
                />
                <TextInput
                    onChangeText={(value) => (fullNameRef.current = value)}
                    style={{
                        fontSize: hp(2),
                        borderBottomWidth: 1,
                        borderBottomColor: "#FFFFFF",
                        paddingHorizontal: 10,
                    }}
                    className='flex-1 font-poppins text-neutral-700 text-right '
                    placeholder='שם מלא'
                    placeholderTextColor={"gray"}
                />
            </View>
            <View
                style={{ height: hp(7) }}
                className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                <Fontisto
                    name='mobile-alt'
                    size={hp(2.5)}
                    color='gray'
                    style={{
                        transform: [{ translateX: 27 }, { translateY: -4 }],
                    }}
                />

                <TextInput
                    onChangeText={(value) => (phoneNumberRef.current = value)}
                    style={{
                        fontSize: hp(2),
                        borderBottomWidth: 1,
                        borderBottomColor: "#FFFFFF",
                        paddingHorizontal: 10,
                    }}
                    className='flex-1 font-poppins text-neutral-700 text-right '
                    placeholder='מספר נייד'
                    placeholderTextColor={"gray"}
                />
            </View>

            <View
                style={{ height: hp(7) }}
                className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                <Octicons
                    name='mail'
                    size={hp(2.5)}
                    color='gray'
                    style={{ transform: [{ translateX: 27 }] }}
                />
                <TextInput
                    onChangeText={(value) => (emailRef.current = value)}
                    style={{
                        fontSize: hp(2),
                        borderBottomWidth: 1,
                        borderBottomColor: "#FFFFFF",
                        paddingHorizontal: 10,
                    }}
                    className='flex-1 font-poppins text-neutral-700 text-right '
                    placeholder='הכנס דוא”ל'
                    placeholderTextColor={"gray"}
                />
            </View>
            <View
                style={{ height: hp(7) }}
                className=' flex-row gap-3 px-2 items-center justify-center rounded-xl'>
                <Octicons
                    name='lock'
                    size={hp(2.5)}
                    color='gray'
                    style={{ transform: [{ translateX: 30 }] }}
                />
                <TextInput
                    onChangeText={(value) => (passwordRef.current = value)}
                    style={{
                        fontSize: hp(2),
                        borderBottomWidth: 1,
                        borderBottomColor: "#FFFFFF",
                        paddingHorizontal: 10,
                    }}
                    className='flex-1 font-poppins text-neutral-700 text-right '
                    placeholder='סיסמה'
                    secureTextEntry
                    placeholderTextColor={"gray"}
                />
            </View>

            <View
                style={{ height: hp(5) }}
                className=' justify-center flex-row gap-2 px-2 items-center rounded-xl '>
                <Octicons
                    name='lock'
                    size={hp(2.5)}
                    color='gray'
                    style={{
                        transform: [{ translateX: 30 }, { translateY: -1 }],
                    }}
                />
                <TextInput
                    onChangeText={(value) =>
                        (passwordAuthenticationRef.current = value)
                    }
                    style={{
                        fontSize: hp(2),
                        borderBottomWidth: 1,
                        borderBottomColor: "#FFFFFF",
                        paddingHorizontal: 10,
                    }}
                    className='flex-1 font-poppins text-neutral-700 text-right'
                    placeholder='אימות סיסמה'
                    secureTextEntry
                    placeholderTextColor={"gray"}
                />
            </View>

            <TermsModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            <View
                className='flex-row'
                style={{ marginRight: wp(-5), padding: 10 }}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text
                        style={{
                            paddingHorizontal: 8,
                            fontSize: hp(2),
                        }}
                        className=' text-neutral-700 '>
                        אני מאשר את{" "}
                        <Text
                            className=' text-neutral-700 bold underline underline-offset-1'
                            style={{ fontWeight: "bold" }}>
                            {" "}
                            תנאי השימוש.
                        </Text>
                    </Text>
                </Pressable>
                <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? "#61B331" : undefined}
                    style={{ height: hp(2.5), width: wp(5) }}
                />
            </View>

            {/* submit button */}

            <View
                style={{
                    alignItems: "center",
                    paddingTop: 20,
                    transform: [{ translateY: 10 }],
                }}>
                {loading ? (
                    <View className='flex-row justify-center'>
                        <Loading size={hp(19)} />
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={showCaptcha}
                        style={{
                            height: hp(6.5),
                            width: hp(30),
                            alignItems: "center",
                            backgroundColor: "#61B331",
                            borderRadius: 25,
                            justifyContent: "center",
                        }}>
                        <Text
                            style={{ fontSize: hp(2.7) }}
                            className='text-white font-bold tracking-wider rounded-xl justify-center items-center'>
                            הירשם
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalCaptcha}>
                <KeyboardAwareScrollView extraScrollHeight={120}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalView}>
                                What is {numbers.num1} + {numbers.num2}?
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={answer}
                                onChangeText={(text) => {
                                    setAnswer(text);
                                }}
                                keyboardType='numeric'
                                placeholder='Enter your answer'
                                maxLength={3}
                            />

                            <TouchableOpacity
                                style={[styles.verifyButton]}
                                onPress={verify}>
                                <Text style={styles.buttonText}>Verify</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={generateNumbers}>
                                <Text style={styles.refreshText}>
                                    ↻ New Question
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 15,
    },
    verifyButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    verifiedButton: {
        backgroundColor: "#34C759",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    refreshButton: {
        marginTop: 15,
        alignItems: "center",
    },
    refreshText: {
        color: "#007AFF",
        fontSize: 14,
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-start", // Change from "center" to "flex-start"
        alignItems: "center",
        marginTop: 200,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
});
