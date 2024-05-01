import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, View } from "react-native";
import { useAbilitiesContext } from "../components/hooks/useAbilitiesContext"
import AbilitiesView from "../components/AbilitiesView";
import BottomFilters from "../components/BottomFilters";
import { formatText } from "../global/UtiliyFunctions";
import LoadingView from "../components/LoadingView";

const Abilities = () => {
    const { abilities } = useAbilitiesContext()
    const [ abilitiesList, setAbilitiesList ] = useState(abilities)
    const [ state, setState ] = useState(1)
    const [ selected, setSelected ] = useState(0)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const sortingFunction = (a, b) => {
            if (selected === 0) {
                if (state === 1) {
                    return a.name.localeCompare(b.name)
                } else if (state === 2) {
                    return b.name.localeCompare(a.name)
                }
            }
        }

        setLoading(true)

        let abilitiesToSet = []
        abilitiesToSet = [...abilities].sort(sortingFunction)

        const regex = new RegExp(searchTerm, 'i');
        const searchResults = abilitiesToSet.filter(ability => regex.test(formatText(ability.name)));

        setTimeout(() => {
            setAbilitiesList(searchResults)
            setLoading(false)
        }, 0)

    }, [state, selected, searchTerm])

    return(
        <SafeAreaView style={{flex: 1}}>
            { loading && <LoadingView />}
            {
                !loading &&
                <View style={{paddingHorizontal: 10}}>
                    <FlatList
                        data={abilitiesList}
                        renderItem={({ item }) => {
                            return (
                                <AbilitiesView ability={item} />
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
                options={["Name"]}
            />
        </SafeAreaView>
    );
}

export default Abilities;