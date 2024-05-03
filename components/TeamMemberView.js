import { View, StyleSheet, Image, Text } from "react-native"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from "expo-linear-gradient";
import { typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { darkenColor, formatName } from "../global/UtiliyFunctions";

const TeamMemberView = ({ member, moves }) => {
    return (
        <LinearGradient
            style={styles.container}
            colors={[member.types[0] ? typeToGradientDarkColorMap[member.types[0]] : "white",
                member.types[1] ? typeToGradientDarkColorMap[member.types[1]] : darkenColor(typeToGradientDarkColorMap[member.types[0]], 0.5)]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            <View>
                <IconTypeMapper type={member.types[0]} width={27} height={27} fill="#000" />
                {
                    member.types[1] &&
                    <IconTypeMapper type={member.types[1]} width={27} height={27} fill="#000" />
                }
            </View>
            <View style={{flex: 1, alignItems: !moves ? "center" : ""}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Image
                        source={{uri: member.image}}
                        style={{width: 90, height: 90}}
                    />
                    <Text style={styles.memberNameText}>{formatName(member.name)}</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

export default TeamMemberView;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 2,
        marginVertical: 5
    },
    memberNameText: {
        fontFamily: "Inconsolata Regular",
        color: "#d4d4d9",
        paddingLeft: 4,
        fontSize: 17
    }
})