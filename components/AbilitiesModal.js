import { useState, useEffect } from "react";
import { View, Pressable, Modal, StyleSheet, Text, ScrollView } from "react-native";
import { formatText } from "../global/UtiliyFunctions";
import { versionGroupAbr } from "../maps/VersionGroupMap";
import { useDexContext } from "./hooks/useDexContext";
import PokemonListView from "./PokemonListView";

const AbilitiesModal = ({ children, ability }) => {
    const [isVisible, setIsVisible] = useState(false)
    const { dex } = useDexContext()
    const [ pokemonWith, setPokemonWith ] = useState([])
    const [ formIndex, setFormIndex ] = useState([])

    useEffect(() => {
        const fetchPokemon = async () => {
            let finalContexts = []
            let finalIndecies = []
            ability.pokemon.forEach(mon => {
                const findContext = dex.find(item => item.forms.map(form => form.name).includes(mon))
                if (findContext) {
                    const index = findContext.forms.findIndex(form => form.name === mon)
                    finalContexts.push(findContext)
                    finalIndecies.push(index)
                }
            })
            setTimeout(() => {
                setPokemonWith(finalContexts)
                setFormIndex(finalIndecies)
            }, 0)
        }
        if (pokemonWith.length === 0) fetchPokemon()
    }, [])

    return (
        <View>
            <Pressable onPress={() => setIsVisible(true)}>
                { children }
            </Pressable>
            <Modal
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={{backgroundColor: "#f2f2f7", flex: 1}}>
                    <View style={styles.header}>
                        <Text style={styles.titleText}>{formatText(ability.name)}</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>Game Descriptions</Text>
                            <View style={{backgroundColor: "#fff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 5}}>
                                {
                                    ability.descriptions.map((details, index) => {
                                        const gamesAbr = details.versionGroup.map(version => versionGroupAbr[version]).join(",")
                                        return (
                                            <View style={{flexDirection: "row", marginBottom: 10, paddingBottom: index !== ability.descriptions.length - 1 ? 15 : 0, borderBottomWidth: index !== ability.descriptions.length - 1 ? 1 : 0, borderBottomColor: "#c7c7c8"}} key={index}>
                                                <View style={{width: 120, justifyContent: "center"}}>
                                                    <Text style={styles.gameListText}>{gamesAbr}</Text>
                                                </View>
                                                <View style={{justifyContent: "center", paddingLeft: 5, flex: 1}}>
                                                    <Text style={styles.descriptionText2}>{details.entry}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>Pokemon with Ability</Text>
                            {
                                pokemonWith.map((mon, index) => {
                                    return (
                                        <View style={{paddingBottom: 5}} key={index}>
                                            <PokemonListView pokemon={mon} disableLongPress={true} displayForm={formIndex[index]}/>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontFamily: "Inconsolata Bold",
        color: "white",
        fontSize: 25,
        textAlign: "center"
    },
    header: {
        height: 60,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        backgroundColor: "#c8c8ce"
    },
    section: {
        marginVertical: 26,
        marginHorizontal: 8, 
    },
    sectionHeaderText: {
        fontFamily: "Inconsolata Regular",
        color: "#909090",
        fontSize: 18,
        marginBottom: 8
    },
    descriptionText2: {
        fontFamily: "Inconsolata Regular",
        //color: "#fff",
        fontSize: 15,
    },
    gameListText: {
        fontFamily: "Inconsolata Regular",
        //color: "#fff",
        fontSize: 16,
    },
    line: {
        height: 0.5,
        backgroundColor: "#c7c7c8"
    },
})

export default AbilitiesModal;