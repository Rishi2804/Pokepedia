import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { typeToColourMap, typeToGradientDarkColorMap as gradientMap } from "../maps/typeToColourMap"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import { darkenColor, formatName, formatGameText, formatText, isRegionalVariant, findFormInSpecies, addPrefixTextToNum } from "../global/UtiliyFunctions";
import { gameToColorMap, gameToTextColor } from "../maps/GameToColourMap";
import { genMapUppercase } from "../global/UniversalData";
import { filterEvoChain, sortDexEntries, catergorizeDexEntries } from "../transformers/SpeciesInfoTransformer";
import { BarChart } from "react-native-gifted-charts";
import { State, PanGestureHandler } from 'react-native-gesture-handler';

import { useDexContext } from "./hooks/useDexContext";
import Tabs from "./Tabs";
import { genToColorMap, regionToColorMap } from "../maps/GenToColorMap";

const PokemonModal = ({ children, pokemon, hasSecondType }) => {
    const [isVisible, setIsVisible] = useState(false)
    const { dex, evoChains } = useDexContext()
    const [pokemonInfo, setPokemonInfo] = useState(pokemon.forms)
    const [dexEntries, setDexEntries] = useState(sortDexEntries(pokemon.dexEntries))
    const [evoChain, setEvoChain] = useState([])
    const [formIndex, setFormIndex] = useState(0)

    const swipeableRef = useRef(null);
    const [tab, setTab] = useState(0)
    const fullEvoChain = evoChains.find((chain) => chain.id === pokemon.evolutionChainId).chain
    const data = [ {value: pokemon.forms[formIndex].stats[0].stat, label: "HP", frontColor: "#87d945"}, 
                    {value: pokemon.forms[formIndex].stats[1].stat, label: "Atk", frontColor: "#e9cd49"}, 
                    {value: pokemon.forms[formIndex].stats[2].stat, label: "Def", frontColor: "#d76c2f"}, 
                    {value: pokemon.forms[formIndex].stats[3].stat, label: "Sp Atk", frontColor: "#5ac0eb"}, 
                    {value: pokemon.forms[formIndex].stats[4].stat, label: "Sp Def", frontColor: "#5169d7"}, 
                    {value: pokemon.forms[formIndex].stats[5].stat, label: "Speed", frontColor: "#c334a8"}
                ]
    const bst = pokemon.forms[formIndex].stats[0].stat 
    + pokemon.forms[formIndex].stats[1].stat 
    + pokemon.forms[formIndex].stats[2].stat 
    + pokemon.forms[formIndex].stats[3].stat 
    + pokemon.forms[formIndex].stats[4].stat 
    + pokemon.forms[formIndex].stats[5].stat

    const threshold = Dimensions.get('window').width / 4

    const categorized = catergorizeDexEntries(pokemon.dexEntries, pokemon.regionalDexNumber, pokemon.generation)
    
    const handleSwipe = (dir) => {
        if (dir === "right") {
            const nextIndex = formIndex + 1
            if (nextIndex < pokemon.forms.length) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(0)
            }
        } else {
            const nextIndex = formIndex - 1
            if (nextIndex >= 0) {
                setFormIndex(nextIndex)
            } else {
                setFormIndex(pokemon.forms.length - 1)
            }
        }
    }

    const handleOpen = (dir) => {
        if (dir === "right") {
            const nextIndex = formIndex + 1
            if (nextIndex < pokemon.forms.length) {
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
                setFormIndex(pokemon.forms.length - 1)
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
            <View style={{width: pokemonInfo.length > 1 ? '100%' : 0}} />
        )
    }

    const handleModalOpen = () => {
        
    }

    useEffect(() => {
        if (isRegionalVariant(pokemonInfo[formIndex].name)) {
            if (pokemonInfo[formIndex].name === 'darmanitan-galar-standard' || pokemonInfo[formIndex].name === 'darmanitan-galar-zen') {
                setEvoChain(filterEvoChain(fullEvoChain, 'darmanitan-galar'))
            } else {
                setEvoChain(filterEvoChain(fullEvoChain, pokemonInfo[formIndex].name))
            }
        } else {
            setEvoChain(filterEvoChain(fullEvoChain, pokemon.name))
        }
    }, [formIndex])


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
                <View style={styles.section}>
                    <Text style={styles.headerText}>Gender Ratio</Text>
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <View style={{width: 250, height: 15, borderRadius: 10, flexDirection: "row", backgroundColor: "#d0d0d0", overflow: "hidden"}}>
                            {
                                pokemon.genderRate >= 0 && (
                                    <>
                                    <View style={{width: ((1 - (pokemon.genderRate / 8)) * 100) + '%', height: 15, backgroundColor: "#3b54f6"}} />
                                    <View style={{width: ((pokemon.genderRate / 8) * 100) + '%', height: 15, backgroundColor: "#ee74d8"}} />
                                    </>
                                )
                            }
                        </View>
                        <View style={{width: 250, flexDirection: "row", justifyContent: pokemon.genderRate > 0 ? "space-between" : "space-around"}}>
                            {
                                pokemon.genderRate >= 0 ? (
                                    <>
                                    <Text style={[styles.defaultText2, {color: "#3b54f6"}]}>{((1 - (pokemon.genderRate / 8)) * 100) + '%'} Male</Text>
                                    <Text style={[styles.defaultText2, {color: "#ee74d8"}]}>{((pokemon.genderRate / 8) * 100) + '%'} Female</Text>
                                    </>
                                ) : 
                                (<Text style={[styles.defaultText2, {color: "#808080"}]}>Genderless</Text>)
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                {
                    evoChain.length > 0 && (
                        <>
                        <View style={styles.section}>
                            <Text style={styles.headerText}>Evolution Chain</Text>
                            {
                                evoChain.map((line, index) => {
                                    const fromVariant = isRegionalVariant(line.from)
                                    const toVariant = isRegionalVariant(line.to)
                                    let toImg = ""
                                    let fromImg = ""
                                    if (fromVariant) {
                                        fromImg = findFormInSpecies(dex, line.from).image
                                    } else {
                                        const fromContext = dex.find(pokemon => pokemon.name === line.from)
                                        fromImg = fromContext.image
                                    }
                                    if (toVariant) {
                                        if (line.to === 'darmanitan-galar') toImg = findFormInSpecies(dex, 'darmanitan-galar-standard').image
                                        else toImg = findFormInSpecies(dex, line.to).image
                                    } else {
                                        const toContext = dex.find(pokemon => pokemon.name === line.to)
                                        toImg = toContext.image
                                    }
                                    return (
                                        <View style={{flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}} key={index}>
                                            <Image 
                                                source={{url: fromImg}}
                                                style={{width: 80, height: 80}}
                                            />
                                            <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                                                {line.details.map((detail, index) => {
                                                    let string = detail
                                                    if (!isRegionalVariant(line.from) && isRegionalVariant(line.to)) {
                                                        string += " in " 
                                                        string += formatText(isRegionalVariant(line.to))
                                                    }
                                                    return (<Text style={[styles.defaultText2, {textAlign: "center"}]} key={index}>{string}</Text>)
                                                })}
                                            </View>
                                            <Image 
                                                source={{url: toImg}}
                                                style={{width: 80, height: 80}}
                                            />
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View style={styles.line} />
                        </>
                    )
                }
                <View style={styles.section}>
                    <Text style={styles.headerText}>Pokedex Entries</Text>
                    <View style={{borderWidth: 2, borderColor: "#909090", borderRadius: 8, paddingHorizontal: 1, backgroundColor: "#909090"}}>
                        {
                            categorized.map((genEntires, index) => (
                                <View style={{ marginBottom: 3 }} key={index}>
                                    <View>
                                        <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                                            <View style={{width: 100, alignItems: "center", justifyContent: "center", backgroundColor: genToColorMap.get(pokemon.generation + index), borderTopEndRadius: 8, borderTopStartRadius: 8}}>
                                                <Text style={{fontFamily: "Geologica Regular", textAlign: "center"}}>Generation {genMapUppercase.get(pokemon.generation + index)}</Text>
                                            </View>
                                            <View style={{flexDirection: "row"}}>
                                                {
                                                    genEntires.dexNumbers.map((dexEntry, numIndex) => (
                                                        <View style={{alignItems: "center", paddingHorizontal: 2, marginHorizontal: 2, backgroundColor: regionToColorMap.get(dexEntry.name), borderTopEndRadius: 8, borderTopStartRadius: 8}} key={numIndex}>
                                                            <Text style={styles.defaultText3}>{formatText(dexEntry.name)}</Text>
                                                            <Text style={styles.defaultText3}>{addPrefixTextToNum(numIndex, genEntires.dexNumbers)} #{dexEntry.number ? String(dexEntry.number).padStart(3, '0') : "---"}</Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                        <View style={{borderWidth: 2, borderColor: genToColorMap.get(pokemon.generation + index), borderBottomRightRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#fff", paddingHorizontal: 2}}>
                                        {
                                            genEntires.entries.length > 0 ? genEntires.entries.map((entry, entryIndex) => (
                                                <View style={{flexDirection: "row", borderColor: "black", borderWidth: 1, borderRadius: 8, marginBottom: 2, marginTop: entryIndex === 0 ? 2 : 0 }} key={entryIndex}>
                                                    <View style={{backgroundColor: gameToColorMap[entry.game] ? gameToColorMap[entry.game] : "#fff", width: 72, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderRightWidth: 1}}>
                                                        <Text style={{textAlign: "center", fontFamily: "Geologica Regular", color: gameToTextColor[entry.game] ? gameToTextColor[entry.game] : "#000"}}>{formatGameText(entry.game)}</Text>
                                                    </View>
                                                    <View style={{flex: 1, backgroundColor: "#fff", borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
                                                        <Text style={styles.defaultText2}>{entry.entry}</Text>
                                                    </View>
                                                </View>
                                            )) : 
                                            <View style={{flex: 1, backgroundColor: "#fff", borderRadius: 8, padding: 8, alignItems: "center"}}>
                                                <Text style={styles.defaultText2}>No Dex Entries found</Text>
                                            </View>
                                        }
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
                            pokemonInfo[formIndex].abilities.map((ability, index) => (
                                <View style={{alignItems: "center"}} key={index}>
                                    <Text style={styles.defaultText}>{formatText(ability.name)}</Text>
                                    {ability.hidden && <Text style={styles.defaultText2}>(Hidden)</Text>}
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View style={styles.line} />
                {pokemon.forms[formIndex].past_abilites.length > 0 && 
                    <>
                    <View style={styles.section}>
                        <Text style={styles.headerText}>Past Abilities</Text>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                            {
                                pokemon.forms[formIndex].past_abilites.map((ability, index) => (
                                        <View style={{alignItems: "center"}} key={index}>
                                            <Text style={styles.defaultText}>{formatText(ability.name)}</Text>
                                            {ability.hidden && <Text style={styles.defaultText2}>(Hidden)</Text>}
                                            <Text style={styles.defaultText2}>(Gen {genMapUppercase.get(ability.generation)} and before)</Text>
                                        </View>
                                    )
                                )
                            }
                        </View>
                    </View>
                    <View style={styles.line} />
                    </>
                }
                <View style={styles.section}>
                    <Text style={styles.headerText}>Base Stats</Text>
                    <View style={{marginTop: -50}}>
                        <BarChart 
                            data={data} 
                            horizontal 
                            dashWidth={0} 
                            height={265}
                            barWidth={35}
                            width={Dimensions.get("window").width - 90}
                            barBorderRadius={6}
                            spacing={5}
                            hideYAxisText={true}
                            maxValue={265}
                            initialSpacing={30}
                            yAxisIndicesWidth={0}
                            disablePress={true}
                            disableScroll={true}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            showValuesAsTopLabel={true}
                            topLabelTextStyle={styles.defaultText2}
                            xAxisLabelTextStyle={styles.defaultText2}
                        />
                    </View>
                    <Text style={[styles.defaultText, {marginLeft: 20, marginTop: -20}]}>Base Stat Total: {bst}</Text>
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
                    <Text style={styles.subTitleText}>{pokemon.id}</Text>
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
                        <Tabs tabText={["General", "Battle"]} tab={tab} setTab={setTab}/>
                    </LinearGradient>
                    <View style={styles.line}/>
                    {
                        pokemonInfo[0] && (
                            <>
                                {tab === 0 && <GeneralView />}
                                {tab === 1 && <BattleView />}
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
        height: 405
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
    },
    defaultText3: {
        fontFamily: "Inconsolata Regular",
        fontSize: 14
    }
})

export default PokemonModal;