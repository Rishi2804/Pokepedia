import { useEffect } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";

const Pokedex = () => {
    const  { dex: pokemon } = useDexContext()
    
    return (
        <SafeAreaView>
            <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} key={item.dexNumber} />
                        )
                    }}
                    ItemSeparatorComponent={<View style={{height: 5}}/>}
                    keyExtractor={(item) => item.dexNumber}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 10
    }
})

export default Pokedex;