import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const ToggleButtons = ({ buttons, toggled, setToggled }) => {
    return (
        <View style={{flexDirection: "row", width: "100%"}}>
            {
                buttons.map((text, index) => (
                    <Pressable onPress={() => setToggled(index)} style={{backgroundColor: toggled === index ? "#b0d85d" : "white", padding: 4, width: (100 / buttons.length) + "%", alignItems: "center"}}>
                        <Text style={{fontSize: 20, fontFamily: "Geologica Regular", color: toggled === index ? "white" : "black"}}>{text}</Text>
                    </Pressable>
                ))
            }
        </View>
    )
}

export default ToggleButtons;