import LoadingView from "../components/LoadingView"
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useEffect } from "react"

import { useDexContext } from "../components/hooks/useDexContext"

export default function Page() {
    const  { dex, dispatch } = useDexContext()
    useEffect(() => {

        const fetchPokemon = async () => {
            console.log("Start Fetching Pokemon")
            const query = `
            query {
                species: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                    name
                    varieties: pokemon_v2_pokemons {
                        name
                        is_default
                        types: pokemon_v2_pokemontypes {
                            type: pokemon_v2_type {
                                name
                            }
                        }
                        sprites: pokemon_v2_pokemonsprites {
                            sprites(path: "other")
                        }
                    }
                    dexNumbers: pokemon_v2_pokemondexnumbers {
                        number: pokedex_number
                        dex: pokemon_v2_pokedex {
                            name
                            region: pokemon_v2_region {
                                name
                            }
                        }
                    }
                }
            }              
            `
            const response = await fetch("https://beta.pokeapi.co/graphql/v1beta",
                {
                    method: "POST",
                    body: JSON.stringify({
                        query: query
                    })
                }
            )

            
            if (response.ok) {
                const json = await response.json()
                let picturesForFetch = []
                let finalArray = json.data.species.map((species, index) => {
                    const defaultForm = species.varieties.find((form) => form.is_default)
                    const altForms = species.varieties.filter((form) => !form.is_default)
                    const dexNumbers = species.dexNumbers.map((dex) => {
                        return {
                            number: dex.number,
                            name: dex.dex.name,
                            region: dex.dex.region ? dex.dex.region.name : dex.dex.region
                        }
                    })
                    const nationalDexNumber = dexNumbers.find((dex) => dex.name === 'national').number
                    const altDexNumbers = dexNumbers.filter((dex) => dex.name !== 'national')
                    const homeImg = defaultForm.sprites[0].sprites.home.front_default
                    const officialArtwork = defaultForm.sprites[0].sprites['official-artwork'].front_default
                    if (!homeImg) picturesForFetch.push({name: defaultForm.name, formIndex: -1, dexIndex: index})
                    return {
                        name: species.name,
                        dexNumber: nationalDexNumber,
                        types: defaultForm.types.map((item) => item.type.name),
                        image: homeImg ? homeImg : officialArtwork,
                        regionalDexNumbers: altDexNumbers,
                        altForms: altForms.map((form, formIndex) => {
                            const homeImg = form.sprites[0].sprites.home.front_default
                            const officialArtwork = form.sprites[0].sprites['official-artwork'].front_default
                            if (!homeImg) picturesForFetch.push({name: form.name, formIndex: formIndex, dexIndex: index})
                            return {
                                name: form.name,
                                types: form.types.map((item) => item.type.name),
                                image: homeImg ? homeImg : officialArtwork,
                            }
                        })
                    }
                })
                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
                console.log("Done fetching Pokemon");
                for (const item of picturesForFetch) {
                    const altResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.name}`);
                    const altJson = await altResponse.json();
                    const altImage = altJson.sprites.other.home.front_default
                    if (altResponse.ok) {
                        if (item.formIndex === -1) {
                            finalArray[item.dexIndex].image = altImage
                        } else {
                            finalArray[item.dexIndex].altForms[item.formIndex].image = altImage
                        }
                    }
                }
                dispatch({type: 'SET_DEX_INFO', payload: finalArray})
                console.log("Done fetching Missing Images");
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
                        image: detailedResponses[index].sprites.other.home.front_default,
                        regionalDexNumbers: [],
                        altForms: []
                    };
                }));
                dispatch({type: 'SET_DEX_INFO', payload: finalResponse})
                console.log('dispatch')
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
        "Inconsolata SemiBold": require("../assets/fonts/InconsolataSemiBold.ttf"),
        "Inconsolata Bold": require("../assets/fonts/InconsolataBold.ttf"),
    })
    return <LoadingView />
}