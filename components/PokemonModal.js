import { useEffect, useState } from "react";
import { Modal, Pressable, View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { typeToColourMap, typeToGradientDarkColorMap as gradientMap } from "../maps/typeToColourMap"
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'

const PokemonModal = ({ children, pokemon, hasSecondType }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [pokemonInfo, setPokemonInfo] = useState([])
    const [dexEntries, setDexEntries] = useState([])
    const [formIndex, setFormIndex] = useState(0)
    const [fetched, setFetched] = useState(false)

    function fixFlavourText(str) {
        return str.replace(/\f/g, '\n')  // Replace form feed with newline
                  .replace(/\u00ad\n/g, '')  // Replace soft hyphen followed by newline with nothing
                  .replace(/\u00ad/g, '')    // Replace standalone soft hyphen with nothing
                  .replace(/ -\n/g, ' - ')   // Replace hyphen followed by newline with hyphen and space
                  .replace(/-\n/g, '- ')     // Replace hyphen followed by newline with hyphen and space
                  .replace(/(\s*\n)+/g, ' ');      // Replace newline with space
    }

    function darkenColor(color, darkeningFactor) {
        // Convert hex color to RGB
        var r = parseInt(color.substring(1, 3), 16);
        var g = parseInt(color.substring(3, 5), 16);
        var b = parseInt(color.substring(5, 7), 16);
    
        var newR = Math.max(0, Math.floor(r * (1 - darkeningFactor)));
        var newG = Math.max(0, Math.floor(g * (1 - darkeningFactor)));
        var newB = Math.max(0, Math.floor(b * (1 - darkeningFactor)));
    
        // Convert RGB back to hex
        var newColor = "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
    
        return newColor;
    }

    function formatName(name) {
        // Split the name by dash
        let words = name.split('-');
    
        // Capitalize the first letter of each word
        words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    
        // Join the words with space
        let formattedName = words.join(' ');
    
        return formattedName;
    }

    const fetchDataAlt = async () => {
        const dexFormat = (data) => {
            const dexFiltered = data.flavor_text_entries.filter((entry) => entry.language.name === 'en')
            const dexEntries = dexFiltered.map((entry) => {
                return {
                    entry: fixFlavourText(entry.flavor_text),
                    game: entry.version.name
                }
            })
            return dexEntries
        }

        //console.log("start")
        const dexResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)

        const dexData = await dexResponse.json()

        const formRawData = []
        for (const form of dexData.varieties) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${form.pokemon.name}`)
            const json = await response.json()
            formRawData.push(json)
        }

        if (dexResponse.ok) {
            const dexEntries = dexFormat(dexData)
            const formData = []
            for (const json of formRawData) {
                const types = json.types.map((item) => item.type.name)
                const stats = json.stats.map((item) => {
                    return {
                        name: item.stat.name,
                        stat: item.base_stat
                    }
                })
                const abilites = json.abilities.map((item) => {
                    return {
                        name: item.ability.name,
                        hidden: item.is_hidden
                    }
                })
                const height = (json.height / 10).toFixed(1)
                const weight = (json.weight / 10).toFixed(2)
                formData.push({
                    name: json.name,
                    types: types,
                    image: json.sprites.other.home.front_default,
                    female: json.sprites.other.home.front_female,
                    shiny: json.sprites.other.home.front_shiny,
                    femaleShiny: json.sprites.other.home.front_shiny_female,
                    abilites: abilites,
                    weight: weight,
                    height: height,
                    stats: stats
                })
            }
            setDexEntries(dexEntries)
            setPokemonInfo(formData)
            //console.log("end")
        }
    }

    return (
        <View>
            <Pressable onPress={ () => {
                if (!fetched) fetchDataAlt()
                setIsVisible(true)
            }}>
                {children}
            </Pressable>
            <Modal
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <LinearGradient 
                    style={styles.header}
                    colors={[
                        pokemonInfo[0] ? gradientMap[pokemonInfo[formIndex].types[0]] : gradientMap[pokemon.types[0]], 
                        hasSecondType ? pokemonInfo[0] ? darkenColor(gradientMap[pokemonInfo[formIndex].types[1]], 0.2) : darkenColor(gradientMap[pokemon.types[1]], 0.2)
                            : pokemonInfo[0] ? darkenColor(gradientMap[pokemonInfo[formIndex].types[0]], 0.5) : darkenColor(gradientMap[pokemon.types[0]], 0.5)
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
                            hasSecondType ? pokemonInfo[0] ? darkenColor(gradientMap[pokemonInfo[formIndex].types[1]], 0.2) : darkenColor(gradientMap[pokemon.types[1]], 0.2)
                                : pokemonInfo[0] ? darkenColor(gradientMap[pokemonInfo[formIndex].types[0]], 0.5) : darkenColor(gradientMap[pokemon.types[0]], 0.5)
                        ]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        locations={[0.2, 1]}
                    >
                        <Image 
                            source={{uri: pokemonInfo[formIndex] ? pokemonInfo[formIndex].image : pokemon.image}}
                            style={{width: 200, height: 200, marginTop: 40, marginBottom: 10}}
                        />
                        <Text style={styles.titleText}>{pokemonInfo[0] ? formatName(pokemonInfo[formIndex].name) : pokemon.name }</Text>
                        <Text style={styles.subTitleText}>Types</Text>
                        <View style={{flexDirection: "row"}}>
                        <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[pokemonInfo[0] ? pokemonInfo[formIndex].types[0] : pokemon.types[0]]}]}>
                            <IconTypeMapper type={pokemonInfo[0] ? pokemonInfo[formIndex].types[0] : pokemon.types[0]} width={32} height={32} fill="white"/>
                            <View style={styles.textContainer}>
                                <Text style={styles.typeIconText}>{pokemonInfo[0] ? pokemonInfo[formIndex].types[0].toUpperCase() : pokemon.types[0].toUpperCase()}</Text>
                            </View>
                        </View>
                            {
                                hasSecondType && (
                                    <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[pokemonInfo[0] ? pokemonInfo[formIndex].types[1] : pokemon.types[1]]}]}>
                                        <IconTypeMapper type={pokemonInfo[0] ? pokemonInfo[formIndex].types[1] : pokemon.types[1]} width={32} height={32} fill="white"/>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.typeIconText}>{pokemonInfo[0] ? pokemonInfo[formIndex].types[1].toUpperCase() : pokemon.types[1].toUpperCase()}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </LinearGradient>
                    <View style={styles.line}/>
                    {
                        pokemonInfo[0] && (
                            <>
                                <View style={styles.section}>
                                    <Text style={styles.headerText}>Abilites</Text>
                                    <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                                        {
                                            pokemonInfo[formIndex].abilites.map((ability) => (
                                                <View style={{alignItems: "center"}}>
                                                    <Text style={styles.defaultText}>{formatName(ability.name)}</Text>
                                                    {ability.hidden && <Text style={styles.defaultText2}>(Hidden)</Text>}
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                                <View style={styles.line} />
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
                                    <Text style={styles.headerText}>Pokedex Entries</Text>
                                    {
                                        dexEntries.map((entry) => (
                                            <View style={{backgroundColor: "lightblue", marginHorizontal: 8, borderWidth: 3,}}>
                                                <View style={{flexDirection: "row"}}>
                                                    <View style={{backgroundColor: "dodgerblue", borderTopRightRadius: 8, borderTopBottomRadius: 8, width: 70, alignItems: "center", justifyContent: "center"}}>
                                                        <Text>{entry.game}</Text>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <Text style={{textAlign: "left"}}>{entry.entry}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))
                                    }
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
        height: 400,
        alignItems: "center"
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
        fontSize: 35
    },
    subTitleText: {
        fontFamily: "Inconsolata Regular",
        color: "#909090",
        fontSize: 20
    },
    section: {
        marginVertical: 26
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