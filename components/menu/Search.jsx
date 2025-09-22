import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { TextInput, View } from "react-native";
export default forwardRef(function Search({ func, focus = false }, ref) {
    return (
        <View>
            {/* Search bar */}
            <View
                className="mx-6 px-6 p-4 rounded-full flex flex-row  justify-end items-center "
                style={{
                    shadowColor: "#727273",
                    shadowRadius: 4,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 5 },
                    backgroundColor: "#EFF5ED",
                    flexDirection: "row",
                    alignItems: "center",
                    helight: 48,
                }}
            >
                {/* The string that will be rendered before text input has been entered. */}

                <TextInput
                    style={{ flex: 1 }}
                    className="mr-2  text-[18px] text-right	"
                    placeholder="חיפוש"
                    ref={ref}
                    placeholderTextColor="gray"
                    onChangeText={(value) => {
                        func(value);
                    }}
                    autoFocus={focus}
                    rtl
                />
                <Ionicons name="search" size={24} color="gray" />
            </View>
        </View>
    );
});
