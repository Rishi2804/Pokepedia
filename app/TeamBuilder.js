import { useState } from "react";
import { View, Text, Image } from "react-native"
import { useDexContext } from "../components/hooks/useDexContext";

const TeamBuilder = () => {
    const sampleTeam = [ "greninja", "venusaur-mega", "talonflame", "diancie", "tyrantrum", "aegislash-shield" ]
    const [ userTeams, setUserTeams ] = useState([sampleTeam])
    const { dex } = useDexContext()
    const dexForms = dex.flatMap(mon => Object.values(mon.forms))

    return (
        <View>
            {userTeams.map((team, index) => (
                <View key={index}>
                    {team.map(mon => {
                        const member = dexForms.find(info => info.name === mon)
                        return (
                            <View key={mon}>
                                <Image
                                    source={{uri: member.image}}
                                    style={{height: 40, width: 40}}
                                />
                                <Text>{member.name}</Text>
                            </View>
                        )
                    })}
                </View>
            ))}
        </View>
    );
}

export default TeamBuilder;
