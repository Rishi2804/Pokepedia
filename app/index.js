import LoadingView from "../components/LoadingView"
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useEffect } from "react"

import { useDexContext } from "../components/hooks/useDexContext"

export default function Page() {
    const  { dex, dispatch } = useDexContext()
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
                let namesForFetch = []
                let finalArray = json.data.dex[0].results.map((result) => {
                    const homeImage = result.entry.info[0].sprites[0].imgPaths.other.home.front_default
                    const tempImage = result.entry.info[0].sprites[0].imgPaths.other['official-artwork'].front_default
                    if (!homeImage) namesForFetch.push(result.entry.name)
                    return {
                        name: result.entry.name,
                        dexNumber: result.dexNum,
                        types: result.entry.info[0].types.map(type => type.type.name),
                        image: homeImage ? homeImage : tempImage
                    }
                })

                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
                console.log("Done fetching");

                for (const name of namesForFetch) {
                    const altResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    const altJson = await altResponse.json();
                    const altImage = altJson.sprites.other.home.front_default

                    for (let i = 0; i < finalArray.length; i++) {
                        if (finalArray[i].name === name) {
                            finalArray[i].image = altImage;
                            break; // Stop searching once the name is found
                        }
                    }
                }

                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
                console.log("Done updating images");
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
        if (dex.length === 0) fetchPokemon()
    }, [])


    let [fontsLoaded] = useFonts({
        "Geologica Regular": require("../assets/fonts/GeologicaRegular.ttf"),
        "Geologica SemiBold": require("../assets/fonts/GeologicaSemiBold.ttf"),
        "Geologica Bold": require("../assets/fonts/GeologicaBold.ttf"),
        "Inconsolata Regular": require("../assets/fonts/InconsolataRegular.ttf"),
        "Inconsolata Bold": require("../assets/fonts/InconsolataBold.ttf"),
    })
    return <LoadingView />
}