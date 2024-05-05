import { View, StyleSheet, Image, Text, Pressable } from "react-native"
import * as SQLite from "expo-sqlite"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from "expo-linear-gradient";
import { typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { darkenColor, formatName, formatText } from "../global/UtiliyFunctions";
import { useMovesContext } from "./hooks/useMovesContext";
import { Swipeable } from "react-native-gesture-handler";
import { useRef } from "react";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTeamsContext } from "./hooks/useTeamsContext";
import EditMemberModal from "./EditMemberModal";

const TeamMemberView = ({ member, moves, team, index }) => {
    const db = SQLite.openDatabase('teams.db')
    const { moves: moveList } = useMovesContext()
    const { dispatch } = useTeamsContext()
    const swipeableRef = useRef(null)

    const handleDelete = () => {
        const newTeam = [...team.team]
        newTeam.splice(index, 1)

        db.transaction(tx => {
            tx.executeSql(
                `UPDATE teams SET team = ? WHERE id = ?`,
                [JSON.stringify(newTeam), team.id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log("Team successfully changed")
                        dispatch({type: 'UPDATE_TEAM', payload: {id: team.id, name: team.name, team: newTeam}})
                        swipeableRef.current?.close()
                    } else {
                        console.log("No rows were updated")
                    }
                },
                (_, error) => {
                    console.log(error)
                }
            )
        })
    }

    const DeleteRightAction = () => {
        return (
            <Pressable style={styles.deleteContainer} onPress={() => handleDelete()}>
                <Ionicons name="trash" size={24} color="white" />
            </Pressable>
        );
    }
    
    const EditLeftAction = () => {
        return (
            <EditMemberModal team={team} member={member} index={index}>
                <View style={styles.editContainer}>
                    <Feather name="edit" size={24} color="white" />
                </View>
            </EditMemberModal>
        );
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={DeleteRightAction}
            renderLeftActions={EditLeftAction}
        >
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
        </Swipeable>
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
    },
    deleteContainer: {
        backgroundColor: "red", 
        width: '30%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    editContainer: {
        backgroundColor: "blue", 
        width: 100,
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    }
})