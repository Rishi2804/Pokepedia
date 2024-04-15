import { Text, View, StyleSheet } from "react-native";
import FireIcon from '../assets/type-icons/fire-icon.svg'

const PokemonModalListView = ({ pokemon }) => {
    return (
        <View style={styles.container}>
            <View style={styles.pokemonContainer}>
                <Text>{String(pokemon.dexNumber).padStart(3 ,'0')}</Text>
                <Text>{pokemon.name}</Text>
                <FireIcon height={40} width={40} fill="black"/>
            </View>
            <View>
                <Text>{pokemon.types[0]}</Text>
                {
                    pokemon.types[1] && <Text>{pokemon.types[1]}</Text>
                }
            </View>
        </View>
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
        alignItems: "center"
    },
    typeContainer: {

    }
})

export default PokemonModalListView;