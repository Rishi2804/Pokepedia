import { useEffect, useState } from "react";
import { View, Text, Image, SafeAreaView, StyleSheet } from "react-native"
import { useTeamsContext } from "../components/hooks/useTeamsContext"
import PokemonTeamView from "../components/PokemonTeamView";
import TeamBuildingModal from "../components/TeamBuildingModal";
import { ScrollView } from "react-native-gesture-handler";
import { useThemeContext } from "../components/hooks/useThemeContext";

const TeamBuilder = () => {
    const { theme } = useThemeContext()
    const { teams } = useTeamsContext()

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.mode === "dark" ? "#000" : "#f2f2f7"}}>
            <ScrollView>
                <View style={{paddingHorizontal: 5}}>
                    {teams.map((team, index) => (
                        <PokemonTeamView team={team} key={index}/>
                    ))}
                </View>
                <TeamBuildingModal creation={true}>
                    <View style={[styles.container, {backgroundColor: theme.mode === "dark" ? "#1c1c1e" : "#fff", borderColor: theme.mode === "dark" ? "#fff" : "#000"}]}>
                        <Text style={[styles.teamNameText, {color: theme.mode === "dark" ? "#fff" : "#000"}]}>+</Text>
                    </View>
                </TeamBuildingModal>
            </ScrollView>
        </SafeAreaView>
    );
}

export default TeamBuilder;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingVertical: 8,
        marginHorizontal: 5,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1.5,
        marginVertical: 5,
        height: 100
    },
    teamNameText: {
        fontFamily: "Inconsolata Regular",
        //color: "#d4d4d0",
        fontSize: 60
    }
})