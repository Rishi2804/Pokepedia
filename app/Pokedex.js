import { useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";

const Pokedex = () => {
    const  { dex: pokemon } = useDexContext()
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)

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
                    contentContainerStyle={{paddingBottom: 60}}
                    keyExtractor={(item) => item.dexNumber}
                />
            </View>
            <BottomFilters 
                state={state} setState={setState}
                selected={selected} setSelected={setSelected}
                options={["Number", "Name", "HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed"]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 10
    }
})

export default Pokedex;