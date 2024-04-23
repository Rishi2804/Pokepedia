import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { dexes, types } from "../global/UniversalData";
import { formatText } from "../global/UtiliyFunctions";
import PokedexData from "../assets/jsonData/pokedex.json"
import LoadingView from "../components/LoadingView";

const Pokedex = () => {
    const [ loading, setLoading ] = useState(false)
    const  { dex } = useDexContext()
    const [ pokemon, setPokemon ] = useState(dex)
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ filterTypes, setFilterTypes] = useState([])
    const [ dexType, setDexType ] = useState(0)

    const sortingFunction = (a, b) => {
        if (selected === 0) {
            if (state === 1) {
                return a.regionalDexNumber.find(entry => entry.name === dexes[dexType]).number - b.regionalDexNumber.find(entry => entry.name === dexes[dexType]).number
            } else if (state === 2) {
                return b.regionalDexNumber.find(entry => entry.name === dexes[dexType]).number - a.regionalDexNumber.find(entry => entry.name === dexes[dexType]).number
            }
        } else if (selected === 1) {
            if (state === 1) {
                return a.name.localeCompare(b.name)
            } else if (state === 2) {
                return b.name.localeCompare(a.name)
            }
        } else if (selected === 2) {
            // Pokemon Stat total field is messed up
            let aTotal = 0;
            a.stats.forEach((stat) => {aTotal += stat.stat})
            let bTotal = 0;
            b.stats.forEach((stat) => {bTotal += stat.stat})
            if (state === 1) {
                return aTotal - bTotal
            } else if (state === 2) {
                return bTotal - aTotal
            }
        }
    }

    useEffect(() => {
        setLoading(true);
    
        const dexString = dexes[dexType];
        let pokemonToSet = [];
    
        if (dexString !== "national") {
            const dexIds = PokedexData.find(dex => dex.name === dexString).speciesIDs;
            const regionalDex = dex.filter(mon => dexIds.includes(mon.id));
            pokemonToSet = [...regionalDex].sort(sortingFunction);
        } else {
            pokemonToSet = [...dex].sort(sortingFunction);
        }
    
        const typeNames = filterTypes.map(index => types[index].name);
        if (filterTypes.length > 0) {
            pokemonToSet = pokemonToSet.filter(mon =>
                mon.types.some(type => typeNames.includes(type))
            );
        }
    
        const regex = new RegExp(searchTerm, 'i');
        const searchResults = pokemonToSet.filter(pokemon => regex.test(pokemon.name));
    
        // Simulate async operation to set Pokemon
        setTimeout(() => {
            setPokemon(searchResults);
            setLoading(false); // Clear loading state
        }, 0);
    }, [state, selected, dexType, searchTerm, filterTypes]);
    

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
            {loading && <LoadingView />}
            {!loading && <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} dexRegion={dexes[dexType]} key={item.id} />
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
                options={["Number", "Name", "BST", "HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed"]}
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