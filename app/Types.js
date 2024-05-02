import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { types } from "../global/UniversalData";
import { typeToColourMap } from "../maps/typeToColourMap";
import { formatText, getTypeMatchups } from "../global/UtiliyFunctions";
import IconTypeMapper from "../maps/typeToIconMap";
import { useEffect, useState } from "react";
import { useDexContext } from "../components/hooks/useDexContext";
import PokemonListView from "../components/PokemonListView";

const Types = () => {
    const { dex } = useDexContext()
    const [ selectedTypes, setSelectedTypes ] = useState(['dragon', 'psychic'])
    const [ pokemonWith, setPokemonWith ] = useState([])
    const [ pokemonIndecies, setPokemonIndices ] = useState([])
    const typeRelations = getTypeMatchups(selectedTypes)

    useEffect(() => {
        const filterPokemonAndSet = () => {
            let pokemon = []
            let indicies = []
            dex.forEach(mon => {
                mon.forms.forEach(form => {
                    let same = false
                    if (form.types.length === selectedTypes.length) {
                        if (selectedTypes[0] === form.types[0] && selectedTypes[1] === form.types[1]) {
                            same = true
                        } else if (selectedTypes[0] === form.types[1] && selectedTypes[1] === form.types[0]) {
                            same = true
                        }
                    }
                    if (same) {
                        const index = mon.forms.findIndex(item => item.name === form.name)
                        pokemon.push(mon)
                        indicies.push(index)
                    }
                })
            })
            setPokemonIndices(indicies)
            setPokemonWith(pokemon)
        }
        setTimeout(() => {
            setPokemonWith([])
            setPokemonIndices([])
            filterPokemonAndSet()
        }, 0)
    }, [selectedTypes])

    const handlePress = (type) => {
        if (selectedTypes.length === 2 && !selectedTypes.includes(type)) {
            setSelectedTypes(prev => [...prev.slice(1), type])
        } else if (selectedTypes.includes(type)) {
            setSelectedTypes(prev => prev.filter(t => t !== type))
        } else if (selectedTypes.length < 2 && !selectedTypes.includes(type)) {
            setSelectedTypes(prev => [...prev, type])
        }
    }
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                <ScrollView>
                    <Text style={styles.headerText}>Select Types</Text>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {
                                types.map(item => item.name).map((type, index) => {
                                    return(
                                        <View style={[styles.selectTypeContainter, {borderColor:typeToColourMap[type] + (selectedTypes.includes(type) ? "" : "00")}]} key={index}>
                                            <Pressable style={[styles.selectTypeContainterInner, {backgroundColor: typeToColourMap[type]}]} onPress={() => handlePress(type)}>
                                                <IconTypeMapper type={type} width={37} height={37} fill="#fff" />
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.typeIconText}>{formatText(type)}</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        {
                            selectedTypes.length > 0 &&
                            <>    
                                <Text style={styles.subHeaderText}>{selectedTypes.length === 2 ? "Selected Type Combo" : selectedTypes.length === 1 ? "Selected Type" : ""}</Text>
                                <View style={{flexDirection: "row", flexWrap: "wrap", marginLeft: 10}}>
                                    {
                                        selectedTypes.map((type, index) => {
                                            return(
                                                <View style={[styles.selectedTypeContainer, {backgroundColor: typeToColourMap[type]}]} key={index}>
                                                    <IconTypeMapper type={type} width={37} height={37} fill="#fff" />
                                                    <View style={styles.textContainer}>
                                                        <Text style={styles.typeIconText}>{formatText(type)}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={{marginLeft: 15}}>
                                    <Text style={styles.typeHeaderText}>Weaknesses</Text>
                                    <View>
                                        {
                                            typeRelations.doubleWeakness.length > 0 &&
                                            <View style={{flexDirection: "row", marginBottom: 5}}>
                                                <View style={[styles.typeInfoContainer, {borderColor: "#eb5545"}]}>
                                                    <Text style={styles.relationText}>x4</Text>
                                                </View>    
                                                {
                                                    typeRelations.doubleWeakness.map((item, index) => {
                                                        return (
                                                            <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                <IconTypeMapper type={item} width={40} height={40} fill="#fff"/>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        }
                                        {
                                            typeRelations.weaknesses.length > 0 &&
                                            <View style={{flexDirection: "row", marginBottom: 15}}>
                                                <View style={[styles.typeInfoContainer, {borderColor: "#eb5545"}]}>
                                                    <Text style={styles.relationText}>x2</Text>
                                                </View>    
                                                {
                                                    typeRelations.weaknesses.map((item, index) => {
                                                        return (
                                                            <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                <IconTypeMapper type={item} width={40} height={40} fill="#fff"/>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        }
                                    </View>
                                    <Text style={styles.typeHeaderText}>Resistances</Text>
                                    {
                                        typeRelations.resistances.length > 0 &&
                                        <View style={{flexDirection: "row", marginBottom: 5}}>
                                            <View style={[styles.typeInfoContainer, {borderColor: "#68c367"}]}>
                                                <Text style={styles.relationText}>x1/2</Text>
                                            </View>
                                            <View style={{flexDirection: "row", flexWrap: "wrap", flex: 1}}>
                                            {
                                                typeRelations.resistances.map((item, index) => {
                                                    return (
                                                        <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5, marginBottom: 2}} key={index}>
                                                            <IconTypeMapper type={item} width={40} height={40} fill="#fff"/>
                                                        </View>
                                                    )
                                                })
                                            }
                                            </View>
                                        </View>
                                    }
                                    {
                                        typeRelations.doubleResistances.length > 0 &&
                                        <View style={{flexDirection: "row", marginBottom: 5}}>
                                            <View style={[styles.typeInfoContainer, {borderColor: "#68c367"}]}>
                                                <Text style={styles.relationText}>x1/4</Text>
                                            </View>
                                            {
                                                typeRelations.doubleResistances.map((item, index) => {
                                                    return (
                                                        <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                            <IconTypeMapper type={item} width={40} height={40} fill="#fff"/>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    }
                                    {
                                        typeRelations.immunities.length > 0 &&
                                        <View style={{flexDirection: "row"}}>
                                            <View style={[styles.typeInfoContainer, {borderColor: "#68c367"}]}>
                                                <Text style={styles.relationText}>x0</Text>
                                            </View>
                                            {
                                                typeRelations.immunities.map((item, index) => {
                                                    return (
                                                        <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                            <IconTypeMapper type={item} width={40} height={40} fill="#fff"/>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    }
                                    <Text style={[styles.subHeaderText, {marginLeft: 0}]}>Pokemon with Types</Text>
                                </View>
                                {
                                    pokemonWith.length > 0 &&
                                    pokemonWith.map((mon, index) => {
                                        return (
                                            <View style={{marginBottom: 5, marginHorizontal: 5}} key={index}>
                                                <PokemonListView pokemon={mon} displayForm={pokemonIndecies[index]} disableLongPress={true}/>
                                            </View>
                                        )
                                    })
                                }
                            </>
                        }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Types;

const styles = StyleSheet.create({
    selectTypeContainter: {
        width: '31.3%',
        alignItems: "center",
        marginHorizontal: '1%',
        marginVertical: 7,
        padding: 2,
        borderWidth: 3,
        borderRadius: 8
    },
    selectTypeContainterInner: {
        flexDirection: "row",
        borderRadius: 5,
        height: 35,
        borderColor: "black",
    },
    selectedTypeContainer: {
        flexDirection: "row",
        width: '31.3%',
        height: 35,
        alignItems: "center",
        marginHorizontal: '1%',
        marginVertical: 7,
        borderRadius: 8
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: -10
    },
    typeIconText: {
        fontFamily: "Geologica Bold",
        color: "white",
        fontSize: 17,
        textAlign: "center",
    },
    headerText: {
        fontFamily: "Geologica SemiBold",
        fontSize: 23,
        color: "black",
        textAlign: "center",
        paddingBottom: 7,
        paddingTop: 15,
    },
    subHeaderText: {
        fontFamily: "Geologica Bold",
        fontSize: 18,
        color: "black",
        paddingVertical: 5,
        marginLeft: 15
    },
    typeInfoContainer: {
        width: 80,
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        marginRight: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    typeHeaderText: {
        fontFamily: "Inconsolata SemiBold",
        color: "#000",
        fontSize: 18,
        marginTop: 5,
        marginBottom: 10
    },
    relationText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 25
    }
})