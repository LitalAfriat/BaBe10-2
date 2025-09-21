import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LoadingPage from "../../../components/LoadingPage";
import Search from "../../../components/menu/Search";
import SliderFilter from "../../../components/menu/SliderFilter";
import SliderMenu from "../../../components/menu/SliderMenu";
import { app } from "../../../firebase/firebaseConfig";

export default function Menu() {
    const { source } = useLocalSearchParams();

    const db = getFirestore(app);
    const [loading, setLoading] = useState(true);
    const [sandwichList, setSandwichList] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedTag, setSelectedTag] = useState("הכל");
    const allSandwiches = useRef([]);

    const focusRef = useRef(null);

    const focusSearch = () => {
        if (source === "search" && focusRef.current) {
            focusRef.current.focus();
        }
    };
    focusSearch();

    function applyFilters({ search: value, tags: tags }) {
        if (tags === "הכל") {
            if (value !== "") {
                setSandwichList(
                    allSandwiches.current.filter((sandwich) =>
                        sandwich.name.includes(value)
                    )
                );
            } else {
                setSandwichList(allSandwiches.current);
            }
        } else {
            const sandwichByTag = allSandwiches.current.filter((sandwich) =>
                sandwich.tags.includes(tags)
            );
            if (value !== "") {
                setSandwichList(
                    sandwichByTag.filter((sandwich) =>
                        sandwich.name.includes(value)
                    )
                );
            } else {
                setSandwichList(sandwichByTag);
            }
        }
    }

    useEffect(() => {
        applyFilters({ search: searchValue, tags: selectedTag });
    }, [selectedTag]);

    useEffect(() => {
        getSandwich();
    }, []);

    const getSandwich = async () => {
        setSandwichList([]);
        const querySnapshot = await getDocs(collection(db, "menu"));
        allSandwiches.current = await fetchData(querySnapshot);
        setLoading(false);
    };

    async function fetchData(querySnapshot) {
        const sandwiches = [];
        const tags = new Set(["הכל"]);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            sandwiches.push(data);
            data.tags.forEach((tag) => tags.add(tag));
        });
        setTagsList(Array.from(tags));
        setSandwichList(sandwiches);

        return sandwiches;
    }

    return (
        <View
            className="flex-1 bg-white "
            style={{ flex: 1, backgroundColor: "white" }}
        >
            <StatusBar style="dark" />
            {loading ? (
                <View className="items-center top-2/4">
                    <LoadingPage size={hp(10)} />
                </View>
            ) : (
                <View>
                    <View style={{ top: hp(13) }}>
                        <Search
                            func={(value) => {
                                setSearchValue(value);
                                applyFilters({
                                    search: value,
                                    tags: selectedTag,
                                });
                            }}
                            ref={focusRef}
                            focus={!!source}
                        />
                    </View>

                    <View style={{ top: hp(17), height: hp(10) }}>
                        <SliderFilter
                            tagsList={tagsList}
                            selectedTag={selectedTag}
                            setSelectedTag={setSelectedTag}
                        />
                    </View>

                    <View
                        style={{
                            top: hp(18),
                            height: hp(55),
                            marginRight: wp(5),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 26,
                                padding: 17,
                                color: "#61B331",
                                textAlign: "right",
                            }}
                        >
                            תפריט
                        </Text>
                        <View tyle={{ top: hp(25) }}>
                            <SliderMenu sandwichList={sandwichList} />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
