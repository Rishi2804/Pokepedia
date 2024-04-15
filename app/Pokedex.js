import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonModalListView from "../components/PokemonModalListView";

const Pokedex = () => {
    const [pokemon, setPokemon] = useState([])

    useEffect(() => {
        const fetchPokemonSpecies = async () => {
            // console.log("Start fetching")
            // const response = await fetch("https://pokeapi.co/api/v2/pokedex/1")

            // const json = await response.json()

            // const finalResponse = []

            // if (response.ok) {
            //     for (const entry of json.pokemon_entries) {
            //         const speciesInfo = await fetch(entry.pokemon_species.url)
            //         const speciesResult = await speciesInfo.json()
            //         if (speciesInfo.ok) {
            //             const detailedInfo = await fetch(speciesResult.varieties[0].pokemon.url)
            //             const detailedResponse = await detailedInfo.json()
            //             if (detailedInfo.ok) {
            //                 finalResponse.push({ name: entry.pokemon_species.name, dexNumber: entry.entry_number, types: detailedResponse.types })
            //             }
            //         }
            //     }
            //     console.log("Done fetching")
            //     setPokemon(finalResponse)
            // }
            console.log("Start fetching");
            const response = await fetch("https://pokeapi.co/api/v2/pokedex/1");
            const json = await response.json();
            const speciesUrls = json.pokemon_entries.map(entry => entry.pokemon_species.url);

            const batchSize = 25; // Define the batch size

            const batches = [];
            for (let i = 0; i < speciesUrls.length; i += batchSize) {
                batches.push(speciesUrls.slice(i, i + batchSize));
            }

            const finalResponse = [];

            // Fetch batches of species data
            for (const batch of batches) {
                const batchResponses = await Promise.all(batch.map(url => fetch(url).then(response => response.json())));

                // Fetch detailed info for each species in the batch
                const detailedPromises = batchResponses.map(speciesResult => {
                    const detailedUrl = speciesResult.varieties[0].pokemon.url;
                    return fetch(detailedUrl).then(response => response.json());
                });

                const detailedResponses = await Promise.all(detailedPromises);

                finalResponse.push(...batchResponses.map((speciesResult, index) => {
                    return {
                        name: speciesResult.name,
                        dexNumber: speciesResult.id,
                        types: detailedResponses[index].types.map((obj) => obj.type.name)
                    };
                }));
                setPokemon(finalResponse);
            }

            console.log("Done fetching");
        }
        fetchPokemonSpecies()
    }, [])
    return (
        <SafeAreaView>
            <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonModalListView pokemon={item} key={item.dexNumber}/>
                        )
                    }}
                    ItemSeparatorComponent={<View style={{height: 5}}/>}
                    keyExtractor={(item) => item.dexNumber}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 10
    }
})

export default Pokedex;