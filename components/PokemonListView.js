import { Text, View, StyleSheet, Image } from "react-native";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import PokemonModal from "./PokemonModal";

const PokemonListView = ({ pokemon }) => {

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

    let hasSecondType = pokemon.types.length === 2;
    return (
        <PokemonModal pokemon={pokemon} hasSecondType={hasSecondType}>
            <LinearGradient 
                style={styles.container}
                colors={[typeToGradientDarkColorMap[pokemon.types[0]], hasSecondType ? darkenColor(typeToGradientDarkColorMap[pokemon.types[1]], 0.2) : darkenColor(typeToGradientDarkColorMap[pokemon.types[0]], 0.5)]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                locations={[0.4, 1]}
            >
                <View style={styles.pokemonContainer}>
                    <Image 
                        source={{uri: pokemon.image}}
                        style={{height: 70, width: 70, marginRight: 10, marginBottom: 10}}
                    />
                    <Text style={styles.numText}>{String(pokemon.dexNumber).padStart(3 ,'0')}</Text>
                    <Text style={styles.nameText}>{formatName(pokemon.name)}</Text>
                </View>
                <View>
                <IconTypeMapper type={pokemon.types[0]} width={40} height={40} fill={typeToColourMap[pokemon.types[0]]}/>
                    {
                        hasSecondType ? <IconTypeMapper type={pokemon.types[1]} width={40} height={40} fill={typeToColourMap[pokemon.types[1]]}/> : <View style={{height: 40, width: 40}}/>
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