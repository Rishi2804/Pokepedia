import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { dexes, types } from "../global/UniversalData";
import { formatText } from "../global/UtiliyFunctions";

const Pokedex = () => {
    const [ loading, setLoading ] = useState(false)
    const  { dex } = useDexContext()
    const [ pokemon, setPokemon ] = useState(dex)
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ filterTypes, setFilterTypes] = useState([])
    const [ dexType, setDexType ] = useState("")

    useEffect(() => {
        if (selected === 0) {
            if (state === 1) {
                setPokemon([...pokemon].sort((a, b) => a.id - b.id))
            } else if (state === 2) {
                setPokemon([...pokemon].sort((a, b) => b.id - a.id))
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

    // useEffect(() => {
    //     if (filterTypes.length > 0) setPokemon([...pokemon].filter((item) => item.types.some((type) => filterTypes.some(index => types[index].name === type))))
    // }, [filterTypes])

    // useEffect(() => {
    //     console.log(dexes[dexType])
    //     if (dexType.length > 0){
    //         if (dexType === 'national') {
    //             setPokemon(dex)
    //         } else {
    //             setPokemon([...pokemon].filter((item) => item.regionalDexNumbers.some((dex) => dexType.includes(index => dexes[index] === dex.name))))
    //         }
    //     } 
    // }, [dexType])

    return (
        <SafeAreaView style={{flex: 1}}>
            <View >
                <SelectList 
                    data={dexes.map((item, index) => {return{key: index, value: formatText(item)}})} 
                    save="key"
                    setSelected={(key) => setDexType(key)}
                />
                <MultipleSelectList 
                    data={types.map((item, index) => {return{key: index, value: item.name}})} 
                    save="key"
                    setSelected={(key) => setFilterTypes(key)}
                    label="Types"
                />
            </View>
            {!loading && <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} key={item.id} />
                        )
                    }}
                    ItemSeparatorComponent={<View style={{height: 5}}/>}
                    contentContainerStyle={{paddingBottom: 140}}
                    keyExtractor={(item) => item.id}
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