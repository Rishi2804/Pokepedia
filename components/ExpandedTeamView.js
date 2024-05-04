import { useState } from "react";
import { Modal, Pressable, Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native"
import { MaterialIcons, Foundation } from "@expo/vector-icons"
import TeamMemberView from "./TeamMemberView";
import TeamBuildingModal from "./TeamBuildingModal";
 
 const ExpandedTeamView = ({ children, team }) => {
    const [ isVisible, setIsVisible ] = useState(false)

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
                <SafeAreaView style={{flex: 1}}>
                    <View style={{justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 10}}>
                        <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.backButton}>
                            <MaterialIcons name="arrow-back-ios-new" size={18} color={"white"}/>
                        </TouchableOpacity>
                        <Text style={styles.teamNameText}>Sample Text</Text>
                        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
                            <Foundation name="credit-card" size={20} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: 5}}>
                        {
                            team.map((member, index) => {
                                return (
                                    <TeamBuildingModal team={team} key={index}>
                                        <TeamMemberView member={member}/>
                                    </TeamBuildingModal>
                                )
                            })
                        }
                        {
                            team.length < 6 &&
                            <View style={{height: 100, backgroundColor: "white", borderRadius: 10, borderWidth: 2, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: 50}}>+</Text>
                            </View>
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