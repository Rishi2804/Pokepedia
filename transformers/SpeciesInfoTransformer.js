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