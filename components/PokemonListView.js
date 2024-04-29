import { Text, View, StyleSheet, Image } from "react-native";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import PokemonModal from "./PokemonModal";
import { darkenColor, formatName } from "../global/UtiliyFunctions";
import { useState } from "react";

const PokemonListView = ({ pokemon, dexRegion, displayForm }) => {
    const [ formDisplay, setFormDisplay ] = useState((displayForm && pokemon.forms[displayForm]) ? displayForm : 0)
    let hasSecondType = pokemon.forms[formDisplay].types.length === 2;
    const type1 = pokemon.forms[formDisplay].types[0]
    const type2 = pokemon.forms[formDisplay].types[1]

    const changeDisplay = () => {
        if (pokemon.forms.length > 0) {
            const nextIndex = formDisplay + 1
            if (nextIndex >= pokemon.forms.length) {
                setFormDisplay(0)
            } else {
                setFormDisplay(nextIndex)
            }
        }
    }

    return (
        <PokemonModal pokemon={pokemon} startingFormIndex={formDisplay} hasSecondType={hasSecondType} longPress={changeDisplay}>
            <LinearGradient 
                style={styles.container}
                colors={[typeToGradientDarkColorMap[type1], hasSecondType ? darkenColor(typeToGradientDarkColorMap[type2], 0.2) : darkenColor(typeToGradientDarkColorMap[type1], 0.5)]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                locations={[0.4, 1]}
            >
                <View style={styles.pokemonContainer}>
                    <Image 
                        source={{uri: pokemon.forms[formDisplay] ? pokemon.forms[formDisplay].image : pokemon.image}}
                        style={{height: 70, width: 70, marginRight: 10, marginBottom: 10}}
                    />
                    <Text style={styles.numText}>{pokemon.regionalDexNumber.find(entry => entry.name === dexRegion) ? String(pokemon.regionalDexNumber.find(entry => entry.name === dexRegion).number).padStart(3 ,'0') : String(pokemon.id).padStart(3, '0')}</Text>
                    <Text style={styles.nameText}>{formatName(pokemon.name)}</Text>
                </View>
                <View>
                <IconTypeMapper type={type1} width={40} height={40} fill={typeToColourMap[type1]}/>
                    {
                        hasSecondType ? <IconTypeMapper type={type2} width={40} height={40} fill={typeToColourMap[type2]}/> : <View style={{height: 40, width: 40}}/>
                    }
                </View>
            </LinearGradient>
        </PokemonModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: "space-between"
    },
    pokemonContainer: {
        flexDirection:"row",
        alignItems: "center",
    },
    nameText: {
        color: "#fff",
        fontFamily: "Inconsolata Regular",
        fontSize: 20
    },
    numText: {
        color: "#909090",
        fontFamily: "Inconsolata Regular",
        fontSize: 20,
        marginRight: 10
    }
})

export default PokemonListView;