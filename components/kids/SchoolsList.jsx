import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SchoolsList({ schoolList, setSelected, value }) {

    return (
        <View>
            <Text
                style={{
                    marginBottom: 5,
                    textAlign: "right",
                    fontSize: hp(2),
                    marginRight: hp(1),
                    color: "gray",
                }}>
                בית הספר:
            </Text>
            <SelectList
                setSelected={setSelected}
                data={schoolList}
                placeholder='בחר בית ספר'
                maxHeight={150}
                notFoundText='לא קיים ברשימה'
                boxStyles={{}}
                disabledTextStyles={{ fontSize: 16, color: "gray" }}
                inputStyles={{ fontSize: 16, width: 220 }}
                dropdownStyles={{ backgroundColor: "white" }}
                dropdownTextStyles={{ textAlign: "right" }}
                renderItem={({ item }) => (
                    <View>
                        <Text
                            className=' pr-1'
                            style={{ color: "#858585", textAlign: "center" }}>
                            {item.value}
                        </Text>
                    </View>
                )}
                defaultOption={{ key: value, value: value }}
            />
        </View>
    );
}
