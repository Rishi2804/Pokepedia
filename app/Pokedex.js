import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";

const Pokedex = () => {
    const [ loading, setLoading ] = useState(false)
    const  { dex } = useDexContext()
    const [ pokemon, setPokemon ] = useState(dex)
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")

    useEffect(() => {
        if (selected === 0) {
            if (state === 1) {
                setPokemon([...pokemon].sort((a, b) => a.dexNumber - b.dexNumber))
            } else if (state === 2) {
                setPokemon([...pokemon].sort((a, b) => b.dexNumber - a.dexNumber))
            }
        } else if (selected === 1) {
            if (state === 1) {
                setPokemon([...pokemon].sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                }))
            } else if (state === 2) {
                setPokemon([...pokemon].sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1; 
                    }
                    return 0;
                }))
            }
        }
    }, [state, selected])

    useEffect(() => {
        const regex = new RegExp(searchTerm, 'i')
        const searchResults = dex.filter(pokemon => regex.test(pokemon.name))
        setPokemon(searchResults)
    }, [searchTerm])

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "space-between"}}>
            {!loading && <View style={styles.scrollContainer}>
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
            </View>}
            <BottomFilters 
                state={state} setState={setState}
                selected={selected} setSelected={setSelected}
                setSearchTerm={setSearchTerm}
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