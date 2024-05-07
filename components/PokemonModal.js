import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { typeToColourMap, typeToGradientDarkColorMap as gradientMap } from "../maps/typeToColourMap"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from "@expo/vector-icons"
import Dropdown from 'react-native-input-select';
import { darkenColor, formatName, formatGameText, formatText, isRegionalVariant, findFormInSpecies, addPrefixTextToNum, getTypeMatchups, transformMoves } from "../global/UtiliyFunctions";
import { gameToColorMap, gameToTextColor } from "../maps/GameToColourMap";
import { genMapUppercase } from "../global/UniversalData";
import { filterEvoChain, catergorizeDexEntries } from "../transformers/SpeciesInfoTransformer";
import { BarChart } from "react-native-gifted-charts";
import { versionGroupFull } from "../maps/VersionGroupMap";
import InView from 'react-native-component-inview'

import { useDexContext } from "./hooks/useDexContext";
import { useMovesContext } from "./hooks/useMovesContext";
import Tabs from "./Tabs";
import MovesView from "./MovesView"
import { genToColorMap, regionToColorMap } from "../maps/GenToColorMap";
import { useAbilitiesContext } from "./hooks/useAbilitiesContext";
import AbilitiesModal from "./AbilitiesModal";
import { useThemeContext } from "./hooks/useThemeContext";

const PokemonModal = ({ children, pokemon, startingFormIndex, hasSecondType, longPress }) => {
    if (pokemon === undefined || pokemon.forms[startingFormIndex] === undefined) {
        return
    }
    const { theme } = useThemeContext()
    const [isVisible, setIsVisible] = useState(false)
    const { dex, evoChains } = useDexContext()
    const { moves } = useMovesContext()
    const { abilities } = useAbilitiesContext()
    const [pokemonInfo, setPokemonInfo] = useState(pokemon.forms)
    const [evoChain, setEvoChain] = useState([])
    const [ startInView, setStartInView] = useState(true)
    const [formIndex, setFormIndex] = useState(startingFormIndex)
    const [ pokemonMoves, setPokemonMoves ] = useState([])
    const [ versionMoveSet, setVersionMoveSet ] = useState(0)
    const [ moveTab, setMoveTab ] = useState("level-up")
    
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
    
    const themeSetting1 = theme.mode === "dark" ? "#fff" : "#000"
    const themeSetting2 = theme.mode === "dark" ? "#fff" : "#000"
    const themeSetting3 = theme.mode === "dark" ? "#0c0c0c" : "#fff"
    
    const handleSwipe = (dir) => {
        setMoveTab("level-up")
        setVersionMoveSet(0)
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
        const moveList = pokemon.forms.map(form => transformMoves(form.moves))
        if (pokemonMoves.length === 0) setPokemonMoves(moveList)
        setVersionMoveSet(moveList.length - 1)
    }

    useEffect(() => {
        if (isRegionalVariant(pokemonInfo[formIndex].name)) {
            if (pokemonInfo[formIndex].name === 'darmanitan-galar-zen') {
                setEvoChain(filterEvoChain(fullEvoChain, 'darmanitan-galar-standard'))
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
                            <Text style={[styles.defaultText, {color: themeSetting2}]}>{pokemonInfo[formIndex].weight} kg</Text>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.headerText}>Height</Text>
                            <Text style={[styles.defaultText, {color: themeSetting2}]}>{pokemonInfo[formIndex].height} m</Text>
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
                                    let fromContext = {}
                                    let fromIndex = 0
                                    let toContext = {}
                                    let toIndex = 0
                                    if (fromVariant) {
                                        fromImg = findFormInSpecies(dex, line.from).image
                                        fromContext = dex.find(pokemon => pokemon.forms.map(form => form.name).includes(line.from))
                                        fromIndex = fromContext.forms.findIndex(form => form.name === line.from)
                                    } else {
                                        fromContext = dex.find(pokemon => pokemon.name === line.from)
                                        fromImg = fromContext.image
                                    }
                                    if (toVariant) {
                                        toImg = findFormInSpecies(dex, line.to).image
                                        toContext = dex.find(pokemon => pokemon.forms.map(form => form.name).includes(line.to))
                                        toIndex = toContext.forms.findIndex(form => form.name === line.to)
                                    } else {
                                        toContext = dex.find(pokemon => pokemon.name === line.to)
                                        toImg = toContext.image
                                    }
                                    return (
                                        <View style={{flexDirection: "row", justifyContent: "space-between", paddingVertical: 10}} key={index}>
                                            <PokemonModal pokemon={fromContext} startingFormIndex={fromIndex} hasSecondType={false} longPress={() => {}}>
                                                <Image 
                                                    source={{url: fromImg}}
                                                    style={{width: 80, height: 80}}
                                                />
                                            </PokemonModal>
                                            <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                                                {line.details.map((detail, index) => {
                                                    let string = detail
                                                    if (!isRegionalVariant(line.from) && isRegionalVariant(line.to)) {
                                                        string += " in " 
                                                        string += formatText(isRegionalVariant(line.to))
                                                    }
                                                    return (<Text style={[styles.defaultText2, {textAlign: "center", color: themeSetting2}]} key={index}>{string}</Text>)
                                                })}
                                            </View>
                                            <PokemonModal pokemon={toContext} startingFormIndex={toIndex} hasSecondType={false} longPress={() => {}}>
                                                <Image 
                                                    source={{url: toImg}}
                                                    style={{width: 80, height: 80}}
                                                />
                                            </PokemonModal>
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
                    <View style={{borderWidth: 2, borderColor: theme.mode === "dark" ? "#42424a" : "#909090", borderRadius: 8, paddingHorizontal: 1, backgroundColor: theme.mode === "dark" ? "#42424a" : "#909090"}}>
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
                                        <View style={{borderWidth: 2, borderColor: genToColorMap.get(pokemon.generation + index), borderBottomRightRadius: 8, borderBottomLeftRadius: 8, backgroundColor: themeSetting3, paddingHorizontal: 2}}>
                                        {
                                            genEntires.entries.length > 0 ? genEntires.entries.map((entry, entryIndex) => (
                                                <View style={{flexDirection: "row", borderColor: themeSetting1, borderWidth: 1, borderRadius: 8, marginBottom: 2, marginTop: entryIndex === 0 ? 2 : 0 }} key={entryIndex}>
                                                    <View style={{backgroundColor: gameToColorMap[entry.game] ? gameToColorMap[entry.game] : "#fff", width: 72, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderRightWidth: 1, borderColor: themeSetting1}}>
                                                        <Text style={{textAlign: "center", fontFamily: "Geologica Regular", color: gameToTextColor[entry.game] ? gameToTextColor[entry.game] : "#000"}}>{formatGameText(entry.game)}</Text>
                                                    </View>
                                                    <View style={{flex: 1, backgroundColor: themeSetting3, borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
                                                        <Text style={[styles.defaultText2, {color: themeSetting2}]}>{entry.entry}</Text>
                                                    </View>
                                                </View>
                                            )) : 
                                            <View style={{flex: 1, backgroundColor: themeSetting3, borderRadius: 8, padding: 8, alignItems: "center"}}>
                                                <Text style={[styles.defaultText2, {color: themeSetting2}]}>No Dex Entries found</Text>
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
                <View style={{height: 50}} />
            </>
        );
    }

    const typeRelations = getTypeMatchups(pokemon.forms[formIndex].types)
    const BattleView = () => {
        return (
            <>
                <View style={styles.section}>
                    <Text style={styles.headerText}>Abilites</Text>
                    <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                        {
                            pokemonInfo[formIndex].abilities.map((ability, index) => {
                                const context = abilities.find(item => item.name === ability.name)
                                return (
                                    <AbilitiesModal ability={context} key={index}>
                                        <View style={{alignItems: "center"}}>
                                            <Text style={[styles.defaultText, {color: themeSetting2}]}>{formatText(ability.name)}</Text>
                                            {ability.hidden && <Text style={[styles.defaultText2, {color: themeSetting2}]}>(Hidden)</Text>}
                                        </View>
                                    </AbilitiesModal>
                                )})
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
                                            <Text style={[styles.defaultText, {color: themeSetting2}]}>{formatText(ability.name)}</Text>
                                            {ability.hidden && <Text style={[styles.defaultText2, {color: themeSetting2}]}>(Hidden)</Text>}
                                            <Text style={[styles.defaultText2, {color: themeSetting2}]}>(Gen {genMapUppercase.get(ability.generation)} and before)</Text>
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
                    <Text style={styles.headerText}>Weaknesses</Text>
                    <View>
                        {
                            typeRelations.doubleWeakness.length > 0 &&
                            <View style={{flexDirection: "row", marginBottom: 5}}>
                                <View style={[styles.typeInfoContainer, {borderColor: "#eb5545"}]}>
                                    <Text style={{fontFamily: "Inconsolata Regular", fontSize: 25, color: themeSetting2}}>x4</Text>
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
                                    <Text style={{fontFamily: "Inconsolata Regular", fontSize: 25, color: themeSetting2}}>x2</Text>
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
                    <Text style={styles.headerText}>Resistances</Text>
                    {
                        typeRelations.resistances.length > 0 &&
                        <View style={{flexDirection: "row", marginBottom: 5}}>
                            <View style={[styles.typeInfoContainer, {borderColor: "#68c367"}]}>
                                <Text style={{fontFamily: "Inconsolata Regular", fontSize: 25, color: themeSetting2}}>x1/2</Text>
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
                                <Text style={{fontFamily: "Inconsolata Regular", fontSize: 25, color: themeSetting2}}>x1/4</Text>
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
                                <Text style={{fontFamily: "Inconsolata Regular", fontSize: 25, color: themeSetting2}}>x0</Text>
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
                </View>
                <View style={styles.line} />
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
                            topLabelTextStyle={[styles.defaultText2, {color: themeSetting2}]}
                            xAxisLabelTextStyle={[styles.defaultText2, {color: themeSetting2}]}
                        />
                    </View>
                    <Text style={[styles.defaultText, {marginLeft: 20, marginTop: -20, color: themeSetting2}]}>Base Stat Total: {bst}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.section}>
                    <Text style={styles.headerText}>Moves</Text>
                    <Dropdown
                        label="Version Group"
                        placeholder=""
                        options={pokemonMoves[formIndex].map((list, index) => {return {label: versionGroupFull[list.version], value: index}})}
                        selectedValue={versionMoveSet}
                        dropdownStyle={{paddingRight: 50, borderColor: themeSetting2, backgroundColor: themeSetting3}}
                        placeholderStyle={{color: themeSetting2}}
                        selectedItemStyle={{color: themeSetting2}}
                        dropdownIcon={<AntDesign name="down" size={20} color={themeSetting2} />}
                        dropdownIconStyle={{top: 20}}
                        modalControls={{
                            modalOptionsContainerStyle: {
                                backgroundColor: themeSetting3
                            }
                        }}
                        checkboxControls={{
                            checkboxLabelStyle: {
                                color: themeSetting2
                            },
                            checkboxStyle: {
                                borderColor: themeSetting2
                            },
                        }}
                        onValueChange={(value) => {
                            if (value) {
                                setVersionMoveSet(value)
                                setMoveTab("level-up")
                            } else {
                                setVersionMoveSet(0)
                                setMoveTab("level-up")
                            }
                        }}
                    />
                    <Dropdown
                        label="Learn Method"
                        placeholder=""
                        options={pokemonMoves[formIndex][versionMoveSet] ? Object.keys(pokemonMoves[formIndex][versionMoveSet]).filter(item => item !== "version").map(method => {return{label: formatText(method), value: method}}) : []}
                        selectedValue={moveTab}
                        dropdownStyle={{paddingRight: 50, borderColor: themeSetting2, backgroundColor: themeSetting3}}
                        placeholderStyle={{color: themeSetting2}}
                        selectedItemStyle={{color: themeSetting2}}
                        dropdownIcon={<AntDesign name="down" size={20} color={themeSetting2} />}
                        modalControls={{
                            modalOptionsContainerStyle: {
                                backgroundColor: themeSetting3
                            }
                        }}
                        checkboxControls={{
                            checkboxLabelStyle: {
                                color: themeSetting2
                            },
                            checkboxStyle: {
                                borderColor: themeSetting2
                            },
                        }}
                        onValueChange={(value) => {
                            if (value) {
                                setMoveTab(value)
                            } else {
                                setMoveTab("level-up")
                            }
                        }}
                    />
                    {
                        pokemonMoves[formIndex][versionMoveSet] && pokemonMoves[formIndex][versionMoveSet][moveTab].map((move, index) => {
                            const moveInfo = moves.find(item => item.name === move.name)
                            if (moveInfo) {
                                return (
                                    <View key={index}>
                                        <MovesView move={moveInfo} level={move.level_learned} versionGroup={pokemonMoves[formIndex][versionMoveSet].version}/>
                                        <View style={{height: index === pokemonMoves[formIndex][versionMoveSet][moveTab].length - 1 ? 50 : 5}}/>
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            </>
        );
    }

    return (
        <View>
            <Pressable 
                onPress={ () => {
                    handleModalOpen()
                    setIsVisible(true)
                }} 
                onLongPress={() => longPress()}
            >
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
                <View style={{backgroundColor: themeSetting3}}>
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
                    <View style={{justifyContent: "space-between", alignItems: "center", flexDirection :"row", flex: 1, width: '100%'}}>
                        <Text style={[styles.titleText, {fontSize: 28}]}>{!startInView && formatName(pokemon.forms[formIndex].name)}</Text>
                        <Text style={styles.subTitleText}>{String(pokemon.id).padStart(4, '0')}</Text>
                    </View>
                </LinearGradient>
                <View style={styles.line}/>
                <ScrollView>
                    <InView onChange={(isVisible) => setStartInView(isVisible)}>
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
                    </InView>
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
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        width: '100%',
        alignItems: "center",
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
    },
    typeInfoContainer: {
        width: 80,
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        marginRight: 3,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default PokemonModal;