import { StatusBar } from "expo-status-bar";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Categories from "../../components/home/Categories";
import News from "../../components/home/News";
import Slider from "../../components/home/popularSandwiches";
import { db } from "../../firebase/firebaseConfig";

export default function Home() {
    const [sliderList, setSliderList] = useState([]);
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        getNews();
        getSliders();
    }, []);

    const getNews = async () => {
        const querySnapshot = await getDocs(collection(db, "News"));

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setNewsList((newsList) => [...newsList, doc.data()]);
        });
    };

    // Used to Get Sliders for Home Screen

    const getSliders = async () => {
        // So, when this code is executed, it will retrieve all documents from the "sliders" collection in the Firestore database and log their IDs and data to the console.

        const querySnapshot = await getDocs(collection(db, "menu"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            setSliderList((sliderList) => [...sliderList, doc.data()]);
        });
    };

    return (
        <View className=" py-8 px-6  bg-white flex-1 ">
            <StatusBar style="dark" />
            <View>
                <Categories />
            </View>

            <View
                className="itame-center  justify-centerr  py-8 flex-1 
"
                style={{ top: -20 }}
            >
                <Text
                    className="font-semibold"
                    style={{
                        textAlign: "right",
                        color: "#000000",
                        fontSize: 20,
                        top: 25,
                    }}
                >
                    הודעות
                </Text>

                <News newsList={newsList} />
            </View>

            <View
                className="itame-center  justify-centerr py-8 flex-1  "
                style={{ top: 2 }}
            >
                <Text
                    className="font-semibold	"
                    style={{
                        color: "#000000",
                        textAlign: "right",
                        alignItems: "center",
                        fontSize: 20,
                        textBold: 5,
                    }}
                >
                    הפופולריים
                </Text>
                {/* Slider */}
                <View style={{ marginTop: -15 }}>
                    <Slider sliderList={sliderList} />
                </View>
            </View>
        </View>
    );
}
