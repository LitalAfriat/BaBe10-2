import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";

export default function SliderFilter({ tagsList, selectedTag, setSelectedTag }) {
    const handleFilterPress = (filter) => {
        setSelectedTag(filter);
    };

    return (
        <View className='mt-5 mr-4'>
            <FlatList
                data={tagsList}
                inverted={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            margin: 5,
                            marginBottom: 9,
                            marginRight: 8,
                            borderRadius: 20,
                            height: 50,
                            minWidth: 100,
                            backgroundColor:
                                selectedTag === item ? "#61B331" : "#EFF5ED",
                            shadowColor: "#727273",
                            shadowRadius: 2,
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 5 },
                        }}
                        onPress={() => handleFilterPress(item)}>
                        <Text style={{ textAlign: "center" }}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
