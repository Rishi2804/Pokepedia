import { Text, View, StyleSheet, Image } from "react-native";
import { typeToColourMap, typeToGradientDarkColorMap } from "../maps/typeToColourMap";
import IconTypeMapper from "../maps/typeToIconMap";
import { LinearGradient } from 'expo-linear-gradient'
import PokemonModal from "./PokemonModal";
import { darkenColor, formatName } from "../global/UtiliyFunctions";

const PokemonGridView = ({ pokemon, dexRegion }) => {

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
                <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                    <View style={{flexDirection: "row"}}>
                        <IconTypeMapper type={pokemon.types[0]} width={20} height={20} fill="#fff"/>
                            {
                                hasSecondType && <IconTypeMapper type={pokemon.types[1]} width={20} height={20} fill="#fff"/>
                            }
                    </View>
                    <Text style={styles.numText}>{pokemon.regionalDexNumber.find(entry => entry.name === dexRegion) ? String(pokemon.regionalDexNumber.find(entry => entry.name === dexRegion).number).padStart(3 ,'0') : String(pokemon.id).padStart(3, '0')}</Text>
                </View>
                <Image 
                    source={{uri: pokemon.image}}
                    style={{height: 110, width: 110, marginBottom: 10}}
                />
            </LinearGradient>
        </PokemonModal>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
    },
    nameText: {
        color: "#fff",
        fontFamily: "Inconsolata Regular",
        fontSize: 20
    },
    numText: {
        color: "#909090",
        fontFamily: "Inconsolata Regular",
        fontSize: 15,
        marginRight: 10
    }
})

export default PokemonGridView;