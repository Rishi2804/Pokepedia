import { FlatList, SafeAreaView, Text, View } from "react-native";
import { useMovesContext } from "../components/hooks/useMovesContext";
import { useState } from "react";
import MovesView from "../components/MovesView";

const Moves = () => {
    const { moves } = useMovesContext()
    const [ moveList, setMoveList ] = useState(moves)

    return(
        <SafeAreaView>
            <View style={{paddingHorizontal: 10}}>
                <FlatList
                    data={moves}
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
        </SafeAreaView>
    );
}

export default Moves;