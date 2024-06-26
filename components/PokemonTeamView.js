import { LinearGradient } from "expo-linear-gradient";
import { View, Image, Text, StyleSheet, Pressable, Alert } from "react-native"
import { useDexContext } from "./hooks/useDexContext";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { darkenColor } from "../global/UtiliyFunctions";
import ExpandedTeamView from "./ExpandedTeamView";
import { useTeamsContext } from "./hooks/useTeamsContext";
import { useThemeContext } from "./hooks/useThemeContext";

const PokemonTeamView = ({ team }) => {
    const { theme } = useThemeContext()
    const { dex } = useDexContext()
    const { dispatch } = useTeamsContext()
    const dexForms = dex.flatMap(mon => Object.values(mon.forms))
    const teamInfo = team.team?.map(member => dexForms.find(info => info.name === member.name))

    
    const handleDelete = () => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM teams WHERE id = ?`,
                [team.id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log("Team successfully deleted")
                        dispatch({type: 'DELETE_TEAM', payload: team})
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

    const handleDeletePress = () => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete?',
            [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => {
                handleDelete()
                console.log('Item deleted');
                },
                style: 'destructive',
            },
            ],
            { cancelable: true }
        )
    }

    return (
        <View>
        { teamInfo &&
        <ExpandedTeamView teamInfo={teamInfo} team={team} handleDelete={handleDeletePress}>
            <LinearGradient
                style={[styles.container, {borderColor: theme.mode === "dark" ? "#fff" : "#000"}]}
                colors={[teamInfo[0]?.types[0] ? typeToGradientDarkColorMap[teamInfo[0].types[0]] : "white", 
                            teamInfo[teamInfo.length - 1]?.types[0] ? darkenColor(typeToColourMap[teamInfo[teamInfo.length - 1].types[0]], 0.2) : "white", ]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
            >
                <Text style={styles.teamNameText}>{team.name}</Text>
                <View style={{flexDirection: "row"}}>
                {
                    teamInfo.map((member, index) => {
                        return (
                            <Image
                                source={{uri: member.image}}
                                style={{height: 60, width: 60}}
                                key={index}
                            />
                        )
                    })
                }
                </View>
            </LinearGradient>
        </ExpandedTeamView>
        }
        </View>
    );
}

export default PokemonTeamView;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingVertical: 8,
        borderColor: "black",
        borderWidth: 1.5,
        marginVertical: 5
    },
    teamNameText: {
        fontFamily: "Inconsolata Regular",
        color: "#d4d4d0",
        fontSize: 20
    }
})