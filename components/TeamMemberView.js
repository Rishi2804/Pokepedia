import { View, StyleSheet, Image, Text } from "react-native"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from "expo-linear-gradient";
import { typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { darkenColor, formatName, formatText } from "../global/UtiliyFunctions";
import { useMovesContext } from "./hooks/useMovesContext";

const TeamMemberView = ({ member, moves }) => {
    const { moves: moveList } = useMovesContext()
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
            <View style={{flex: 1, alignItems: (moves.length === 0) ? "center" : ""}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Image
                        source={{uri: member.image}}
                        style={{width: 90, height: 90}}
                    />
                    <Text style={styles.memberNameText}>{formatName(member.name)}</Text>
                </View>
            </View>
            {
                moves.length > 0 &&
                <View style={{justifyContent: "space-around"}}>
                {
                    moves.map((move, index) => {
                        const type = moveList.find(item => item.name === move).type
                        return (
                            <LinearGradient 
                                style={{flexDirection: "row", justifyContent: "flex-end", flex: 1}} 
                                colors={["#00000000", typeToGradientDarkColorMap[type]]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                locations={[0, 0.9]}
                                key={index}
                            >
                                <Text style={styles.moveText}>{formatText(move)}</Text>
                                <IconTypeMapper type={type} width={20} height={20} fill="#fff" />
                            </LinearGradient>
                        )
                    })
                }
                </View>
            }
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
    },
    moveText: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        textAlign: "right"
    }
})