 import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, FlatList } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { darkenColor, formatText } from "../global/UtiliyFunctions";
import { typeToColourMap, typeToGradientDarkColorMap as gradientMap } from "../maps/typeToColourMap"
import IconTypeMapper from "../maps/typeToIconMap";
import IconMoveClassMapper from "../maps/MoveClassToIconMap";
import { versionGroupAbr } from "../maps/VersionGroupMap";

import { useDexContext } from "./hooks/useDexContext"
import PokemonListView from "./PokemonListView";
import LoadingView from "./LoadingView";
 
 const MovesModal = ({ children, move }) => {
    const [isVisible, setIsVisible] = useState(false)
    const displayDescription = move.descriptions.find(item => item.versionGroup.includes("sword-shield"))
    const { dex } = useDexContext()
    const [ pokemonLearnable, setPokemonLearnable ] = useState([])
    const [ formIndicies, setFormIndicies ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const fetchPokemon = async () => {
            let finalContexts = []
            let finalIndicies = []
            move.learnedBy.forEach(mon => {
                const findContext = dex.find(item => item.forms.map(form => form.name).includes(mon))
                if (findContext) {
                    const index = findContext.forms.findIndex(form => form.name === mon)
                    finalContexts.push(findContext)
                    finalIndicies.push(index)
                }
            })
            setTimeout(() => {
                setPokemonLearnable(finalContexts)
                setFormIndicies(finalIndicies)
                setLoading(false)
            }, 0)
        }
        if (pokemonLearnable.length === 0) fetchPokemon()
    }, [])

    const MoveDetails = () => {
        return (
            <>
                <View style={{flexDirection: "row", justifyContent: "center", paddingVertical: 20}}>
                    <View style={styles.centeredHeader}>
                        <Text style={styles.headerText}>power</Text>
                        <Text style={styles.valueText}>{move.power ? move.power : "--"}</Text>
                    </View>
                    <View style={[styles.lineVert, {backgroundColor: typeToColourMap[move.type]}]} />
                    <View style={styles.centeredHeader}>
                        <Text style={styles.headerText}>accuracy</Text>
                        <Text style={styles.valueText}>{move.accuracy ? move.accuracy + "%" : "--"}</Text>
                    </View>
                    <View style={[styles.lineVert, {backgroundColor: typeToColourMap[move.type]}]} />
                    <View style={styles.centeredHeader}>
                        <Text style={styles.headerText}>pp</Text>
                        <Text style={styles.valueText}>{move.pp}</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row", marginBottom: 20}}>
                    <View style={[styles.iconContainer, {backgroundColor: darkenColor(gradientMap[move.type], 0.25)}]}>
                        <View style={{backgroundColor: typeToColourMap[move.type], height: 35, width: 35, alignItems: "center", justifyContent: "center", borderRadius: 5, marginBottom: 10}}>
                            <IconTypeMapper type={move.type} width={35} height={35} fill={"white"}/>
                        </View>
                        <IconMoveClassMapper moveClass={move.class} width={35} height={35} />
                    </View>
                    <View style={{marginRight: 15, justifyContent: "center", flex: 1}}>
                        <Text style={styles.descriptionText}>{displayDescription ? displayDescription.entry : move.descriptions[move.descriptions.length - 1]?.entry}</Text>
                    </View>
                </View>
                <View style={[styles.line, {backgroundColor: typeToColourMap[move.type]}]}/>
                {
                    move.pastValues.length > 0 &&
                    <>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeaderText}>Past Values</Text>
                        <View style={{backgroundColor: darkenColor(gradientMap[move.type], 0.25), borderRadius: 8, paddingVertical: 8}}>
                            {
                                move.pastValues.map((details, index) => {
                                    const gamesAbr = details.games?.map(game => versionGroupAbr[game]).join(",")
                                    return (
                                        <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 10, paddingBottom: index !== move.pastValues.length - 1 ? 15 : 0, flexWrap: "wrap", borderBottomWidth: index !== move.pastValues.length - 1 ? 1 : 0, borderBottomColor: typeToColourMap[move.type]}} key={index}>
                                            <View style={{width: 150, justifyContent: "center"}}>
                                                <Text style={styles.gameListText}>{gamesAbr}</Text>
                                            </View>
                                            <View>
                                                <View style={{flexDirection: "row", justifyContent: "center"}}>
                                                    <View style={styles.centered}>
                                                        <Text style={styles.headerText2}>power</Text>
                                                        <Text style={styles.valueText2}>{details.power ? details.power : "--"}</Text>
                                                    </View>
                                                    <View style={styles.centered}>
                                                        <Text style={styles.headerText2}>accuracy</Text>
                                                        <Text style={styles.valueText2}>{details.accuracy ? details.accuracy + "%" : "--"}</Text>
                                                    </View>
                                                    <View style={styles.centered}>
                                                        <Text style={styles.headerText2}>pp</Text>
                                                        <Text style={styles.valueText2}>{details.pp ? details.pp : "--"}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    details.type && 
                                                    <View style={{alignItems: "center"}}>
                                                        <Text style={[styles.descriptionText2, {color: typeToColourMap[details.type]}]}>{"Type: " + formatText(details.type)}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={[styles.line, {backgroundColor: typeToColourMap[move.type]}]}/>
                    </>
                }
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderText}>Game Descriptions</Text>
                    <View style={{backgroundColor: darkenColor(gradientMap[move.type], 0.25), borderRadius: 8, paddingVertical: 8, paddingHorizontal: 5}}>
                        {
                            move.descriptions.map((details, index) => {
                                const gamesAbr = details.versionGroup.map(version => versionGroupAbr[version]).join(",")
                                return (
                                    <View style={{flexDirection: "row", marginBottom: 10, paddingBottom: index !== move.descriptions.length - 1 ? 15 : 0, borderBottomWidth: index !== move.descriptions.length - 1 ? 1 : 0, borderBottomColor: typeToColourMap[move.type]}} key={index}>
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
                <View style={[styles.line, {backgroundColor: typeToColourMap[move.type]}]}/>
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderText}>Learnable by</Text>
                </View>
            </>
        )
    }
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
                <LinearGradient 
                    style={{flex: 1}}
                    colors={[
                        gradientMap[move.type], darkenColor(gradientMap[move.type], 0.5) 
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    locations={[0.3, 1]}
                >
                    <View style={[styles.header, {backgroundColor: darkenColor(gradientMap[move.type], 0.25)}]}>
                        <Text style={styles.titleText}>{formatText(move.name)}</Text>
                    </View>
                    {
                        loading && <LoadingView />
                    }
                    {
                        !loading &&
                        <View>
                            <FlatList 
                                ListHeaderComponent={() => <MoveDetails />}
                                data={pokemonLearnable}
                                renderItem={({ item, index }) => {
                                    return(
                                        <View style={{marginHorizontal: 10}} key={index}>
                                            <PokemonListView pokemon={item} disableLongPress={true} displayForm={formIndicies[index]} />
                                        </View>
                                    )
                                }}
                                ItemSeparatorComponent={<View style={{height: 5}}/>}
                                keyExtractor={(item, index) => index}
                                contentContainerStyle={{paddingBottom: 140}}
                            />
                        </View>
                            }
                </LinearGradient>
            </Modal>
        </View>        
    );
 }
 
 export default MovesModal;

 const styles = StyleSheet.create({
    centeredHeader: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    header: {
        height: 60,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10
    },
    iconContainer: {
        alignContent: "center",
        justifyContent: "center",
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 8,
    },
    titleText: {
        fontFamily: "Inconsolata Bold",
        color: "white",
        fontSize: 25,
        textAlign: "center"
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    section: {
        marginVertical: 26,
        marginHorizontal: 8, 
    },
    headerText: {
        fontFamily: "Inconsolata Regular",
        color: "#a0a0a0",
        fontSize: 20,
        marginBottom: 3
    },
    valueText: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        fontSize: 23,
    },
    descriptionText: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        fontSize: 18,
    },
    descriptionText2: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        fontSize: 15,
    },
    gameListText: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        fontSize: 16,
    },
    headerText2: {
        fontFamily: "Inconsolata Regular",
        color: "#a0a0a0",
        fontSize: 18,
        marginBottom: 1
    },
    valueText2: {
        fontFamily: "Inconsolata Regular",
        color: "#fff",
        fontSize: 21,
    },
    sectionHeaderText: {
        fontFamily: "Inconsolata Regular",
        color: "#909090",
        fontSize: 18,
        marginBottom: 8
    },
    lineVert: {
        width: 0.5
    },
    line: {
        height: 0.5
    },
 })