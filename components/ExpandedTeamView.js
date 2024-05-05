import { useState } from "react";
import * as SQLite from "expo-sqlite"
import { Modal, Pressable, Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import { MaterialIcons, Foundation } from "@expo/vector-icons"
import TeamMemberView from "./TeamMemberView";
import TeamBuildingModal from "./TeamBuildingModal";
import { useTeamsContext } from "./hooks/useTeamsContext";
 
 const ExpandedTeamView = ({ children, teamInfo, team, handleDelete }) => {
    const db = SQLite.openDatabase('teams.db')
    const [ isVisible, setIsVisible ] = useState(false)
    const [ teamName, setTeamName ] = useState(team.name)
    const { dispatch } = useTeamsContext()

    const handleUpdateName = (newName) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE teams SET name = ? WHERE id = ?`,
                [newName, team.id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log("Name successfully changed")
                        dispatch({type: 'UPDATE_TEAM', payload: {id: team.id, name: newName, team: team.team}})
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

    return (
        <View>
            <Pressable onPress={() => setIsVisible(true)} onLongPress={() => handleDelete()}>
                { children }
            </Pressable>
            <Modal
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                animationType="slide"
            >
                <SafeAreaView style={{flex: 1}}>
                    <View style={{justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 10}}>
                        <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.backButton}>
                            <MaterialIcons name="arrow-back-ios-new" size={18} color={"white"}/>
                        </TouchableOpacity>
                        <TextInput
                            value={teamName}
                            onChange={(event) => setTeamName(event.nativeEvent.text)}
                            style={styles.teamNameText}
                            onSubmitEditing={(event) => {
                                if (event.nativeEvent.text.length > 0) handleUpdateName(event.nativeEvent.text)
                            }}
                        />
                        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
                            <Foundation name="credit-card" size={20} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: 5}}>
                        {
                            teamInfo.map((member, index) => {
                                return (
                                    <TeamBuildingModal teamInfo={teamInfo} team={team} key={index}>
                                        <TeamMemberView member={member} moves={team.team[index].moves} team={team} index={index}/>
                                    </TeamBuildingModal>
                                )
                            })
                        }
                        {
                            teamInfo.length < 6 &&
                            <TeamBuildingModal teamInfo={teamInfo} team={team}>
                                <View style={{height: 100, backgroundColor: "white", borderRadius: 10, borderWidth: 2, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontSize: 50}}>+</Text>
                                </View>
                            </TeamBuildingModal>
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
 }
 
 export default ExpandedTeamView;

 const styles = StyleSheet.create({
    backButton: {
        borderRadius: 20,
        backgroundColor: "grey",
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    teamNameText: {
        fontFamily: "Inconsolata SemiBold",
        color: "#848480",
        fontSize: 22
    }
 })