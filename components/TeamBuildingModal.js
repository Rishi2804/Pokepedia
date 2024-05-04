import PokedexData from "../assets/jsonData/pokedex.json"
import { SafeAreaView, View, Pressable, Modal, Text, StyleSheet, Image, Alert, FlatList, TextInput } from "react-native";
import { useDexContext } from "./hooks/useDexContext";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Dropdown from "react-native-input-select"
import { dexes, types } from "../global/UniversalData";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import { LinearGradient } from "expo-linear-gradient";
import { darkenColor, formatName, formatText, isRegionalVariant, returnRegionalVariants } from "../global/UtiliyFunctions";
import IconTypeMapper from "../maps/typeToIconMap";
import { dexToNameLabel } from "../maps/DexToNameLabelMap";
import { useTeamsContext } from "./hooks/useTeamsContext";

const TeamBuildingModal = ({ children, teamInfo, team, creation }) => {
    const { dex } = useDexContext()
    const { dispatch } = useTeamsContext()
    const dexForms = dex.flatMap(mon => Object.values(mon.forms))
    const [ filteredPokemon, setFilteredPokemon ] = useState(dexForms)
    const [ teamInEdit, setTeamInEdit ] = useState(creation ? [] : teamInfo)
    const [ selected, setSelected ] = useState(-1)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ filterTypes, setFilterTypes] = useState([])
    const [ dexType, setDexType ] = useState("national")
    const [ generation, setGeneration ] = useState([])
    const [ isVisible, setIsVisible ] = useState(false)
    const genList = ["Generation I", "Generation II", "Generation III",
                        "Generation IV", "Generation V", "Generation VI",
                        "Generation VII", "Generation VIII", "Generation IX"]

    useEffect(() => {
        const alolaDexes = ['original-alola', 'original-melemele', 'original-akala', 'original-ulaula', 'original-poni',
            'updated-alola', 'updated-melemele', 'updated-akala', 'updated-ulaula', 'updated-poni']
        const galarDexes = ['galar', 'isle-of-armor', 'crown-tundra']
        const kalosDexes = ['kalos-central', 'kalos-coastal', 'kalos-mountain'] 
        const megaDexes = [...kalosDexes, ...alolaDexes]
        
        let pokemonToSet = [...dexForms]
    
        if (dexType !== "national") {
            const dexIds = PokedexData.find(dex => dex.name === dexType).speciesIDs;
            let regionalDex = dex.filter(mon => dexIds.includes(mon.id));
            pokemonToSet = [...regionalDex]
        } else {
            pokemonToSet = [...dex]
        }
    
        if (generation.length > 0) {
            pokemonToSet = pokemonToSet.filter(mon => generation.includes(mon.generation))
        }

        pokemonToSet = pokemonToSet.sort((a, b) => {
            return a.regionalDexNumber.find(entry => entry.name === dexType).number - b.regionalDexNumber.find(entry => entry.name === dexType).number
        })

        let formsArray = []

        pokemonToSet.forEach(mon => {
            const formsToPush = mon.forms.filter((form) => {
                if (dexType === 'national') {
                    return true
                }

                if (form.name === 'pikachu-starter' && form.name === 'eevee-starter') {
                    if (dexType === 'letsgo-kanto') {
                        return true
                    } else {
                        return false
                    }
                }
                
                if (returnRegionalVariants(mon).length > 0) {
                    if (alolaDexes.includes(dexType)) {
                        if (form.name.split('-').includes('alola')) {
                            return true
                        } else {
                            return false
                        }
                    } else if (galarDexes.includes(dexType)) {
                        if (form.name.split('-').includes('galar')) {
                            return true
                        } else {
                            return false
                        }
                    } else if (dexType === 'hisui') {
                        if (form.name.split('-').includes('hisui')) {
                            return true
                        } else {
                            return false
                        }
                    } else if (dexType === 'paldea') {
                        if (form.name.split('-').includes('paldea')) {
                            return true
                        } else {
                            return false
                        }
                    } else if (![...alolaDexes, ...galarDexes, 'hisui', 'paldea'].includes(dexType)) {
                        if (isRegionalVariant(form.name)) {
                            return false
                        } else {
                            return true
                        }
                    }
                }
                
                if (form.name.split('-').includes('mega')) {
                    if (megaDexes.includes(dexType)) {
                        return true
                    } else {
                        return false
                    }
                }

                if (mon.name === 'groudon' || mon.name === 'kyogre') {
                    if (form.name.split('-').includes('primal')) {
                        if (megaDexes.includes(dexType)) {
                            return true
                        } else {
                            return false
                        }
                    }
                }

                if (mon.name === 'basculin') {
                    if (form.name === 'basculin-white-striped') {
                        if (dexType === 'hisui' || dexType === 'paldea') {
                            return true
                        } else {
                            return false
                        }
                    }
                }

                if (mon.name === 'ursaluna') {
                    if (dexType === 'hisui') {
                        if (form.name === 'ursaluna-bloodmoon') {
                            return false
                        }
                    }
                }
                
                if (form.name.split('-').includes('gmax')) {
                    if (galarDexes.includes(dexType)) {
                        return true
                    } else {
                        return false
                    }
                }

                return true
            })
            formsArray.push(...formsToPush)
        })

        pokemonToSet = formsArray

        if (filterTypes.length > 0) {
            pokemonToSet = pokemonToSet.filter(mon => {
                return mon.types.some(type => filterTypes.includes(type))
            })
        }
    
        const regex = new RegExp(searchTerm, 'i');
        const searchResults = pokemonToSet.filter(pokemon => regex.test(formatName(pokemon.name)));

        setFilteredPokemon(searchResults)
    }, [searchTerm, generation, filterTypes, dexType])
    
    const getGradientColorArray = (types) => {
        let finalColors = []
        if (types[0]) {
            finalColors.push(typeToGradientDarkColorMap[types[0]])
        } else {
            finalColors.push("white")
        }

        if (types[1]) {
            finalColors.push(darkenColor(typeToGradientDarkColorMap[types[1]], 0.2))
        } else if (types[0]) {
            finalColors.push(darkenColor(typeToGradientDarkColorMap[types[0]], 0.5))
        } else {
            finalColors.push("white")
        }

        return finalColors
    }

    const handleLongPress = (index) => {
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
                setTeamInEdit(prev => {
                    const newArray = [...prev]
                    newArray.splice(index, 1)
                    return newArray
                })
                console.log('Item deleted');
                },
                style: 'destructive',
            },
            ],
            { cancelable: true }
        )
    }

    const handleAddPokemon = (pokemon) => {
        if (selected < 6 && selected >= 0) {
            setTeamInEdit(prev => {
                const newArray = [...prev]
                newArray[selected] = { ...pokemon }
                return newArray
            })
        } else if (teamInEdit.length < 6) {
            setTeamInEdit(prev => [...prev, {...pokemon}])
        } else {
            setTeamInEdit(prev => {
                const newArray = [...prev]
                newArray[5] = { ...pokemon }
                return newArray
            })
            setSelected(5)
        }
    }

    const handleSave = () => {
        if (teamInEdit.length === 0) return
        if (creation) {
            const newTeam = teamInEdit.map(member => {return{name: member.name, shiny: 0, female: 0, teraType: null, moves: []}})
            dispatch({type: 'CREATE_TEAM', payload: {id: Math.floor(Math.random() * 1000000), name: "New Team", team: newTeam}})
            setTeamInEdit([])
        } else {
            let updatedTeam = teamInEdit.map(member => {return{name: member.name, shiny: 0, female: 0, teraType: null, moves: []}})
            let update = false
    
            if (updatedTeam.length !== team.team.length) {
                update = true
            }
    
            for (let i = 0; i < updatedTeam.length; i++) {
                if (updatedTeam[i]?.name === team.team[i]?.name) {
                    updatedTeam[i] = team.team[i]
                } else {
                    update = true
                }
            }
    
            if (update) {
                dispatch({type: 'UPDATE_TEAM', payload: {id: team.id, name: team.name, team: updatedTeam}})
            }
        }


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
            >
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                        handleSave()
                        setIsVisible(false)
                    }}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                        setTeamInEdit(teamInfo)
                        setIsVisible(false)
                    }}>
                        <Text style={styles.saveButtonText}>Quit</Text>
                    </TouchableOpacity>
                    <LinearGradient 
                        style={styles.currentTeamContainer}
                        colors={teamInEdit.length === 0 ? ["#909090", "#909090"] : getGradientColorArray([teamInEdit[0].types[0], teamInEdit[teamInEdit.length - 1].types[0]])}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <View style={styles.innerTeamContainer}>
                            {
                                teamInEdit.map((member, index) => {
                                    return (
                                            <Pressable
                                                style={[styles.memberContainer, {borderColor: typeToColourMap[member.types[0]]}]}
                                                onPress={() => setSelected(index)}
                                                onLongPress={() => handleLongPress(index)}
                                                key={index}
                                            >
                                                <LinearGradient 
                                                    style={{flex: 1, justifyContent: "center", borderRadius: 7}}
                                                    colors={selected === index ? ["#c8c8ce", "#c8c8ce"] : getGradientColorArray(member.types) }
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 1}}
                                                >
                                                    <Image
                                                        source={{uri: member.image}}
                                                        style={{width: "100%", aspectRatio: 1}}
                                                        resizeMode="contain"
                                                    />
                                                </LinearGradient>
                                            </Pressable>
                                    )
                                })
                            }
                            {
                                teamInEdit.length < 6 &&
                                <Pressable
                                    style={[styles.memberContainer]}
                                    onPress={() => setSelected(-1)}
                                >   
                                    <Text style={{fontSize: 30}}>+</Text>
                                </Pressable>
                            }
                            <View style={{width: (16 * (5 - teamInEdit.length)) + "%"}}/>
                        </View>
                    </LinearGradient>
                    <ScrollView horizontal>
                        <Dropdown
                            options={dexes.map(item => {return{value: item, label: dexToNameLabel[item]}})}
                            placeholder="Select a Dex"
                            selectedValue={dexType}
                            onValueChange={(value) => {
                                if (value) {
                                    setDexType(value)
                                } else {
                                    setDexType(dexType)
                                }
                            }}
                            dropdownStyle={{paddingRight: 50}}
                            dropdownContainerStyle={{flex: 1}}
                        />
                        <Dropdown
                            isMultiple
                            options={genList.map((gen, index) => {return{value: index + 1, label: gen}})}
                            placeholder="Select Generations"
                            selectedValue={generation}
                            onValueChange={(value) => {setGeneration(value)}}
                            dropdownStyle={{paddingRight: 50}}
                            dropdownContainerStyle={{flex: 1}}
                        />
                        <Dropdown
                            isMultiple
                            options={types.map(item => {return{value: item.name, label: formatText(item.name)}})}
                            placeholder="Select Types"
                            selectedValue={filterTypes}
                            onValueChange={(value) => {setFilterTypes(value)}}
                            dropdownStyle={{paddingRight: 50}}
                            dropdownContainerStyle={{flex: 1}}
                        />
                    </ScrollView>
                    <View style={{paddingHorizontal: 5, paddingBottom: 10, paddingTop: 5}}>
                        <TextInput autoCorrect={false} style={styles.textInput} onSubmitEditing={(event) => setSearchTerm(event.nativeEvent.text)}/>
                    </View>
                    <FlatList
                        data={filteredPokemon}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    style={{flex: 1}}
                                    onPress={() => handleAddPokemon(item)}
                                >
                                    <LinearGradient
                                        style={styles.pokemonGridView}
                                        colors={getGradientColorArray(item.types)}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                    >
                                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                            <IconTypeMapper type={item.types[0]} width={15} height={15} fill={"#fff"} />
                                            {
                                                item.types[1] && 
                                                <IconTypeMapper type={item.types[1]} width={15} height={15} fill={"#fff"} />
                                            }
                                        </View>
                                        <Image
                                            source={{uri: item.image}}
                                            style={{width: "100%", flex: 1, aspectRatio: 1}}
                                            resizeMode="contain"
                                        />
                                    </LinearGradient>
                                </Pressable>
                            )
                        }}
                        numColumns={5}
                        ItemSeparatorComponent={<View style={{height: 5}}/>}
                        contentContainerStyle={{paddingBottom: 140}}
                        keyExtractor={(item) => item.id}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}

export default TeamBuildingModal; 

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: "#007AFF",
        borderRadius: 5,
        padding: 7,
        width: 60,
        alignItems: "center",
        marginHorizontal: 5,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff"
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: "100%",
        paddingHorizontal: 5,
    },
    pokemonGridView: {
        flex: 1,
        marginHorizontal: 2,
        borderRadius: 5,
        borderWidth: 2
    },
    currentTeamContainer: {
        height: 150,
        borderRadius: 10,
        padding: 9,
        paddingTop: 19,
        justifyContent: "center",
        backgroundColor: "grey"
    },
    innerTeamContainer: {
        flex: 1,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "white"
    },
    memberContainer: {
        width: '16%', 
        height: "100%",
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center"
    }
})