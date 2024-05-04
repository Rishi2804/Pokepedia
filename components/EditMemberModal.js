import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Text, Modal, SafeAreaView, Pressable, StyleSheet, TouchableOpacity, Image } from "react-native";
import Checkbox from "expo-checkbox"
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { darkenColor, formatName, formatText } from "../global/UtiliyFunctions";
import IconTypeMapper from "../maps/typeToIconMap";
import { useMovesContext } from "./hooks/useMovesContext";
import { FlatList } from "react-native-gesture-handler";
import MovesView from "./MovesView";
import { useTeamsContext } from "./hooks/useTeamsContext";

const EditMemberModal = ({ children, team, index, member }) => {
    const { moves: moveList } = useMovesContext()
    const { dispatch } = useTeamsContext()
    const [ isVisible, setIsVisible ] = useState(false)
    const [ moves, setMoves ] = useState(team.team[index].moves)
    const [ selectedMove, setSelectedMove ] = useState(-1)
    const [ isShiny, setIsShiny ] = useState(false)
    const moveTypes = moves.map(move => {
        const type = moveList.find(item => item.name === move)?.type
        return type
    })
    const learnableMoves = member.moves.map(move => moveList.find(item => item.name === move.name))


    const handleSave = () => {
        const updatedTeam = [...team.team]
        updatedTeam[index].moves = moves
        dispatch({type: 'UPDATE_TEAM', payload: {id: team.id, team: updatedTeam}})
    }

    const handleMoveChange = (move) => {
        setMoves(prev => {
            prev[selectedMove] = move.name
            return [...prev]
        })
    }

    return (
        <View>
            <Pressable onPress={() => setIsVisible(true)}>
                { children }
            </Pressable>
            <Modal
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                animationType="slide"
            >
                <SafeAreaView>
                    <Pressable onPress={() => setSelectedMove(-1)}>
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
                                                start={{x: 0, y: 1}}
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
                    </Pressable>
                    <View style={[styles.checkBoxContainer, {backgroundColor: typeToGradientDarkColorMap[member.types[0]]}]}>
                        <Text style={styles.labelText}>Shiny:</Text>
                        <Checkbox
                            value={isShiny}
                            onValueChange={setIsShiny}
                            color={isShiny ? typeToColourMap[member.types[0]] : undefined}
                        />
                    </View>
                    <View style={styles.movesContainer}>
                        <View style={styles.moveRowContainer}>
                            <Pressable onPress={() => setSelectedMove(0)} style={{flex: 1}}>
                                <LinearGradient
                                    colors={[typeToGradientDarkColorMap[member.types[0]], moves[0] ? typeToColourMap[moveTypes[0]] : typeToGradientDarkColorMap[member.types[0]]]}
                                    style={[styles.moveItemContainer, {borderColor: selectedMove === 0 ? "black" : "#00000000"}]}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 1}}
                                >
                                    <View style={styles.moveNumberBox}>
                                        <Text style={styles.moveLabelText}>1</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        {moves[0] && <Text style={styles.moveLabelText}>{formatText(moves[0])}</Text>}
                                        {moves[0] && <IconTypeMapper type={moveTypes[0]} width={25} height={25} fill="#fff" />}
                                    </View>
                                </LinearGradient>
                            </Pressable>
                            <Pressable onPress={() => setSelectedMove(1)} style={{flex: 1}}>
                                <LinearGradient
                                    colors={[typeToGradientDarkColorMap[member.types[0]], moves[1] ? typeToColourMap[moveTypes[1]] : typeToGradientDarkColorMap[member.types[0]]]}
                                    style={[styles.moveItemContainer, {borderColor: selectedMove === 1 ? "black" : "#00000000"}]}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 1}}
                                >
                                    <View style={styles.moveNumberBox}>
                                        <Text style={styles.moveLabelText}>2</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        {moves[1] && <Text style={styles.moveLabelText}>{formatText(moves[1])}</Text>}
                                        {moves[1] && <IconTypeMapper type={moveTypes[1]} width={25} height={25} fill="#fff" />}
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        </View>
                        <View style={styles.moveRowContainer}>
                            <Pressable onPress={() => setSelectedMove(2)} style={{flex: 1}}>
                                <LinearGradient
                                    colors={[typeToGradientDarkColorMap[member.types[0]], moves[2] ? typeToColourMap[moveTypes[2]] : typeToGradientDarkColorMap[member.types[0]]]}
                                    style={[styles.moveItemContainer, {borderColor: selectedMove === 2 ? "black" : "#00000000"}]}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 1}}
                                >
                                    <View style={styles.moveNumberBox}>
                                        <Text style={styles.moveLabelText}>3</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        {moves[2] && <Text style={styles.moveLabelText}>{formatText(moves[2])}</Text>}
                                        {moves[2] && <IconTypeMapper type={moveTypes[2]} width={25} height={25} fill="#fff" />}
                                    </View>
                                </LinearGradient>
                            </Pressable>
                            <Pressable onPress={() => setSelectedMove(3)} style={{flex: 1}}>
                                <LinearGradient
                                    colors={[typeToGradientDarkColorMap[member.types[0]], moves[3] ? typeToColourMap[moveTypes[3]] : typeToGradientDarkColorMap[member.types[0]]]}
                                    style={[styles.moveItemContainer, {borderColor: selectedMove === 3 ? "black" : "#00000000"}]}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 1}}
                                >
                                    <View style={styles.moveNumberBox}>
                                        <Text style={styles.moveLabelText}>4</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        {moves[3] && <Text style={styles.moveLabelText}>{formatText(moves[3])}</Text>}
                                        {moves[3] && <IconTypeMapper type={moveTypes[3]} width={25} height={25} fill="#fff" />}
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                    {
                        selectedMove >= 0 && selectedMove < 4 &&
                        <FlatList
                            data={learnableMoves}
                            renderItem={({ item }) => {
                                return(
                                    <Pressable style={{marginHorizontal: 5, marginVertical: 2}} onPress={() => handleMoveChange(item)}>
                                        <MovesView move={item} disableModal={true} />
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{paddingBottom: 280}}
                        />
                    }
                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                        handleSave()
                        setIsVisible(false)
                    }}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

export default EditMemberModal;

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: "#007AFF",
        borderRadius: 5,
        padding: 7,
        width: 60,
        alignItems: "center",
        marginHorizontal: 5,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff"
    },
    container: {
        flexDirection: "row",
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 2,
        marginVertical: 5,
        marginHorizontal: 5,
        height: 120
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
    },
    movesContainer: {
        marginHorizontal: 7
    },
    moveRowContainer: {
        flexDirection: "row",
        marginVertical: 5
    },
    moveItemContainer: {
        flexDirection: "row",
        marginHorizontal: 5,
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 14,
        paddingVertical: 13,
        borderRadius: 8,
        borderWidth: 2
    },
    moveNumberBox: {
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 4
    },
    checkBoxContainer: {
        flexDirection: "row",
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 7,
        justifyContent: "space-between",
        padding: 15
    },
    labelText: {
        fontFamily: "Inconsolata SemiBold",
        color: "#fff",
        fontSize: 20
    },
    moveLabelText: {
        fontFamily: "Inconsolata SemiBold",
        color: "#fff",
        fontSize: 17
    }
})