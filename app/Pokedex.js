import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";
import BottomFilters from "../components/BottomFilters";
import Dropdown from "react-native-input-select"
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { dexes, types } from "../global/UniversalData";
import { formatName, formatText } from "../global/UtiliyFunctions";
import PokedexData from "../assets/jsonData/pokedex.json"
import LoadingView from "../components/LoadingView";
import { dexToNameLabel } from "../maps/DexToNameLabelMap";

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
    const [ generation, setGeneration ] = useState([])
    const genList = ["Generation I", "Generation II", "Generation III",
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
            let bTotal = 0;
            if (a.formIndex) {
                a.forms[a.formIndex].stats.forEach((stat) => {aTotal += stat.stat})
            } else {
                a.stats.forEach((stat) => {aTotal += stat.stat})    
            }
            if (b.formIndex) {
                b.forms[b.formIndex].stats.forEach((stat) => {bTotal += stat.stat})
            } else {
                b.stats.forEach((stat) => {bTotal += stat.stat})
            }
            if (state === 1) {
                return aTotal - bTotal
            } else if (state === 2) {
                return bTotal - aTotal
            }
        } else if (selected >= 3 && selected <= 8) {
            const statIndex = selected - 3
            let aStat = a.stats[statIndex].stat
            let bStat = b.stats[statIndex].stat
            if (a.formIndex) {
                aStat = a.forms[a.formIndex].stats[statIndex].stat
            }
            if (b.formIndex) {
                bStat = b.forms[b.formIndex].stats[statIndex].stat
            }
            if (state === 1) {
                return aStat - bStat
            } else if (state === 2) {
                return bStat - aStat
            }
        }
    }

    useEffect(() => {
        setLoading(true);
        let pokemonToSet = [];
    
        if (dexType !== "national") {
            const dexIds = PokedexData.find(dex => dex.name === dexType).speciesIDs;
            let regionalDex = dex.filter(mon => dexIds.includes(mon.id));
            const alolaDexes = ['original-alola', 'original-melemele', 'original-akala', 'original-ulaula', 'original-poni',
            'updated-alola', 'updated-melemele', 'updated-akala', 'updated-ulaula', 'updated-poni']
            const galarDexes = ['galar', 'isle-of-armor', 'crown-tundra']
            if (alolaDexes.includes(dexType)) {
                regionalDex.forEach(mon => {
                    const alolanForm = mon.forms.findIndex(form => form.name.split('-').includes('alola'))
                    if (alolanForm > 0) {
                        mon['formIndex'] = alolanForm
                    } else {
                        mon['formIndex'] = undefined
                    }
                })
            } else if (galarDexes.includes(dexType)) {
                regionalDex.forEach(mon => {
                    const galarianForm = mon.forms.findIndex(form => form.name.split('-').includes('galar'))
                    if (galarianForm > 0) {
                        mon['formIndex'] = galarianForm
                    } else {
                        mon['formIndex'] = undefined
                    }
                })
            } else if (dexType === 'hisui') {
                regionalDex.forEach(mon => {
                    const hisuianForm = mon.forms.findIndex(form => form.name.split('-').includes('hisui'))
                    if (hisuianForm > 0) {
                        mon['formIndex'] = hisuianForm
                    } else {
                        mon['formIndex'] = undefined
                    }
                })
            } else if (dexType === 'paldea') {
                regionalDex.forEach(mon => {
                    const paldeanForm = mon.forms.findIndex(form => form.name.split('-').includes('paldea'))
                    if (paldeanForm > 0) {
                        mon['formIndex'] = paldeanForm
                    } else {
                        mon['formIndex'] = undefined
                    }
                })
            } else {
                regionalDex.forEach(mon => {
                    mon['formIndex'] = undefined
                })
            }
            pokemonToSet = [...regionalDex].sort(sortingFunction);
        } else {
            pokemonToSet = [...dex].sort(sortingFunction);
            pokemonToSet.forEach(mon => {
                mon['formIndex'] = undefined
            })
        }
    
        if (filterTypes.length > 0) {
            pokemonToSet = pokemonToSet.filter(mon => {
                if (mon.formIndex > 0) {
                    return mon.forms[mon.formIndex].types.some(type => filterTypes.includes(type))
                }
                return mon.types.some(type => filterTypes.includes(type))
            }
            );
        }

        if (generation.length > 0) {
            pokemonToSet = pokemonToSet.filter(mon => generation.includes(mon.generation))
        }
    
        const regex = new RegExp(searchTerm, 'i');
        const searchResults = pokemonToSet.filter(pokemon => regex.test(formatName(pokemon.name)));
    
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
                    <Dropdown
                        options={dexes.map(item => {return{value: item, label: dexToNameLabel[item]}})}
                        placeholder="Select a Dex"
                        selectedValue={dexType}
                        onValueChange={(value) => {
                            if (value) {
                                setDexType(value)
                            } else {
                                setDexType(dexType)
                            }
                        }}
                        dropdownStyle={{paddingRight: 50}}
                        dropdownContainerStyle={{flex: 1}}
                    />
                    <Dropdown
                        isMultiple
                        options={genList.map((gen, index) => {return{value: index + 1, label: gen}})}
                        placeholder="Select Generations"
                        selectedValue={generation}
                        onValueChange={(value) => {setGeneration(value)}}
                        dropdownStyle={{paddingRight: 50}}
                        dropdownContainerStyle={{flex: 1}}
                    />
                    <Dropdown
                        isMultiple
                        options={types.map(item => {return{value: item.name, label: formatText(item.name)}})}
                        placeholder="Select Types"
                        selectedValue={filterTypes}
                        onValueChange={(value) => {setFilterTypes(value)}}
                        dropdownStyle={{paddingRight: 50}}
                        dropdownContainerStyle={{flex: 1}}
                    />
                </ScrollView>
            </View>
            {loading && <LoadingView />}
            {!loading && <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} displayForm={item.formIndex} dexRegion={dexType} key={item.id} />
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