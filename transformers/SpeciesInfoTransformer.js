import { fixFlavourText } from "../global/UtiliyFunctions";

export function transformSpeciesInfoAlt(rawJson) {
    const formData = []
    for (const json of rawJson) {
        const types = json.types.map((item) => item.type.name)
        const stats = json.stats.map((item) => {
            return {
                name: item.stat.name,
                stat: item.base_stat
            }
        })
        const abilites = json.abilities.map((item) => {
            return {
                name: item.ability.name,
                hidden: item.is_hidden
            }
        })
        const height = (json.height / 10).toFixed(1)
        const weight = (json.weight / 10).toFixed(2)
        formData.push({
            name: json.name,
            types: types,
            image: json.sprites.other.home.front_default,
            female: json.sprites.other.home.front_female,
            shiny: json.sprites.other.home.front_shiny,
            femaleShiny: json.sprites.other.home.front_shiny_female,
            abilites: abilites,
            weight: weight,
            height: height,
            stats: stats
        })
    }
    return formData
}

export function transformDexDataAlt(data) {
    const dexFiltered = data.flavor_text_entries.filter((entry) => entry.language.name === 'en')
    const dexEntries = dexFiltered.map((entry) => {
        return {
            entry: fixFlavourText(entry.flavor_text),
            game: entry.version.name
        }
    })
    return dexEntries
}

export function transformEvoChain(data) {
    const evolutionChain = [];
    
    // function parseEvolutionDetails(details) {
    //     // Extract relevant details from evolution_details
    //     return details.map(detail => {
    //         const { min_level, trigger } = detail;
    //         return { min_level, trigger: trigger.name };
    //     });
    // }
    
    function traverseChain(chain, from) {
        if (!chain || !chain.length) return;
        
        chain.forEach(evolution => {
            const to = evolution.species.name;
            const details = evolution.evolution_details;
            evolutionChain.push({ from, to, details });
            traverseChain(evolution.evolves_to, to);
        });
    }
    
    const startingPokemon = data.chain.species.name;
    traverseChain(data.chain.evolves_to, startingPokemon);
    
    return { id: data.id, chain: evolutionChain };
}