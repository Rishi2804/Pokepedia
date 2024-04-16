import { useEffect } from "react";
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import PokemonListView from "../components/PokemonListView";

import { useDexContext } from "../components/hooks/useDexContext";

const Pokedex = () => {
    const  { dex: pokemon, dispatch } = useDexContext()

    useEffect(() => {

        const fetchPokemon = async () => {
            console.log("Start fetching");
            const query = `
            query ($dex: String) {
            dex: pokemon_v2_pokedex(where: {name: {_eq: $dex}}) {
                dexName: name
                results: pokemon_v2_pokemondexnumbers(order_by: {pokedex_number: asc}) {
                entry: pokemon_v2_pokemonspecy {
                    name
                    info: pokemon_v2_pokemons {
                    types: pokemon_v2_pokemontypes {
                        type: pokemon_v2_type {
                            name
                        }
                    }
                    sprites: pokemon_v2_pokemonsprites {
                        imgPaths: sprites
                    }
                    }
                }
                dexNum: pokedex_number
                }
            }
            }              
            `
            const response = await fetch("https://beta.pokeapi.co/graphql/v1beta",
                {
                    method: "POST",
                    body: JSON.stringify({
                    query: query,
                    variables: {dex: "national"}
                    })
                }
            )

            const json = await response.json()
            if (response.ok) {
                const finalArray = json.data.dex[0].results.map((result) => {
                    return {
                        name: result.entry.name,
                        dexNumber: result.dexNum,
                        types: result.entry.info[0].types.map(type => type.type.name),
                        image: result.entry.info[0].sprites[0].imgPaths.other.home.front_default
                    }
                })
                //setPokemon(finalArray);
                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
                console.log("Done fetching");
            } else {
                fetchPokemonAlt()
            }
        }

        const fetchPokemonAlt = async () => {
            console.log("Start REST fetching");
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
                        types: detailedResponses[index].types.map((obj) => obj.type.name),
                        image: detailedResponses[index].sprites.other.home.front_default
                    };
                }));
                //setPokemon(finalResponse);
                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
            }

            console.log("Done REST fetching");
        }

        fetchPokemon()
    }, [])
    return (
        <SafeAreaView>
            <View style={styles.scrollContainer}>
                <FlatList 
                    data={pokemon}
                    renderItem={({ item }) => {
                        return(
                            <PokemonListView pokemon={item} key={item.dexNumber} />
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