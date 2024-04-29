import { View, StyleSheet, Text } from "react-native";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import { darkenColor, formatText } from "../global/UtiliyFunctions";
import IconMoveClassMapper from "../maps/MoveClassToIconMap";
import MovesModal from "./MovesModal";

const MovesView = ({ move, level, versionGroup }) => {
    const pastVersion = move.pastValues.find(group => group.games?.includes(versionGroup))
    return (
        <MovesModal move={move}>
            <LinearGradient
                style={styles.container}
                colors={[typeToGradientDarkColorMap[move.type], darkenColor(typeToGradientDarkColorMap[move.type], 0.5)]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                locations={[0.4, 1]}
            >
                <View style={{flexDirection: "row"}}>
                    {
                        level !== 0 && level !== undefined && 
                        <View style={{justifyContent: "space-between", alignItems: "center", marginLeft: 4}}>
                            <Text style={styles.headerText}>lvl</Text>
                            <Text style={[styles.numText, {color: "#fff"}]}>{level}</Text>
                        </View>
                    }
                    <View style={{justifyContent: "center"}}>
                        <Text style={styles.nameText}>{formatText(move.name)}</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.headerText}>pow</Text>
                        <Text style={[styles.numText, {color: "#fff"}]}>{pastVersion ? pastVersion ? pastVersion.power : "--" : move.power ? move.power : "--"}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.headerText}>acc</Text>
                        <Text style={styles.numText}>{pastVersion ? pastVersion ? pastVersion.accuracy + "%" : "--" : move.accuracy ? move.accuracy + "%" : "--"}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.headerText}>pp</Text>
                        <Text style={styles.numText}>{pastVersion ? pastVersion ? pastVersion.pp : "--" : move.pp ? move.pp : "--"}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <IconTypeMapper type={move.type} width={40} height={40} fill={typeToColourMap[move.type]}/>
                        <IconMoveClassMapper moveClass={move.class} width={25} height={25} />
                    </View>
                </View>
            </LinearGradient>
        </MovesModal>
    );
}

export default MovesView;

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: "space-between",
        height: 80
    },
    sectionContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
    nameText: {
        color: "#fff",
        fontFamily: "Inconsolata Regular",
        fontSize: 20,
        marginLeft: 15
    },
    headerText: {
        color: "#000",
        fontFamily: "Inconsolata Regular",
        fontSize: 18
    },
    numText: {
        color: "#909090",
        fontFamily: "Inconsolata Regular",
        fontSize: 20,
    }
})