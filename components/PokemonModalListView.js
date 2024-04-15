import { Text, View, StyleSheet } from "react-native";
// import GrassIcon from '../assets/type-icons/grass-icon.svg'

const PokemonModalListView = ({ pokemon }) => {
    return (
        <View style={styles.container}>
            <View style={styles.pokemonContainer}>
                <Text>{pokemon.dexNumber}</Text>
                <Text>{pokemon.name}</Text>
                {/* <GrassIcon height={200} width={200} /> */}
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