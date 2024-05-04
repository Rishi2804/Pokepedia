import { useEffect, useState } from "react";
import { View, Text, Image, SafeAreaView } from "react-native"
import { useTeamsContext } from "../components/hooks/useTeamsContext"
import PokemonTeamView from "../components/PokemonTeamView";

const TeamBuilder = () => {
    const { teams, dispatch } = useTeamsContext()

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingHorizontal: 5}}>
                {teams.map((team, index) => (
                    <PokemonTeamView team={team} key={index}/>
                ))}
            </View>
        </SafeAreaView>
    );
}

export default TeamBuilder;
