import { useState } from "react";
import { View, Text, Image, SafeAreaView } from "react-native"
import { useDexContext } from "../components/hooks/useDexContext";
import PokemonTeamView from "../components/PokemonTeamView";

const TeamBuilder = () => {
    const sampleTeam = [ "greninja", "venusaur-mega", "talonflame", "diancie", "tyrantrum", "aegislash-shield" ]
    const sampleTeam2 = [ "rillaboom", "toxtricity-amped", "sirfetchd", "perrserker", "centiskorch" ]
    const sampleTeam3 = [ "charizard", "venusaur", "blastoise", "pikachu" ]
    const [ userTeams, setUserTeams ] = useState([sampleTeam, sampleTeam2, sampleTeam3])

    const sample = [
        {name: "greninja", moves: ["water-shuriken", "dark-pulse", "hydro-pump", 'gunk-shot']},
        {name: "venusaur-mega", moves: ["energy-ball", "sludge-bomb", "earthquake", 'leech-seed']},
        {name: "talonflame", moves: ["flare-blitz", "brave-bird", "steel-wing", 'roost']},
        {name: "diancie", moves: ["diamond-storm", "moonblast", "psychic", 'gyro-ball']},
        {name: "goodra", moves: ["dragon-pulse", "flamethrower", "ice-beam", 'thunderbolt']},
        {name: "aegislash-sheild", moves: ["kings-shield", "sacred-sword", "iron-head", 'shadow-sneak']},
    ]

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingHorizontal: 5}}>
                {userTeams.map((team, index) => (
                    <PokemonTeamView team={team} key={index}/>
                ))}
            </View>
        </SafeAreaView>
    );
}

export default TeamBuilder;
