import { useRef, useState } from "react";
import { Modal, Pressable, View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { typeToColourMap, typeToGradientDarkColorMap as gradientMap } from "../maps/typeToColourMap"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import { darkenColor, formatName, formatGameText } from "../global/UtiliyFunctions";
import { gameToColorMap, gameToTextColor } from "../maps/GameToColourMap";
import { transformSpeciesInfoAlt, transformDexDataAlt, transformEvoChain } from "../transformers/SpeciesInfoTransformer";

import { useDexContext } from "./hooks/useDexContext";

const PokemonModal = ({ children, pokemon, hasSecondType }) => {
    const [isVisible, setIsVisible] = useState(false)
    const { dex, speciesInfo, evoChains, dispatch } = useDexContext()
    const [pokemonInfo, setPokemonInfo] = useState([])
    const [dexEntries, setDexEntries] = useState([])
    const [evoChain, setEvoChain] = useState([])
    const [formIndex, setFormIndex] = useState(0)

    const swipeableRef = useRef(null);

    const threshold = Dimensions.get('window').width / 4
    
    const handleSwipe = (dir) => {
        if (dir === "right") {
            const nextIndex = formIndex + 1
            if (nextIndex < pokemonInfo.length) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(0)
            }
        } else {
            const nextIndex = formIndex - 1
            if (nextIndex >= 0) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(pokemonInfo.length - 1)
            }
        }
    }

    const handleOpen = (dir) => {
        if (dir === "right") {
            const nextIndex = formIndex + 1
            if (nextIndex < pokemonInfo.length) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(0)
            }
            swipeableRef.current.openLeft()
            resetImagePosition()
        } else {
            const nextIndex = formIndex - 1
            if (nextIndex >= 0) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(pokemonInfo.length - 1)
            }
            swipeableRef.current.openRight()
            resetImagePosition()
        }
    }

    const resetImagePosition = () => {
        // Reset the position of the image here
        if (swipeableRef.current) {
          swipeableRef.current.close();
        }
      };

    const blankRender = () => {
        return (
            <View style={{width: pokemonInfo.length > 1 ? '100%' : 0}}>

            </View>
        )
    }

    const handleModalOpen = () => {
        function findInList(name) {
            for (const speciesArray of speciesInfo) {
                if (speciesArray.info[0].name === name) {
                    return speciesArray
                }
            }
        }

        const pokemonInfo = findInList(pokemon.name)
        if (!pokemonInfo) {
            fetchDataAlt()
            console.log("Needed to fetch")
        } else {
            setDexEntries(pokemonInfo.dexEntries)
            setPokemonInfo(pokemonInfo.info)
            setEvoChain(evoChains.find((chain) => chain.id === pokemonInfo.chainId).chain)
            console.log("Had info from before!")
        }
    }

    const fetchDataAlt = async () => {

        const dexResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)

        const dexData = await dexResponse.json()

        const formRawData = []
        for (const form of dexData.varieties) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${form.pokemon.name}`)
            const json = await response.json()
            formRawData.push(json)
        }

        if (dexResponse.ok) {
            const dexEntries = transformDexDataAlt(dexData)
            const formData = transformSpeciesInfoAlt(formRawData)
            const chainId = Number(dexData.evolution_chain.url.match(/(\d+)\/?$/)[1])
            setDexEntries(dexEntries)
            setPokemonInfo(formData)
            dispatch({type: 'ADD_SPECIES_INFO', payload: {info: formData, dexEntries: dexEntries, chainId: chainId}})

            const chain = evoChains.find((chain) => chain.id === chainId)
            if (!chain) {
                const evoChainResponse = await fetch(dexData.evolution_chain.url)
                const evoChainData = await evoChainResponse.json()
                const formattedChain = transformEvoChain(evoChainData)
                setEvoChain(formattedChain.chain)
                dispatch({type: 'ADD_EVO_CHAIN', payload: formattedChain})
                console.log("Needed to fetch EVO")
            } else {
                setEvoChain(chain.chain)
                console.log("Already there")
            }
        }
    }


    const GeneralView = () => {
        return (
            <>
                <View style={styles.section}>
                    <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.headerText}>Weight</Text>
                            <Text style={styles.defaultText}>{pokemonInfo[formIndex].weight} kg</Text>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.headerText}>Height</Text>
                            <Text style={styles.defaultText}>{pokemonInfo[formIndex].height} m</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                {
                    evoChain.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.headerText}>Evolution Chain</Text>
                            {
                                evoChain.map((line, index) => (
                                    <View style={{flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}} key={index}>
                                        <Image 
                                            source={{url: dex.find((mon) => mon.name === line.from).image}}
                                            style={{width: 80, height: 80}}
                                        />
                                        <Image 
                                            source={{url: dex.find((mon) => mon.name === line.to).image}}
                                            style={{width: 80, height: 80}}
                                        />
                                    </View>
                                ))
                            }
                        </View>
                    )
                }
                <View style={styles.line} />
                <View style={styles.section}>
                    <Text style={styles.headerText}>Pokedex Entries</Text>
                    <View style={{borderWidth: 2, borderColor: "#909090", borderRadius: 8, paddingHorizontal: 1, backgroundColor: "#909090"}}>
                        {
                            dexEntries.map((entry, index) => (
                                <View style={{ marginBottom: 3 }} key={index}>
                                    <View style={{flexDirection: "row"}}>
                                        <View style={{backgroundColor: gameToColorMap[entry.game] ? gameToColorMap[entry.game] : "#fff", width: 70, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}>
                                            <Text style={{textAlign: "center", fontFamily: "Geologica Regular", color: gameToTextColor[entry.game] ? gameToTextColor[entry.game] : "#000"}}>{formatGameText(entry.game)}</Text>
                                        </View>
                                        <View style={{flex: 1, backgroundColor: "#fff", borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
                                            <Text style={styles.defaultText2}>{entry.entry}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View style={styles.line} />
                <View style={styles.section}>
                    <Text style={styles.headerText}>Images</Text>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                            <View>
                                <Text style={styles.headerText}>Regular</Text>
                                <Image 
                                    source={{uri: pokemonInfo[formIndex].image}}
                                    style={{width: 150, height: 150}}
                                />
                            </View>
                            <View>
                                <Text style={styles.headerText}>Shiny</Text>
                                <Image 
                                    source={{uri: pokemonInfo[formIndex].shiny}}
                                    style={{width: 150, height: 150}}
                                />
                            </View>
                        </View>
                        {
                            pokemonInfo[formIndex].female && (
                                <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                                    <View>
                                        <Text style={styles.headerText}>Female</Text>
                                        <Image 
                                            source={{uri: pokemonInfo[formIndex].female}}
                                            style={{width: 150, height: 150}}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.headerText}>Female Shiny</Text>
                                        <Image 
                                            source={{uri: pokemonInfo[formIndex].femaleShiny}}
                                            style={{width: 150, height: 150}}
                                        />
                                    </View>
                                </View>
                            )
                        }
                    </View>
                <View style={styles.line} />
            </>
        );
    }

    const BattleView = () => {
        return (
            <>
                <View style={styles.section}>
                    <Text style={styles.headerText}>Abilites</Text>
                    <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                        {
                            pokemonInfo[formIndex].abilites.map((ability, index) => (
                                <View style={{alignItems: "center"}} key={index}>
                                    <Text style={styles.defaultText}>{formatName(ability.name)}</Text>
                                    {ability.hidden && <Text style={styles.defaultText2}>(Hidden)</Text>}
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View style={styles.line} />
            </>
        );
    }

    return (
        <View>
            <Pressable onPress={ () => {
                handleModalOpen()
                setIsVisible(true)
            }}>
                {children}
            </Pressable>
            <Modal
                visible={isVisible}
                onRequestClose={() => {
                    setFormIndex(0)
                    setIsVisible(false)
                }}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <LinearGradient 
                    style={styles.header}
                    colors={[
                        pokemonInfo[0] ? gradientMap[pokemonInfo[formIndex].types[0]] : gradientMap[pokemon.types[0]], 
                        pokemonInfo[0] ? pokemonInfo[formIndex].types.length === 2 ? darkenColor(gradientMap[pokemonInfo[formIndex].types[1]], 0.2) : darkenColor(gradientMap[pokemonInfo[formIndex].types[0]], 0.5)
                                : hasSecondType ? darkenColor(gradientMap[pokemon.types[1]], 0.2) : darkenColor(gradientMap[pokemon.types[0]], 0.5)
                    ]}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    locations={[0.4, 1]}
                >
                    <Text></Text>
                    <Text style={styles.subTitleText}>{pokemon.dexNumber}</Text>
                </LinearGradient>
                <View style={styles.line}/>
                <ScrollView>
                    <LinearGradient 
                        style={styles.bigContainer}
                        colors={[
                            pokemonInfo[0] ? gradientMap[pokemonInfo[formIndex].types[0]] : gradientMap[pokemon.types[0]], 
                            pokemonInfo[0] ? pokemonInfo[formIndex].types.length === 2 ? darkenColor(gradientMap[pokemonInfo[formIndex].types[1]], 0.2) : darkenColor(gradientMap[pokemonInfo[formIndex].types[0]], 0.5)
                                : hasSecondType ? darkenColor(gradientMap[pokemon.types[1]], 0.2) : darkenColor(gradientMap[pokemon.types[0]], 0.5)
                        ]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        locations={[0.2, 1]}
                    >
                        <Swipeable
                            ref={swipeableRef}
                            leftThreshold={threshold}
                            rightThreshold={threshold}
                            renderLeftActions={blankRender}
                            renderRightActions={blankRender}
                            onSwipeableOpen={(direction) => handleOpen(direction)}
                            onSwipeableWillOpen={(direction) => handleSwipe(direction)}
                        >
                            <Image
                                source={{uri: pokemonInfo[formIndex] ? pokemonInfo[formIndex].image : pokemon.image}}
                                style={{width: 200, height: 200, marginTop: 40, marginBottom: 10, alignSelf: "center"}}
                            />
                            <Text style={styles.titleText}>{pokemonInfo[0] ? formatName(pokemonInfo[formIndex].name) : pokemon.name }</Text>
                            <Text style={styles.subTitleText}>Types</Text>
                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[pokemonInfo[0] ? pokemonInfo[formIndex].types[0] : pokemon.types[0]]}]}>
                                    <IconTypeMapper type={pokemonInfo[0] ? pokemonInfo[formIndex].types[0] : pokemon.types[0]} width={32} height={32} fill="white"/>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.typeIconText}>{pokemonInfo[0] ? pokemonInfo[formIndex].types[0].toUpperCase() : pokemon.types[0].toUpperCase()}</Text>
                                    </View>
                                </View>
                                    {
                                        ((pokemonInfo[0] && pokemonInfo[formIndex].types.length === 2) || (!pokemonInfo[0] && hasSecondType)) && (
                                            <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[pokemonInfo[0] ? pokemonInfo[formIndex].types[1] : pokemon.types[1]]}]}>
                                                <IconTypeMapper type={pokemonInfo[0] ? pokemonInfo[formIndex].types[1] : pokemon.types[1]} width={32} height={32} fill="white"/>
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.typeIconText}>{pokemonInfo[0] ? pokemonInfo[formIndex].types[1].toUpperCase() : pokemon.types[1].toUpperCase()}</Text>
                                                </View>
                                            </View>
                                        )
                                    }
                            </View>
                        </Swipeable>
                    </LinearGradient>
                    <View style={styles.line}/>
                    {
                        pokemonInfo[0] && (
                            <>
                                <GeneralView />
                            </>
                        )
                    }
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        width: '100%',
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#909090',
        width: '100%',
    },
    bigContainer: {
        height: 400
    },
    typeContainter: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        width: 110,
        height: 25,
        marginVertical: 10,
        marginHorizontal: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: -10
    },
    typeIconText: {
        fontFamily: "Geologica Bold",
        color: "white",
        fontSize: 13,
        textAlign: "center",
    },
    titleText: {
        fontFamily: "Inconsolata Bold",
        color: "white",
        fontSize: 35,
        textAlign: "center"
    },
    subTitleText: {
        fontFamily: "Inconsolata Regular",
        color: "#909090",
        fontSize: 20,
        textAlign: "center"
    },
    section: {
        marginVertical: 26,
        marginHorizontal: 8, 
    },
    headerText: {
        fontFamily: "Inconsolata Regular",
        color: "#909090",
        fontSize: 18,
        marginBottom: 8
    },
    defaultText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 17
    },
    defaultText2: {
        fontFamily: "Inconsolata Regular",
        fontSize: 16
    }
})

export default PokemonModal;