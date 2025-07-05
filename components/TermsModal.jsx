import React from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
    Platform,
} from "react-native";
import Modal from "react-native-modal";

const TermsModal = ({ isVisible, onClose }) => {
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight =
        Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get(
                  "REAL_WINDOW_HEIGHT"
              );

    return (
        <Modal
            isVisible={isVisible}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            coverScreen={true}
            onBackdropPress={onClose}
            style={{
                flex: 1,
                justifyContent: "flex-end",
                margin: 0,
            }}>
            <View
                style={{
                    height: deviceHeight / 1.1,
                    borderRadius: 20,
                    backgroundColor: "#90DB64",
                }}>
                <Pressable
                    style={{
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        padding: 15,
                    }}
                    onPress={onClose}>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require("../assets/images/x-mark.png")}
                    />
                </Pressable>
                <ScrollView
                    style={{
                        borderRadius: 22,
                        backgroundColor: "white",
                    }}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}>
                    <Text
                        style={{
                            color: "black",
                            fontSize: 26,
                            textAlign: "right",
                            paddingRight: 15,
                            paddingLeft: 15,
                        }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse at ante eu leo finibus volutpat. Phasellus
                        ut sapien sem. In nec erat felis. Sed vitae erat et sem
                        accumsan fringilla. Quisque facilisis, justo consequat
                        molestie feugiat, lectus nulla consectetur quam, non
                        rutrum erat urna sed justo. Pellentesque et porttitor
                        arcu. Curabitur ornare, nunc eget bibendum ullamcorper,
                        odio urna ultrices lectus, eu congue massa neque eu
                        magna. Curabitur ultrices dui id varius finibus. Donec
                        nec libero vitae velit vehicula sodales a varius ante.
                        Nullam vitae efficitur purus. Praesent tempus nec tortor
                        ut mollis. Fusce interdum nisl non ullamcorper commodo.
                        Integer pulvinar, elit eu venenatis tristique, est
                        sapien facilisis arcu, ut commodo eros ante ac leo. In
                        vel porta ex, eget cursus sapien. Nunc tempor convallis
                        erat nec scelerisque. Proin in cursus diam. Quisque
                        rutrum diam in nulla maximus fermentum. Vivamus sem
                        dolor, cursus ac eleifend eget, condimentum at est.
                        Integer mattis, velit quis ultricies ullamcorper, felis
                        mauris lobortis orci, eu consequat libero turpis at
                        mauris. Proin nibh tortor, rhoncus vel rhoncus nec,
                        volutpat sit amet justo. Sed a quam a erat vestibulum
                        maximus. Sed tincidunt nunc semper turpis molestie
                        euismod. Sed elementum justo ante, dignissim ullamcorper
                        augue tristique et. Curabitur accumsan mi ut accumsan
                        ullamcorper. Vivamus sit amet nisl a felis suscipit
                        eleifend ut bibendum mi. Suspendisse potenti. Morbi
                        tempor at lacus quis volutpat. Fusce et volutpat mauris
                    </Text>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default TermsModal;
