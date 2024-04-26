import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";
import ToggleButtons from "../components/ToggleButtons"
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
    const [ toggled, setToggled ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ filterTypes, setFilterTypes] = useState([])
    const [ dexType, setDexType ] = useState("national")
    const [ generation, setGeneration ] = useState(0)
    const genList = ["All", "Generation I", "Generation II", "Generation III",
                        "Generation IV", "Generation V", "Generation VI",
                        "Generation VII", "Generation VIII", "Generation IX"]

    const sortingFunction = (a, b) => {
        if (selected === 0) {
            if (state === 1) {
                return a.regionalDexNumber.find(entry => entry.name === dexType).number - b.regionalDexNumber.find(entry => entry.name === dexType).number
            } else if (state === 2) {
                return b.regionalDexNumber.find(entry => entry.name === dexType).number - a.regionalDexNumber.find(entry => entry.name === dexType).number
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
        } else if (selected >= 3 && selected <= 8) {
            const statIndex = selected - 3
            if (state === 1) {
                return a.stats[statIndex].stat - b.stats[statIndex].stat
            } else if (state === 2) {
                return b.stats[statIndex].stat - a.stats[statIndex].stat
            }
        }
    }

    useEffect(() => {
        setLoading(true);
        let pokemonToSet = [];
    
        if (dexType !== "national") {
            const dexIds = PokedexData.find(dex => dex.name === dexType).speciesIDs;
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

        if (generation > 0) {
            pokemonToSet = pokemonToSet.filter(mon =>
                mon.generation === generation
            );
        }
    
        const regex = new RegExp(searchTerm, 'i');
        const searchResults = pokemonToSet.filter(pokemon => regex.test(pokemon.name));
    
        // Simulate async operation to set Pokemon
        setTimeout(() => {
            setPokemon(searchResults);
            setLoading(false); // Clear loading state
        }, 0);
    }, [state, selected, dexType, searchTerm, filterTypes, generation]);
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                <ScrollView horizontal style={{flexDirection: "row"}}>    
                    <SelectList 
                        data={dexes.map((item, index) => {return{key: index, value: formatText(item)}})} 
                        save="key"
                        setSelected={(key) => setDexType(dexes[key])}
                        defaultOption={{key: 0, value: "National"}}
                        boxStyles={{backgroundColor: "white"}}
                        dropdownStyles={{backgroundColor: "white"}}
                    />
                    <SelectList 
                        data={genList.map((gen, index) => {return{key: index, value: gen}})} 
                        save="key"
                        setSelected={(key) => setGeneration(key)}
                        boxStyles={{backgroundColor: "white"}}
                        dropdownStyles={{backgroundColor: "white"}}
                        defaultOption={{key: 0, value: "All"}}
                    />
                    <MultipleSelectList 
                        data={types.map((item, index) => {return{key: index, value: formatText(item.name)}})} 
                        save="key"
                        setSelected={(key) => setFilterTypes(key)}
                        label="Types"
                        boxStyles={{backgroundColor: "white"}}
                        dropdownStyles={{backgroundColor: "white"}}
                    />
                </ScrollView>
            </View>
            {loading && <LoadingView />}
            {!loading && <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} dexRegion={dexType} key={item.id} />
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