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
            {
                userTeams.map(team => {
                    const teamInfo = team.map(mon => dexForms.find(info => info.name === mon))
                    teamInfo.map(mon => {
                        return (
                            <View>
                                <Image
                                    source={{uri: mon.image}}
                                    style={{height: 40, width: 40}}
                                />
                                <Text>{mon.name}</Text>
                            </View>
                        )
                    })
                })
            }
        </View>
    );
}

export default TeamBuilder;