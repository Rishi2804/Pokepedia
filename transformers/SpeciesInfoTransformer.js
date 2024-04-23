import { fixFlavourText, formatText, formatName } from "../global/UtiliyFunctions";

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
    
    function parseEvolutionDetails(details) {
        const filteredDetails = details.map((details) => {
            return Object.entries(details).reduce((acc, [key, value]) => {
                if (value) {
                    if (typeof value === 'object') {
                        acc[key] = value.name
                    } else {
                        acc[key] = value
                    }
                }
                return acc
            }, {})
        })
        let stringDetails = filteredDetails.map(item => formatEvoDetails(item))
        stringDetails = [... new Set(stringDetails)]
        stringDetails.map(item => console.log(item))
        return stringDetails
    }
    
    function traverseChain(chain, from) {
        if (!chain || !chain.length) return;
        
        chain.forEach(evolution => {
            const to = evolution.species.name;
            const details = parseEvolutionDetails(evolution.evolution_details);
            evolutionChain.push({ from, to, details });
            traverseChain(evolution.evolves_to, to);
        });
    }
    
    const startingPokemon = data.chain.species.name;
    traverseChain(data.chain.evolves_to, startingPokemon);
    
    return { id: data.id, chain: evolutionChain };
}

export function formatEvoDetails(details) {
    let string = ''
    string = formatText(details.trigger)

    if (details.min_level) {
        string += ' at level '
        string += details.min_level.toString()
    }
    if (details.min_happiness) {
        if (details.min_happiness > 0) {
            string += ' with high happiness'
        }
    }
    if (details.min_affection) {
        if (details.min_affection > 0) {
            string += ' with high affection'
        }
    }
    if (details.min_beauty) {
        if (details.min_beauty > 0) {
            string += ' with high beauty value'
        }
    }
    if (details.time_of_day) {
        string += ' during '
        string += details.time_of_day
    }
    if (details.held_item) {
        string += ' holding '
        string += formatText(details.held_item)
    }
    if (details.item) {
        string += ' given '
        string += formatText(details.item)
    }
    if (details.gender) {
        if (details.gender === 1) {
            string += ' while female'
        } else if (details.gender === 2) {
            string += ' while male'
        }
    }
    if (details.trade_species) {
        string += ' with '
        string += formatName(details.trade_species)
    }
    if (details.known_move) {
        string += ' knowing '
        string += formatText(details.known_move)
    }
    if (details.known_move_type) {
        string += ' knowing move of type '
        string += details.known_move_type
    }
    if (details.location) {
        string += ' at '
        string += formatText(details.location)
    }
    if (details.relative_physical_stats !== undefined) {
        if (details.relative_physical_stats === 1) {
            string += ' with attack higher than defence'
        } else if (details.relative_physical_stats === -1) {
            string += ' with defense higher than attack'
        } else if (details.relative_physical_stats === 0) {
            string += ' with attack equal to defence'
        }
    }
    if (details.party_species) {
        string += ' with '
        string += formatText(details.party_species)
        string += ' in party'
    }
    if (details.party_type) {
        string += ' with Pokemon of type '
        string += details.party_species
        string += ' in party'
    }
    if (details.needs_overworld_rain) {
        string += ' in the rain'
    }
    if (details.turn_upside_down) {
        string += ' while device upside down'
    }
    return string
}

export function filterEvoChain(chain, name) {
    let containsRegional = false
    for (const subChain of chain) {
        if (subChain.regional) {
            containsRegional = true;
            break;
        }
    }
    if (!containsRegional) return chain

    const fromLines = chain.filter(subchain => subchain.from === name)
    const toLines = chain.filter(subchain => subchain.to === name)

    let finalChain = []
    if (fromLines.length > 0 && toLines.length === 0) {
        finalChain = [...fromLines]
        fromLines.forEach(subline => {
            const temp = chain.filter(subChain => subChain.from === subline.to)
            finalChain = [...finalChain, ...temp]
        });
        return finalChain
    } else if (fromLines.length > 0 && toLines.length > 0) {
        finalChain = chain.filter(subchain => {
            return (subchain.from === name || subchain.to === name)
        })
        return finalChain
    } else if (fromLines.length === 0 && toLines.length > 0) {
        toLines.forEach(subline => {
            const temp = chain.filter(subChain => subChain.to === subline.from)
            finalChain = [...finalChain, ...temp]
        });
        finalChain = [...finalChain, ...toLines]
        return finalChain
    }
}