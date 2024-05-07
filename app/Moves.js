import { FlatList, SafeAreaView, ScrollView, View } from "react-native";
import { useMovesContext } from "../components/hooks/useMovesContext";
import { useEffect, useState } from "react";
import MovesView from "../components/MovesView";
import Dropdown from "react-native-input-select"
import { types } from "../global/UniversalData";
import { formatText } from "../global/UtiliyFunctions"
import BottomFilters from "../components/BottomFilters";
import LoadingView from "../components/LoadingView";
import { useThemeContext } from "../components/hooks/useThemeContext";
import { AntDesign } from '@expo/vector-icons';

const Moves = () => {
    const { theme } = useThemeContext()
    const { moves } = useMovesContext()
    const [ moveList, setMoveList ] = useState(moves)
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ filterTypes, setFilterTypes] = useState([])

    const themeSetting2 = theme.mode === 'dark' ? "white" : "black"
    const themeSetting3 = theme.mode === 'dark' ? "#1c1c1e" : "white"

    useEffect(() => {
        const sortingFunction = (a, b) => {
            if (selected === 0) {
                if (state === 1) {
                    return a.name.localeCompare(b.name)
                } else if (state === 2) {
                    return b.name.localeCompare(a.name)
                }
            } else if (selected === 1) {
                if (state === 1) {
                    if (a.power === null && b.power === null) return 0
                    if (b.power === null) return 1
                    if (a.power === null) return -1
                    return a.power - b.power
                } else if (state === 2) {
                    if (a.power === null && b.power === null) return 0
                    if (b.power === null) return -1
                    if (a.power === null) return 1
                    return b.power - a.power
                }
            } else if (selected === 2) {
                if (state === 1) {
                    if (a.accuracy === null && b.accuracy === null) return 0
                    if (b.accuracy === null) return -1
                    if (a.accuracy === null) return 1
                    return a.accuracy - b.accuracy
                } else if (state === 2) {
                    if (a.accuracy === null && b.accuracy === null) return 0
                    if (b.accuracy === null) return 1
                    if (a.accuracy === null) return -1
                    return b.accuracy - a.accuracy
                }
            } else if (selected === 3) {
                if (state === 1) {
                    if (a.pp === null && b.pp === null) return 0
                    if (b.pp === null) return 1
                    if (a.pp === null) return -1
                    return a.pp - b.pp
                } else if (state === 2) {
                    if (a.pp === null && b.pp === null) return 0
                    if (b.pp === null) return -1
                    if (a.pp === null) return 1
                    return b.pp - a.pp
                }
            }
        }

        setLoading(true)

        let movesToSet = []
        movesToSet = [...moves].sort(sortingFunction)

        if (filterTypes.length > 0) {
            movesToSet = movesToSet.filter(move => filterTypes.includes(move.type))
        }

        const regex = new RegExp(searchTerm, 'i');
        const searchResults = movesToSet.filter(move => regex.test(formatText(move.name)));

        setTimeout(() => {
            setMoveList(searchResults)
            setLoading(false)
        }, 0)

    }, [state, selected, searchTerm, filterTypes])

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: theme.mode === "dark" ? "#000" : "#f2f2f7"}}>
            <View>
                <ScrollView horizontal style={{flexDirection: "row"}}>    
                    <Dropdown
                        isMultiple
                        placeholder="Select Types"
                        options={types.map(item => {return{value: item.name, label: formatText(item.name)}})}
                        selectedValue={filterTypes}
                        onValueChange={(value) => setFilterTypes(value)}
                        dropdownStyle={{paddingRight: 50, borderColor: themeSetting2, backgroundColor: themeSetting3}}
                        placeholderStyle={{color: themeSetting2}}
                        selectedItemStyle={{color: themeSetting2}}
                        dropdownIcon={<AntDesign name="down" size={20} color={themeSetting2} />}
                        dropdownIconStyle={{top: 20}}
                        dropdownContainerStyle={{flex: 1}}
                        modalControls={{
                            modalOptionsContainerStyle: {
                                backgroundColor: themeSetting3
                            }
                        }}
                        checkboxControls={{
                            checkboxLabelStyle: {
                                color: themeSetting2
                            },
                            checkboxStyle: {
                                borderColor: themeSetting2
                            },
                        }}
                    />
                </ScrollView>
            </View>
            {loading && <LoadingView />}
            {
                !loading &&
                <View style={{paddingHorizontal: 10}}>
                    <FlatList
                        data={moveList}
                        renderItem={({ item }) => {
                            return (
                                <MovesView move={item}/>
                            )
                        }}
                        ItemSeparatorComponent={<View style={{height: 5}}/>}
                        contentContainerStyle={{paddingBottom: 140}}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            }
            <BottomFilters 
                state={state} setState={setState}
                selected={selected} setSelected={setSelected}
                setSearchTerm={setSearchTerm}
                options={["Name", "Power", "Accuracy", "PP"]}
            />
        </SafeAreaView>
    );
}

export default Moves;