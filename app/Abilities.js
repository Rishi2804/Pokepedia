import { SafeAreaView, Text, FlatList, View } from "react-native";
import { useAbilitiesContext } from "../components/hooks/useAbilitiesContext"
import AbilitiesView from "../components/AbilitiesView";

const Abilities = () => {
    const { abilities } = useAbilitiesContext()

    return(
        <SafeAreaView>
            <View style={{paddingHorizontal: 10}}>
                <FlatList
                    data={abilities}
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
        </SafeAreaView>
    );
}

export default Abilities;